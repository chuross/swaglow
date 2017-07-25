#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const package = require('lib/package');

program
    .version(package.json.version)
    .option('-o, --output [path]', 'target output directory path')
    .parse(process.argv);

const swaglowConfig = {
    "title": "your project title",
    "baseUrl": "ex) https://example.com/api/v1"
};

const data = JSON.stringify(swaglowConfig, null, '\t');
const outputDir = program.output || process.cwd();
const parametersDir = `${outputDir}/parameters`;
const pathsDir = `${outputDir}/paths`;
const definitionsDir = `${outputDir}/definitions`;
const filePath = `${outputDir}/swaglow.json`;

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

console.log("create directories...");
if (!fs.existsSync(parametersDir)) fs.mkdirSync(parametersDir);
if (!fs.existsSync(pathsDir)) fs.mkdirSync(pathsDir);
if (!fs.existsSync(definitionsDir)) fs.mkdirSync(definitionsDir);

console.log("create swaglow.json...");
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, data);

console.log("success!");