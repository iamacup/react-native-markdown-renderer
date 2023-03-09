// tslint:disable:max-classes-per-file
import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';
import {ComponentType, ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';

export function getUniqueID(): string;

export function openUrl(url: string): void;

export function hasParents(parents: any[], type: string): boolean;

export type RenderFunction = (
  node: ASTNode,
  children: ReactNode[],
  parentNodes: ASTNode[],
  styles: any,
  styleObj?: any,
  // must have this so that we can have fixed overrides with more arguments
  ...args: any
) => ReactNode;

export type RenderLinkFunction = (
  node: ASTNode,
  children: ReactNode[],
  parentNodes: ASTNode[],
  styles: any,
  onLinkPress?: (url: string) => boolean,
) => ReactNode;

export type RenderImageFunction = (
  node: ASTNode,
  children: ReactNode[],
  parentNodes: ASTNode[],
  styles: any,
  allowedImageHandlers: string[],
  defaultImageHandler: string,
) => ReactNode;

export interface RenderRules {
  [name: string]: RenderFunction | undefined;

  link?: RenderLinkFunction;
  blocklink?: RenderLinkFunction;
  image?: RenderImageFunction;
}

export const renderRules: RenderRules;

export interface MarkdownParser {
  parse: (value: string, options: any) => Token[];
}

export interface ASTNode {
  type: string;
  sourceType: string; // original source token name
  sourceInfo: string;
  sourceMeta: any;
  key: string;
  content: string;
  markup: string;
  tokenIndex: number;
  index: number;
  attributes: Record<string, any>;
  children: ASTNode[];
}

export class AstRenderer {
  constructor(renderRules: RenderRules, style?: any);

  getRenderFunction(type: string): RenderFunction;

  renderNode(node: any, parentNodes: ReadonlyArray<any>): ReactNode;

  render(nodes: ReadonlyArray<any>): View;
}

export function parser(
  source: string,
  renderer: (node: ASTNode) => View,
  parser: MarkdownParser,
): any;

export function stringToTokens(
  source: string,
  markdownIt: MarkdownParser,
): Token[];

export function tokensToAST(tokens: ReadonlyArray<Token>): ASTNode[];

export interface MarkdownProps {
  rules?: RenderRules;
  style?: StyleSheet.NamedStyles<any>;
  renderer?: AstRenderer;
  markdownit?: MarkdownIt;
  mergeStyle?: boolean;
  debugPrintTree?: boolean;
  onLinkPress?: (url: string) => boolean;
  children: string;
}

type MarkdownStatic = ComponentType<MarkdownProps>;
export const Markdown: MarkdownStatic;
export type Markdown = MarkdownStatic;
export {MarkdownIt};
export default Markdown;
