#!/bin/bash
set -ex

cd packages
rm -rf example-template
git clone https://github.com/Forsakringskassan/openapi-node-client-template.git example-template
cd example-template

npx @forsakringskassan/openapi-node-client-generator-cli \
 --package-name $(basename "$PWD") \
 --package-version 0.0.1

npm install
npm run build