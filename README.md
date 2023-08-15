# Pet Manager E2e Repro

## Run locally

Make sure that you have [docker](https://www.docker.com/products/docker-desktop/) installed on your system

```sh
yarn install

# start docker container in the background
# The database files will be stored in the ./tmp directory which is git ignored
docker-compose up -d

# create database tables
yarn db:push
```

### create environment files

Create a copy of .env.example in root and rename it `.env`

```sh
#  create environment files
cp .env.example .env
```

## Run cypress e2e tests

The tests are located in `apps/frontend-e2e`

```sh
yarn e2e:watch
```

This should open the cypress test runner. There are 2 tests: `auth.cy.ts` and `pets.cy.ts`. You can run them individually or together.

The auth tests seem to be working just fine. Any improvements are welcome.

I'm testing with `firefox` although I got the same problems described below in chrome too.

## Problem

There are multiple problems that I have identified in the `pets.cy.ts` file. I have added `TODO:` where I have encountered a problem and tried to explain the steps I have taken where it's not self explanatory.

1. Not being able to target an element because a component is reused in Ionic routing resulting in the same element being present twice. I might be missing some cypress foo here.

2. Not being able to target an element because it is not visible in the viewport. I have tried to scroll to the element but it still doesn't work.

3. Routing to a URL is not waorking after reaching a certain point in the test. The location is updated but the page is not rendered. Going to the same URL manually works fine. Doing the steps manually also works fine.

- I also tried to navigate to the root url at the end and it results in black screen.

## FAQ

### How to run the tests in headless mode?

```sh
yarn e2e
```

### Troubles with the database

Make sure that you have run `yarn db:push` and that you have a valid DATABASE_URL in your .env file. If you are still having troubles, try to change the port in docker-compose.yml and change the location of the database to no crash with other docker containers. Create the container and change the DATABASE_URL in your .env file accordingly. Then run `yarn db:push` again.

### To run both the NestJS API and Angular Frontend

```sh
yarn start
```

The `API` is hosted on `http://localhost:3333` and the `Frontend` is hosted on `http://localhost:4200`

### To run only the API

```sh
yarn start:api
```

### To run only the frontend

```sh
yarn start:web
```

## Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory.

## DB operations

Make sure a valid DATABASE_URL is set in your .env file

```sh
# to create database
yarn db:push

# to generate prisma client (For example when Prisma schema is updated)
# Be sure to restart ts server after this if applicable
yarn gen

# to stop the container
docker-compose down

```
