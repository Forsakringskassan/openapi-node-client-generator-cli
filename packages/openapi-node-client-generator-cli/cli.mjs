#!/usr/bin/env node

import fs from "fs";
import os from "os";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const pkg = JSON.parse(
    fs.readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
);
const { version, name } = pkg;

const argv = yargs(hideBin(process.argv))
    .version(version)
    .scriptName(name)
    .usage("Usage: $0 --package-name string --package-version string")
    .option("package-name", {
        type: "string",
        describe: "Name of the npm package to create",
        demandOption: "Must have a name for the package to be generated.",
        nargs: 1,
    })
    .option("package-version", {
        type: "string",
        describe: "Version of the npm package to create",
        demandOption: "Must have a name for the package to be generated.",
        nargs: 1,
    })
    .option("openapi-spec-file", {
        type: "string",
        describe: "Name of OpenAPI spec file",
        default: "openapi.yaml",
    })
    .option("dry-run", {
        type: "boolean",
        describe: "Will not change anything",
        default: false,
    })
    .help()
    .alias("help", "h").argv;

run(argv);

async function run({ packageName, packageVersion, dryRun, openapiSpecFile }) {
    if (dryRun) {
        console.log(`\n*** Dry run enabled: nothing will be changed ***\n`);
    }
    const targetFolder = dryRun
        ? fs.mkdtempSync(path.join(os.tmpdir(), `temp-${packageName}-`))
        : process.cwd();

    console.log(`Creating package: ${packageName}@${packageVersion}`);
    console.log(`Using OpenAPI spec file: ${openapiSpecFile}`);
    console.log(`Generating to: ${targetFolder}`);

    fs.cpSync("./template", targetFolder, { recursive: true });

    const createdPkgJsonPath= `${targetFolder}/package.json`
    const createdPkg = JSON.parse(
        fs.readFileSync(
            new URL(createdPkgJsonPath, import.meta.url),
            "utf-8",
        ),
    );
    createdPkg.version = packageVersion;
    createdPkg.name = packageName;
    const createdPkgJson = JSON.stringify(createdPkg, null, 2);
    console.log(createdPkgJson);
    fs.writeFileSync(createdPkgJsonPath,createdPkgJson,'utf-8'
    );
    console.log(`Patched ${createdPkgJsonPath}`)
}
