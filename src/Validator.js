import ArraySchema from "./schemas/ArraySchema.js";
import NumberSchema from "./schemas/NumberSchema.js";
import ObjectSchema from "./schemas/ObjectSchema.js";
import StringSchema from "./schemas/StringSchema.js";

// Классы схем по типу: новый тип — новая строка здесь и свой класс, базовый класс не меняется.
const schemaClasses = {
  string: StringSchema,
  number: NumberSchema,
  array: ArraySchema,
  object: ObjectSchema,
};

// Фабрика схем и реестр пользовательских правил по паре «тип и имя».
export default class Validator {
  #customValidators = new Map(Object.keys(schemaClasses).map((type) => [type, new Map()]));

  string() {
    return this.#createSchema("string");
  }

  number() {
    return this.#createSchema("number");
  }

  array() {
    return this.#createSchema("array");
  }

  object() {
    return this.#createSchema("object");
  }

  addValidator(type, name, fn) {
    const validators = this.#customValidators.get(type);
    if (!validators) {
      throw new Error(`Unknown schema type "${type}"`);
    }
    validators.set(name, fn);
  }

  #createSchema(type) {
    const SchemaClass = schemaClasses[type];
    return new SchemaClass(this.#customValidators.get(type));
  }
}
