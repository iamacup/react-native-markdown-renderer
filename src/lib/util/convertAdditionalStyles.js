import cssToReactNative from 'css-to-react-native';

export default function convertAdditionalStyles(style) {
  const rules = style.split(';');

  const tuples = rules
    .map((rule) => {
      let [key, value] = rule.split(':');

      if (key && value) {
        key = key.trim();
        value = value.trim();
        return [key, value];
      } else {
        return null;
      }
    })
    .filter((x) => {
      return x != null;
    });

  const conv = cssToReactNative(tuples);

  return conv;
}
