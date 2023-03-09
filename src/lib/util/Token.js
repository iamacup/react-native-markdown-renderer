export default class Token {
  constructor(type, nesting = 0, children = null, block = false) {
    this.type = type;
    this.nesting = nesting;
    this.children = children;
    this.block = block;
  }
}
