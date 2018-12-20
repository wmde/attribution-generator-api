# Attribution Generator API

An API for generating attribution hints for images from Wikipedia and Wikimedia Commons.

[![Build Status](https://travis-ci.org/wmde/attribution-generator-api.svg?branch=master)](https://travis-ci.org/wmde/attribution-generator-api)

## Prerequisites

You will need a few things to get started:

  * [`Node.js`](https://nodejs.org/en/) — we recommend installing it via [nvm](https://github.com/creationix/nvm)
  * [`Yarn`](https://yarnpkg.com/)

<!-- TODO: Add other required dependencies as needed… -->

## Configuration

All of the application's configuration is read from [environment variables](https://12factor.net/config).
If a `.env` file is present in the current working directory, the application reads it via [`dotenv`](https://github.com/motdotla/dotenv) when starting.

For a quick start in development, just copy `.env.test` and update its values:

```shell
cp .env.test .env
```

In case you need to generate secure app secrets, run `scripts/gen-secret`.

## Getting started

Install JavaScript dependencies:

```shell
yarn install
```

To start the server and restart it on file changes:

```shell
yarn watch
```

To simply start the server without restarts:

```shell
yarn start
```

or, to bind to a different port:

```shell
PORT=9000 yarn start
```

## Development tasks

We use npm scripts for development-related tasks:

  * Run linting: `yarn lint`, to autocorrect issues `yarn lint --fix`
  * Run tests: `yarn test`, to start in watch mode `yarn test --watch`

Generate / update the API documentation:

```shell
scripts/gen-apidoc > openapi.yaml
```

### Debugging

It can be useful to run tests with the `DEBUG` flag enabled in order to get more
information on errors:

```shell
DEBUG=true yarn test
```

<!-- TODO: Add sections on contribution guidelines…? -->
