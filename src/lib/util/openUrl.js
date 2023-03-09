import {Linking} from 'react-native';

export default function openUrl(url, customCallback) {
  if (customCallback) {
    const result = customCallback(url);
    if (url && result && typeof result === 'boolean') {
      Linking.openURL(url);
    }
  } else if (url) {
    Linking.openURL(url);
  }
}
