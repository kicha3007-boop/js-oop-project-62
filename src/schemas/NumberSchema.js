import BaseSchema from "./BaseSchema.js";

export default class NumberSchema extends BaseSchema {
  positive() {
    return this.addRule("positive", (value) => value > 0);
  }

  range(min, max) {
    return this.addRule("range", (value) => value >= min && value <= max);
  }
}
