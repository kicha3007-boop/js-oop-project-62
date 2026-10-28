install:
	npm ci

test:
	npm test

test-coverage:
	npm run test:coverage

lint:
	npm run lint

lint-fix:
	npm run lint:fix

.PHONY: install test test-coverage lint lint-fix
