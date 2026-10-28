import { beforeEach, describe, expect, test } from "vitest";
import Validator from "../index.js";

let v;

beforeEach(() => {
  v = new Validator();
});

describe("string", () => {
  test.each(["", null, undefined, "hexlet"])("без required пропускает %j", (value) => {
    expect(v.string().isValid(value)).toBe(true);
  });

  test.each([
    ["hexlet", true],
    ["", false],
    [null, false],
    [undefined, false],
  ])("required: %j → %s", (value, expected) => {
    expect(v.string().required().isValid(value)).toBe(expected);
  });

  test.each([
    ["what", true],
    ["whatthe", false],
  ])("contains(%j)", (substring, expected) => {
    expect(v.string().contains(substring).isValid("what does the fox say")).toBe(expected);
  });

  test("minLength: граница включительно", () => {
    expect(v.string().minLength(6).isValid("hexlet")).toBe(true);
    expect(v.string().minLength(7).isValid("hexlet")).toBe(false);
  });

  test("повторный вызов правила заменяет прежнее", () => {
    expect(v.string().minLength(10).minLength(4).isValid("hexlet")).toBe(true);
    expect(v.string().minLength(4).minLength(10).isValid("hexlet")).toBe(false);
  });

  test("правила складываются цепочкой", () => {
    const schema = v.string().required().contains("fox");
    expect(schema.isValid("what does the fox say")).toBe(true);

    schema.contains("cat");
    expect(schema.isValid("what does the fox say")).toBe(false);
  });
});

describe("number", () => {
  test.each([null, undefined, 0, -3])("без required пропускает %j", (value) => {
    expect(v.number().isValid(value)).toBe(true);
  });

  test("required: ноль — тоже число", () => {
    const schema = v.number().required();
    expect(schema.isValid(0)).toBe(true);
    expect(schema.isValid(null)).toBe(false);
  });

  test.each([
    [10, true],
    [0, false],
    [-10, false],
    [null, true],
  ])("positive: %j → %s", (value, expected) => {
    expect(v.number().positive().isValid(value)).toBe(expected);
  });

  test.each([
    [-5, true],
    [5, true],
    [0, true],
    [-6, false],
    [6, false],
  ])("range(-5, 5): %j → %s", (value, expected) => {
    expect(v.number().range(-5, 5).isValid(value)).toBe(expected);
  });

  test("range и positive вместе", () => {
    const schema = v.number().required().positive().range(-5, 5);
    expect(schema.isValid(-3)).toBe(false);
    expect(schema.isValid(5)).toBe(true);
  });
});

describe("array", () => {
  test.each([null, undefined, [], ["hexlet"]])("без required пропускает %j", (value) => {
    expect(v.array().isValid(value)).toBe(true);
  });

  test.each([
    [[], true],
    [["hexlet"], true],
    [null, false],
    ["hexlet", false],
  ])("required: %j → %s", (value, expected) => {
    expect(v.array().required().isValid(value)).toBe(expected);
  });

  test.each([
    [["hexlet", "code-basics"], true],
    [["hexlet"], false],
    [[], false],
  ])("sizeof(2): %j → %s", (value, expected) => {
    expect(v.array().sizeof(2).isValid(value)).toBe(expected);
  });
});

describe("object", () => {
  const user = () =>
    v.object().shape({
      name: v.string().required(),
      age: v.number().positive(),
    });

  test.each([null, undefined, {}])("без shape пропускает %j", (value) => {
    expect(v.object().isValid(value)).toBe(true);
  });

  test.each([
    [{ name: "kolya", age: 100 }, true],
    [{ name: "maya", age: null }, true],
    [{ name: "maya" }, true],
    [{ name: "", age: null }, false],
    [{ name: "ada", age: -5 }, false],
    [{ age: 10 }, false],
  ])("shape: %j → %s", (value, expected) => {
    expect(user().isValid(value)).toBe(expected);
  });

  test("вложенные объекты", () => {
    const schema = v.object().shape({
      user: v.object().required().shape({ name: v.string().required() }),
    });
    expect(schema.isValid({ user: { name: "kolya" } })).toBe(true);
    expect(schema.isValid({ user: { name: "" } })).toBe(false);
    expect(schema.isValid({})).toBe(false);
  });
});

describe("addValidator", () => {
  test("правило для строк", () => {
    v.addValidator("string", "startWith", (value, start) => value.startsWith(start));
    const schema = v.string().test("startWith", "H");
    expect(schema.isValid("exlet")).toBe(false);
    expect(schema.isValid("Hexlet")).toBe(true);
  });

  test("правило для чисел", () => {
    v.addValidator("number", "min", (value, min) => value >= min);
    const schema = v.number().test("min", 5);
    expect(schema.isValid(4)).toBe(false);
    expect(schema.isValid(6)).toBe(true);
  });

  test("правило, добавленное после создания схемы, доступно ей", () => {
    const schema = v.string();
    v.addValidator("string", "isUpper", (value) => value === value.toUpperCase());
    expect(schema.test("isUpper").isValid("HEXLET")).toBe(true);
    expect(schema.isValid("hexlet")).toBe(false);
  });

  test("правило одного типа не видно другому", () => {
    v.addValidator("string", "startWith", (value, start) => value.startsWith(start));
    expect(() => v.number().test("startWith", 1)).toThrow('Unknown validator "startWith"');
  });

  test("неизвестный тип", () => {
    expect(() => v.addValidator("date", "past", () => true)).toThrow('Unknown schema type "date"');
  });

  test("валидаторы разных экземпляров независимы", () => {
    v.addValidator("string", "startWith", (value, start) => value.startsWith(start));
    expect(() => new Validator().string().test("startWith", "H")).toThrow();
  });
});
