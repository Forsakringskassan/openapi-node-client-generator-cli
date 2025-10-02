#!/usr/bin/env node

import fs from "fs";
import os from "os";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        demandOption: "Must have a name for the package to be generated.",
        nargs: 1,
    })
    .option("package-version", {
        type: "string",
        demandOption: "Must have a name for the package to be generated.",
        nargs: 1,
    })
    .option("package-url", {
        type: "string",
        nargs: 1,
    })
    .option("openapi-spec-file", {
        type: "string",
        default: "openapi.yaml",
    })
    .option("dry-run", {
        type: "boolean",
        default: false,
    })
    .help()
    .alias("help", "h").argv;

run(argv);

async function run({ packageName, packageVersion, packageUrl, dryRun, openapiSpecFile }) {
    if (dryRun) {
        console.log(`\n*** Dry run enabled: nothing will be changed ***\n`);
    }
    const targetFolder = dryRun
        ? fs.mkdtempSync(path.join(os.tmpdir(), `temp-${packageName}-`))
        : process.cwd();

    console.log(`Creating package: ${packageName}@${packageVersion}`);
    console.log(`Using OpenAPI spec file: ${openapiSpecFile}`);
    console.log(`Generating to: ${targetFolder}`);

    const templatePath = path.join(__dirname, "template");
    fs.cpSync(templatePath, targetFolder, { recursive: true });

    const createdPkgJsonPath = path.join(targetFolder, "package.json");
    const createdPkgJsonContent = fs.readFileSync(createdPkgJsonPath, "utf-8").replaceAll(" openapi.yaml ",` ${openapiSpecFile} `)
    const createdPkg = JSON.parse(createdPkgJsonContent);
    createdPkg.version = packageVersion;
    createdPkg.name = packageName;
    createdPkg.homepage = packageUrl;
    createdPkg.bugs = `${packageUrl}/issues`;
    createdPkg.repository = {
        type: "git",
        url: `${packageUrl}.git`,
    };
    fs.writeFileSync(createdPkgJsonPath, JSON.stringify(createdPkg, null, 2), "utf-8");

    console.log(`Patched ${createdPkgJsonPath}`);
}
