const regSelectOpenClose = /_open|_close/g;

/**
 *
 * @example {
    "type": "heading_open",
    "tag": "h1",
    "attrs": null,
    "map": [
      1,
      2
    ],
    "nesting": 1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "#",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  }
 * @param token
 * @return {String}
 */
export default function getTokenTypeByToken(token) {
  let cleanedType = 'unknown';

  if (token.type) {
    cleanedType = token.type.replace(regSelectOpenClose, '');
  }

  switch (cleanedType) {
    case 'heading': {
      cleanedType = `${cleanedType}${token.tag.substr(1)}`;
      break;
    }
    default: {
      break;
    }
  }

  return cleanedType;
}
