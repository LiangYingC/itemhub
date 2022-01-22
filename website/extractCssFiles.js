'use strict';
const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const scssFiles = recursiveExtractCssFile('./');

console.log('execute extractCssFiles');

for (let i = 0; i < scssFiles.length; i++) {
    const outputFileName = path.dirname(scssFiles[i]) + path.basename(scssFiles[i]).replace(path.extname(scssFiles[i]), '.css');

    if (outputFileName.indexOf('node_modules/') !== -1) {
        continue;
    }
    sass.render({
        file: scssFiles[i],
        outFile: outputFileName,
        includePaths: ['node_modules/']
    }, (error, result) => { // node-style callback from v3.0.0 onwards
        if (error) {
            console.error(error);
            return;
        }
        fs.writeFile(outputFileName, result.css, function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}

function recursiveExtractCssFile (folder) {
    const result = extractCssFile(folder);
    fs.readdirSync(folder, {
        withFileTypes: true
    }).forEach((file) => {
        if (file.isDirectory()) {
            result.push(...recursiveExtractCssFile(`${folder}${file.name}/`));
        }
    });
    return result;
}

function extractCssFile (folder) {
    return fs.readdirSync(folder, {
        withFileTypes: true
    }).map(file => {
        if (!file.isDirectory() && path.extname(file.name) === '.scss') {
            return `${folder}/${file.name}`;
        }
        return undefined;
    }).filter((item) => {
        return item !== undefined;
    });
}
