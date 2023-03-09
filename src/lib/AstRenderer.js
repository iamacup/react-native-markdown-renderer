import {StyleSheet} from 'react-native';

import getUniqueID from './util/getUniqueID';
import convertAdditionalStyles from './util/convertAdditionalStyles';

import textStyleProps from './data/textStyleProps';

export default class AstRenderer {
  /**
   *
   * @param {Object.<string, function>} renderRules
   * @param {any} style
   */
  constructor(
    renderRules,
    style,
    onLinkPress,
    maxTopLevelChildren,
    topLevelMaxExceededItem,
    allowedImageHandlers,
    defaultImageHandler,
    debugPrintTree,
  ) {
    this._renderRules = renderRules;
    this._style = style;
    this._onLinkPress = onLinkPress;
    this._maxTopLevelChildren = maxTopLevelChildren;
    this._topLevelMaxExceededItem = topLevelMaxExceededItem;
    this._allowedImageHandlers = allowedImageHandlers;
    this._defaultImageHandler = defaultImageHandler;
    this._debugPrintTree = debugPrintTree;
  }

  /**
   *
   * @param {string} type
   * @return {string}
   */
  getRenderFunction = (type) => {
    const renderFunction = this._renderRules[type];

    if (!renderFunction) {
      console.warn(
        `Warning, unknown render rule encountered: ${type}. 'unknown' render rule used (by default, returns null - nothing rendered)`,
      );
      return this._renderRules.unknown;
    }

    return renderFunction;
  };

  /**
   *
   * @param node
   * @param parentNodes
   * @return {*}
   */
  renderNode = (node, parentNodes, isRoot = false) => {
    const renderFunction = this.getRenderFunction(node.type);
    const parents = [...parentNodes];

    if (this._debugPrintTree === true) {
      let str = '';

      for (let a = 0; a < parents.length; a++) {
        str = str + '-';
      }

      console.log(`${str}${node.type}`);
    }

    parents.unshift(node);

    // calculate the children first
    let children = node.children.map((value) => {
      return this.renderNode(value, parents);
    });

    // render any special types of nodes that have different renderRule function signatures

    if (node.type === 'link' || node.type === 'blocklink') {
      return renderFunction(
        node,
        children,
        parentNodes,
        this._style,
        this._onLinkPress,
      );
    }

    if (node.type === 'image') {
      return renderFunction(
        node,
        children,
        parentNodes,
        this._style,
        this._allowedImageHandlers,
        this._defaultImageHandler,
      );
    }

    // We are at the bottom of some tree - grab all the parent styles
    // this effectively grabs the styles from parents and
    // applies them in order of priority parent (least) to child (most)
    // to allow styling global, then lower down things individually

    // we have to handle list_item seperately here because they have some child
    // pseudo classes that need the additional style props from parents passed down to them
    if (children.length === 0 || node.type === 'list_item') {
      const styleObj = {};

      for (let a = parentNodes.length - 1; a > -1; a--) {
        // grab and additional attributes specified by markdown-it
        let refStyle = {};

        if (
          parentNodes[a].attributes &&
          parentNodes[a].attributes.style &&
          typeof parentNodes[a].attributes.style === 'string'
        ) {
          refStyle = convertAdditionalStyles(parentNodes[a].attributes.style);
        }

        // combine in specific styles for the object
        if (this._style[parentNodes[a].type]) {
          refStyle = {
            ...refStyle,
            ...StyleSheet.flatten(this._style[parentNodes[a].type]),
          };

          // workaround for list_items and their content cascading down the tree
          if (parentNodes[a].type === 'list_item') {
            let contentStyle = {};

            if (parentNodes[a + 1].type === 'bullet_list') {
              contentStyle = this._style.bullet_list_content;
            } else if (parentNodes[a + 1].type === 'ordered_list') {
              contentStyle = this._style.ordered_list_content;
            }

            refStyle = {
              ...refStyle,
              ...StyleSheet.flatten(contentStyle),
            };
          }
        }

        // then work out if any of them are text styles that should be used in the end.
        const arr = Object.keys(refStyle);

        for (let b = 0; b < arr.length; b++) {
          if (textStyleProps.includes(arr[b])) {
            styleObj[arr[b]] = refStyle[arr[b]];
          }
        }
      }

      return renderFunction(node, children, parentNodes, this._style, styleObj);
    }

    // cull top level children

    if (
      isRoot === true &&
      this._maxTopLevelChildren &&
      children.length > this._maxTopLevelChildren
    ) {
      children = children.slice(0, this._maxTopLevelChildren);
      children.push(this._topLevelMaxExceededItem);
    }

    // render anythign else that has a normal signature

    return renderFunction(node, children, parentNodes, this._style);
  };

  /**
   *
   * @param nodes
   * @return {*}
   */
  render = (nodes) => {
    const root = {type: 'body', key: getUniqueID(), children: nodes};
    return this.renderNode(root, [], true);
  };
}
