const fs = require("fs");
const path = require("path");

// Assume repo root is 3 levels up from this script
const repoRoot = path.resolve(__dirname, "../../..");
const generatorCliMain = path.join(repoRoot, "node_modules/@openapitools/openapi-generator-cli/versions");

const jarFiles = fs.readdirSync(generatorCliMain).filter(f => f.endsWith(".jar"));
if (jarFiles.length === 0) {
  throw new Error(`No JAR found in ${jarDir}`);
}

// pick the first (or latest, if multiple)
const src = path.join(generatorCliMain, jarFiles[0]);
const dest = path.join(__dirname, "..", "openapi-generator-cli.jar");

fs.copyFileSync(src, dest);
console.log(`Copied ${src} → ${dest}`);