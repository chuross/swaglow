const fs = require('fs');
const path = require('path');
const indentString = require('indent-string');
const utils = require('../../lib/utils');
const builder = require('../../lib/builder');

class BuildCommand {

    exec(options) {
        const inputDir = options.input || process.cwd();
        const inputPath = path.resolve(process.cwd(), inputDir);

        const swaglowJsonPath = `${inputPath}/swaglow.json`;
        if (!fs.existsSync(swaglowJsonPath)) {
            console.log('not found swaglow.json');
            return;
        }
        
        const swaglowJson = require(swaglowJsonPath);
        console.log(`build swagger.yml file from ${inputPath}`);
        
        const baseUrlGroups = /^(https?):\/\/([\w\.].+?)(\/[\w\.\/\-].+)/.exec(swaglowJson.baseUrl);
        if (utils.isNull(baseUrlGroups)) {
            console.log(`invalid baseUrl format: input=${swaglowJson.baseUrl} expected=(http|https)://(host)/(path)`);
            return;
        }
        
        const schemasDir = `${inputPath}/schemas`;
        const parametersDir = `${inputPath}/parameters`;
        const pathsDir = `${inputPath}/paths`;
        
        const title = swaglowJson.title;
        const version = swaglowJson.version;
        const baseUrl = swaglowJson.baseUrl;
        const paths = builder.buildPaths(pathsDir, pathsDir) || '';
        const schemas = builder.buildObjects(schemasDir, schemasDir) || '';
        const parameters = builder.buildObjects(parametersDir, parametersDir) || '';
        
        const swaggerTemplate = fs.readFileSync(path.resolve(__dirname, '../../swagger.template.yml'));

        const placeHolders = [
            { key: '{{title}}', value: title } ,
            { key: '{{version}}', value: version },
            { key: '{{baseUrl}}', value: baseUrl },
            { key: '{{paths}}', value: this.buildSection('paths', paths) },
            { key: '{{schemas}}', value: this.buildSection('schemas', indentString(schemas, 2)) },
            { key: '{{parameters}}', value: this.buildSection('parameters', parameters) }
        ];
        
        const swaggerYaml = placeHolders.reduce((current, placeHolder) => {
            return current.replace(placeHolder.key, placeHolder.value);
        }, swaggerTemplate.toString());
        
        if (options.dry) {
            console.log(swaggerYaml);
            return;
        }

        const outputDir = options.output || process.cwd();
        const outputPath = path.resolve(process.cwd(), outputDir);
        const filePath = `${outputPath}/swagger.yml`;

        if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);
        
        fs.writeFileSync(filePath, swaggerYaml);
        console.log(`build successful! ${filePath}`);
    }

    buildSection(sectionName, value) {
        if (utils.isNull(value) || value.length == 0) return '';
        return `${sectionName}:\n${value}`;
    }
}

module.exports = BuildCommand;