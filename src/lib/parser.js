import tokensToAST from './util/tokensToAST';
import {stringToTokens} from './util/stringToTokens';
import {cleanupTokens} from './util/cleanupTokens';
import groupTextTokens from './util/groupTextTokens';
import omitListItemParagraph from './util/omitListItemParagraph';

/**
 *
 * @param {string} source
 * @param {function} [renderer]
 * @param {AstRenderer} [markdownIt]
 * @return {View}
 */
export default function parser(source, renderer, markdownIt) {
  if (Array.isArray(source)) {
    return renderer(source);
  }

  let tokens = stringToTokens(source, markdownIt);
  tokens = cleanupTokens(tokens);
  tokens = groupTextTokens(tokens);
  tokens = omitListItemParagraph(tokens);

  const astTree = tokensToAST(tokens);

  return renderer(astTree);
}
