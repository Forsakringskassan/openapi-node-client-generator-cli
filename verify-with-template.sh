#!/bin/bash
set -ex

clone_fresh_template() {
  rm -rf example-template
  git clone https://github.com/Forsakringskassan/template-api.git example-template
  cd example-template
}

test_build() {
    npm install
    npm run build
}

cd packages

echo 
echo Test with given name and version
echo
clone_fresh_template
npx @forsakringskassan/openapi-node-client-generator-cli \
 --package-name $(basename "$PWD") \
 --package-version 0.0.1
test_build
cd ..


echo 
echo Test with given name, version and openapi-spec-file
echo
clone_fresh_template
mv openapi.yaml openapi-special.yaml
npx @forsakringskassan/openapi-node-client-generator-cli \
 --package-name $(basename "$PWD") \
 --package-version 0.0.1 \
 --openapi-spec-file openapi-special.yaml
test_build
cd ..