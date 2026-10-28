import BaseSchema from "./BaseSchema.js";

export default class StringSchema extends BaseSchema {
  minLength(length) {
    return this.addRule("minLength", (value) => value.length >= length);
  }

  contains(substring) {
    return this.addRule("contains", (value) => value.includes(substring));
  }

  // Для строки пустая строка тоже пустое значение.
  isEmpty(value) {
    return super.isEmpty(value) || value === "";
  }
}
