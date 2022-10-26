deploy:
	railway up

install:
	npm ci

lint:
	npx eslint .

publish:
	npm publish

build:
	npm run build

start:
	npm run start