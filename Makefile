# start-frontend:
#	 make -C frontend start
#
# start-backend:
#	 npx start-server
#
# start:
#	 make start-backend & make start-frontend


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
