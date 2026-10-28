import BaseSchema from "./BaseSchema.js";

export default class ArraySchema extends BaseSchema {
  constructor(customValidators) {
    super(customValidators);
    this.addRule("isArray", (value) => Array.isArray(value));
  }

  sizeof(size) {
    return this.addRule("sizeof", (value) => value.length === size);
  }
}
