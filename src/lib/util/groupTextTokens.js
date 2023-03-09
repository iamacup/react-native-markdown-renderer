import Token from './Token';

export default function groupTextTokens(tokens) {
  const result = [];

  let hasGroup = false;

  tokens.forEach((token, index) => {
    if (!token.block && !hasGroup) {
      hasGroup = true;
      result.push(new Token('textgroup', 1));
      result.push(token);
    } else if (!token.block && hasGroup) {
      result.push(token);
    } else if (token.block && hasGroup) {
      hasGroup = false;
      result.push(new Token('textgroup', -1));
      result.push(token);
    } else {
      result.push(token);
    }
  });

  return result;
}
