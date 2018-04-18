const fs = require('fs');
const path = require('path');
const indentString = require('indent-string');

const buildPaths = (rootPath, pathsDir) => {
    const fileNames = fs.readdirSync(pathsDir);
    if (fileNames.length == 0) return '';

    const result = fileNames.reduce((current, fileName) => {
        const filePath = path.resolve(pathsDir, fileName);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            return current += buildPaths(rootPath, filePath);
        }

        if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
            return current += indentString(buildPath(rootPath, filePath), 2);
        } else {
            return current;
        }
    }, '');

    return result;
};

const buildPath = (rootPath, filePath) => {
    const endPoint = path.dirname(path.relative(rootPath, filePath)).replace(/\((.+)\)/, '{$1}');
    return `/${endPoint}:\n${indentString(fs.readFileSync(filePath).toString(), 2)}\n`;
};

const buildObjects = (rootPath, targetDir) => {
    const fileNames = fs.readdirSync(targetDir).filter(fileName =>
        fileName.endsWith('.yml') || fileName.endsWith('.yaml')
    );
    if (fileNames.length == 0) return;

    const result = fileNames.reduce((current, fileName) => {
        const filePath = path.resolve(targetDir, fileName);
        return current += indentString(buildObject(rootPath, filePath), 2);
    }, '');

    return result;
};

const buildObject = (rootPath, filePath) => {
    const name = path.relative(rootPath, filePath).replace(/.yml/, '');
    return `${name}:\n${indentString(fs.readFileSync(filePath).toString(), 2)}\n`
};

module.exports = {
    buildPaths,
    buildObjects
};