// Общая часть всех схем: хранилище правил по имени, обязательность и запуск проверки.
export default class BaseSchema {
  #rules = new Map();

  #isRequired = false;

  #customValidators;

  // customValidators — реестр пользовательских правил своего типа; читается при вызове test(),
  // поэтому правило, добавленное после создания схемы, тоже доступно.
  constructor(customValidators) {
    this.#customValidators = customValidators;
  }

  required() {
    this.#isRequired = true;
    return this;
  }

  // Подключает пользовательское правило, добавленное через Validator#addValidator.
  test(name, ...args) {
    const validate = this.#customValidators.get(name);
    if (!validate) {
      throw new Error(`Unknown validator "${name}"`);
    }
    return this.addRule(name, (value) => validate(value, ...args));
  }

  isValid(value) {
    if (this.isEmpty(value)) {
      return !this.#isRequired;
    }
    return [...this.#rules.values()].every((check) => check(value));
  }

  // Правило с тем же именем заменяет прежнее: последний вызов имеет приоритет.
  addRule(name, check) {
    this.#rules.set(name, check);
    return this;
  }

  // Пустое значение проходит без проверки правил, если схема не обязательная.
  isEmpty(value) {
    return value === null || value === undefined;
  }
}
