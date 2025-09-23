# @forsakringskassan/openapi-node-client-generator-cli

Wraps Openapi Generator CLI. Generates an opinionated, minimal config, client NPM package, given an OpenAPI spec.

## Usage

It requires an `openapi.yaml` specification file on the filesystem. Run it with:

```sh
npx @forsakringskassan/openapi-node-client-generator-cli@latest \
 --package-name $(basename "$PWD") \
 --package-version $(npx git-changelog-command-line --print-next-version)
```

This will create a complete NPM package ready to be built and published. So that you only need to have the `openapi.yaml` spec in your version control system.

See example: https://github.com/Forsakringskassan/openapi-node-client-template