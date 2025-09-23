// scripts/copy-jar.js
const fs = require("fs");
const path = require("path");
const semver = require("semver");

const versionsDir = path.resolve(
  __dirname,
  "../../../node_modules/@openapitools/openapi-generator-cli/versions"
);

const files = fs.readdirSync(versionsDir);

const jarFiles = files.filter(f => f.endsWith(".jar"));

const versions = jarFiles
  .map(f => f.replace(/\.jar$/, "")) // strip ".jar"
  .filter(v => semver.valid(v))      // keep only valid semver strings
  .sort(semver.rcompare);            // sort descending (highest first)

if (versions.length === 0) {
  throw new Error(`No valid JAR versions found in ${  versionsDir}`);
}
const highest = versions[0];

const src = path.join(versionsDir, `${highest}.jar`);
const destDir = path.resolve(__dirname, "..");
const dest = path.join(destDir, "openapi-generator-cli.jar");

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);

console.log(`Copied ${src} → ${dest}`);
