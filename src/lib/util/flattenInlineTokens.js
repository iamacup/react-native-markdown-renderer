export default function flattenTokens(tokens) {
  return tokens.reduce((acc, curr) => {
    if (curr.type === 'inline' && curr.children && curr.children.length > 0) {
      const children = flattenTokens(curr.children);
      while (children.length) {
        acc.push(children.shift());
      }
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);
}
