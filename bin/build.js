#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const package = require('lib/package');
const utils = require('lib/utils');
const builder = require('lib/builder');

program
    .version(package.json.version)
    .option('-i, --input [path]', 'target input directory path')
    .option('-o, --output [path]', 'target output directory path')
    .parse(process.argv);

const inputDir = program.input;
if (utils.isNull(inputDir)) {
    console.log('must be set input option (-i or --input)');
    return;
}

const inputPath = path.resolve(process.cwd(), inputDir);

const swaglowJson = require(`${inputPath}/swaglow.json`);
if (swaglowJson == null) {
    console.log('not found swaglow.json');
    return;
}

console.log(`build swagger.yml file from ${inputPath}`);

const baseUrlGroups = /^(https?):\/\/([\w\.].+?)\/([\w\.\/\-].+)/.exec(swaglowJson.baseUrl);
if (utils.isNull(baseUrlGroups)) {
    console.log(`invalid baseUrl format: input=${swaglowJson.baseUrl} expected=(http|https)://(host)/(path)`);
    return;
}

const definitionsDir = `${inputPath}/definitions`;
const parametersDir = `${inputPath}/parameters`;
const pathsDir = `${inputPath}/paths`;

const title = swaglowJson.title;
const [scheme, host, basePath] = baseUrlGroups.slice(1);
const paths = builder.buildPaths(pathsDir, pathsDir);
const definitions = builder.buildObjects(definitionsDir, definitionsDir);
const parameters = builder.buildObjects(parametersDir, parametersDir);

const swaggerTemplate = fs.readFileSync(path.resolve('./swagger.template.yml'));

const placeHolders = [
    { key: '{{title}}', value: title } ,
    { key: '{{scheme}}', value: scheme },
    { key: '{{host}}', value: host },
    { key: '{{basePath}}', value: basePath },
    { key: '{{paths}}', value: paths },
    { key: '{{definitions}}', value: definitions },
    { key: '{{parameters}}', value: parameters }
];

const swaggerYaml = placeHolders.reduce((current, placeHolder) => {
    return current.replace(placeHolder.key, placeHolder.value);
}, swaggerTemplate.toString());

console.log(swaggerYaml);