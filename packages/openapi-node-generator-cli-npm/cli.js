#!/usr/bin/env node
import { run } from 'npm-java-runner/lib/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

run(__dirname);