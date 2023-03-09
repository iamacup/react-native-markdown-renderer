export function stringToTokens(source, markdownIt) {
  let result = [];
  try {
    result = markdownIt.parse(source, {});
  } catch (err) {
    console.warn(err);
  }

  return result;
}
