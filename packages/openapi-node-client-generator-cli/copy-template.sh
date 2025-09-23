#!/bin/bash

rm -rf template
mkdir template
cp -r ../openapi-node-client-generator-cli-template/* template
rm -rf template/node_modules \
    template/dist \
    template/typescript-* \
    template/openapitools.json \
    template/README.md

echo "Copied template files:"
find template
echo