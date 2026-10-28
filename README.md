# Валидатор данных (JS)

[![hexlet-check](https://github.com/kicha3007-boop/js-oop-project-62/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/kicha3007-boop/js-oop-project-62/actions)
[![CI](https://github.com/kicha3007-boop/js-oop-project-62/actions/workflows/ci.yml/badge.svg)](https://github.com/kicha3007-boop/js-oop-project-62/actions/workflows/ci.yml)

Библиотека для проверки данных с fluent-интерфейсом по мотивам [yup](https://github.com/jquense/yup):
строки, числа, массивы, объекты со вложенными схемами и собственные правила.

## Установка

Нужен Node.js 22+.

```bash
git clone https://github.com/kicha3007-boop/js-oop-project-62.git
cd js-oop-project-62
make install   # зависимости
make test      # тесты (vitest)
make lint      # oxlint + oxfmt
```

## Использование

```javascript
import Validator from '@hexlet/code';

const v = new Validator();

// строки: required — непустая строка, minLength, contains
const name = v.string().required().minLength(3);
name.isValid('hexlet'); // true
name.isValid('');       // false

// числа: required — любое число, включая 0; positive; range — границы включительно
const age = v.number().required().positive().range(1, 120);
age.isValid(30);  // true
age.isValid(-1);  // false

// массивы: required — Array.isArray; sizeof — точная длина
v.array().required().sizeof(2).isValid(['a', 'b']); // true

// объекты: каждое поле проверяется своей схемой
const user = v.object().shape({
  name: v.string().required(),
  age: v.number().positive(),
});
user.isValid({ name: 'kolya', age: 100 }); // true
user.isValid({ name: '', age: null });     // false

// собственные правила: addValidator(тип, имя, fn), вызов через test(имя, ...аргументы)
v.addValidator('string', 'startWith', (value, start) => value.startsWith(start));
v.string().test('startWith', 'H').isValid('Hexlet'); // true
```

Без `required()` пустое значение (`null`, `undefined`, у строки ещё `''`) проходит проверку.
Повторный вызов правила заменяет прежнее: `v.string().minLength(10).minLength(4)` проверяет длину от 4.

## Устройство

- `src/Validator.js` — фабрика схем и реестр пользовательских правил по паре «тип и имя»;
- `src/schemas/BaseSchema.js` — общий базовый класс: правила хранятся по имени, `required`, `test`, `isValid`;
- `src/schemas/*Schema.js` — схемы типов, каждая добавляет только свои правила.

Новый тип — новый класс схемы и строка в таблице `schemaClasses` в `Validator.js`; базовый класс не меняется.
