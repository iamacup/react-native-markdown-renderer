export default function renderInlineAsText(tokens) {
  var result = '';

  for (var i = 0, len = tokens.length; i < len; i++) {
    if (tokens[i].type === 'text') {
      result += tokens[i].content;
    } else if (tokens[i].type === 'image') {
      result += renderInlineAsText(tokens[i].children);
    }
  }

  return result;
}
