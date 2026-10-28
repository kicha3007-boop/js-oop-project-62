import BaseSchema from "./BaseSchema.js";

export default class ObjectSchema extends BaseSchema {
  // Каждое поле проверяется своей схемой — той же, что и для отдельного значения.
  shape(fields) {
    return this.addRule("shape", (value) =>
      Object.entries(fields).every(([key, schema]) => schema.isValid(value[key])),
    );
  }
}
