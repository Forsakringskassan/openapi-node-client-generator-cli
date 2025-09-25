const fs = require("fs");
const path = require("path");
const rootPath = path.join(__dirname, "./");

const config = {
    compilationOptions: {
        preferredConfigPath: "./tsconfig.json",
    },

    entries: [
        {
            filePath: "./typescript-fetch/index.ts",
            outFile: "./dist/typescript-fetch/index.d.ts",
        },
        {
            filePath: "./typescript-fetch/index.ts",
            outFile: "./dist/generators/fetch/index.d.ts",
        },
    ],
};

if (fs.existsSync(path.join(rootPath, "src/mock/index.ts"))) {
    config.entries.push({
        filePath: "./src/mock/index.ts",
        outFile: "./dist/mock/index.d.ts",
    });
}

module.exports = config;
