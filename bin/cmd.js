#!/usr/bin/env node

const program = require('commander');
const package = require('../lib/package');
const InitCommand = require('./command/InitCommand');
const BuildCommand = require('./command/BuildCommand');

program
    .version(package.json.version)

program
    .command('init')
    .option('-o, --output <path>', 'target output directory path')
    .action((options) => new InitCommand().exec(options));

program
    .command('build')
    .option('-i, --input <path>', 'target input directory path')
    .option('-o, --output <path>', 'target output directory path')
    .option('--dry', 'execute build as dry run')
    .action((options) => new BuildCommand().exec(options));

program.parse(process.argv);