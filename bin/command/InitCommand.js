const fs = require('fs');
const program = require('commander');
const package = require('../../lib/package');
const configs = require('../../lib/configs');

class InitCommand {

    exec(options) {
        const data = JSON.stringify(configs.swaglow, null, '\t');
        const outputDir = options.output || process.cwd();
        const parametersDir = `${outputDir}/parameters`;
        const pathsDir = `${outputDir}/paths`;
        const definitionsDir = `${outputDir}/definitions`;
        const filePath = `${outputDir}/swaglow.json`;
        
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)
        
        console.log("create directories...");
        this.createDirectoryIfNeeded(parametersDir);
        this.createDirectoryIfNeeded(pathsDir);
        this.createDirectoryIfNeeded(definitionsDir);

        console.log("create swaglow.json...");
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, data);
        
        console.log("success!");
    }

    createDirectoryIfNeeded(basePath) {
        if (fs.existsSync(basePath)) return;

        fs.mkdirSync(basePath);
        fs.writeFileSync(`${basePath}/.gitkeep`, '');
    }
}

module.exports = InitCommand;