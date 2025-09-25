import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";
import { globSync } from "glob";
import { shimPlugin } from "esbuild-plugin-esm-cjs-shim";
import { generateForBrowser } from "@forsakringskassan/apimock-express";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootPath = join(__dirname, ".");

fs.rmSync(join(rootPath, "/dist/typescript-fetch"), {
    recursive: true,
    force: true,
});
fs.rmSync(join(rootPath, "/dist/mock"), { recursive: true, force: true });

fs.rmSync(join(rootPath, "/dist/generators"), {
    recursive: true,
    force: true,
});

const commonConfig = {
    minify: false,
    bundle: true,
    external: [],
    outdir: join(rootPath, "/dist"),
};

/* Fetch Generatorer */
const extension = {
    esm: ".mjs",
    cjs: ".cjs",
};
for (const generator of ["fetch"]) {
    for (const format of ["cjs", "esm"]) {
        await build({
            entryPoints: [
                join(rootPath, `/typescript-${generator}/index.ts`),
            ],
            minify: false,
            bundle: true,
            external: [],
            outfile: join(
                rootPath,
                "/dist/generators",
                generator,
                `index${extension[format]}`,
            ),
            platform: "browser",
            format: format,
            target: "es6",
        });
    }
}

/* Bygg enbart mockar om sådana finns */
if (fs.existsSync(join(rootPath, "/src/mock/index.ts"))) {
    for (const format of ["cjs", "esm"]) {
        await build({
            entryPoints: [join(rootPath, "/src/mock/index.ts")],
            ...commonConfig,
            outbase: join(rootPath, "/src"),
            platform: "browser",
            format: format,
            target: "es2024",
            outExtension: {
                ".js": extension[format],
            },
        });
    }
}

/* apimock-express byggs upp utifrån en filstruktur, därför går dessa filer inte att bundla som en egen fil*/
const mock = globSync("src/mock/*api*/**/*.ts", { cwd: rootPath });
await build({
    entryPoints: mock,
    outbase: join(rootPath, "/src"),
    ...commonConfig,
    plugins: [shimPlugin()],
    platform: "node",
    format: "cjs",
    target: "node20",
});

/* Fixa legacy imports utav fetch */
for (const type of ["fetch"]) {
    fs.mkdirSync(join(rootPath, `/dist/typescript-${type}`));
    fs.copyFileSync(
        join(rootPath, `/dist/generators/${type}/index.cjs`),
        join(rootPath, `/dist/typescript-${type}/index.js`),
    );
}

const mocks = await generateForBrowser("dist/mock/api", {
    rootPath: rootPath,
});

fs.writeFileSync(
    join(rootPath, `/dist/browser-mock.mjs`),
    `export default ${JSON.stringify(mocks)};`,
);
