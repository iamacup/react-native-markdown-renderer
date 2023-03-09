export default function omitListItemParagraph(tokens) {
  // used to ensure that we remove the correct ending paragraph token
  let depth = null;
  return tokens.filter((token, index) => {
    // update depth if we've already removed a starting paragraph token
    if (depth !== null) {
      depth = depth + token.nesting;
    }

    // check for a list_item token followed by paragraph token (to remove)
    if (token.type === 'list_item' && token.nesting === 1 && depth === null) {
      const next = index + 1 in tokens ? tokens[index + 1] : null;
      if (next && next.type === 'paragraph' && next.nesting === 1) {
        depth = 0;
        return true;
      }
    } else if (token.type === 'paragraph') {
      if (token.nesting === 1 && depth === 1) {
        // remove the paragraph token immediately after the list_item token
        return false;
      } else if (token.nesting === -1 && depth === 0) {
        // remove the ending paragraph token; reset depth
        depth = null;
        return false;
      }
    }
    return true;
  });
}
