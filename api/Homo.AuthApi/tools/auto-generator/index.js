const inquirer = require('inquirer');
const fs = require('fs');
const utils = require('./utils.js');
const path = require('path');

(async () => {
    const fileNames = fs.readdirSync('./Models/EF');
    const dbContextFiles = fileNames.filter(item => item.toLocaleLowerCase().indexOf('dbcontext') !== -1);
    if (dbContextFiles.length > 1) {
        console.error(`can not auto generate file, because Models/EF contain duplicate dbcontext files: ${dbContextFiles.join(',')}`);
        return;
    }
    const dbContextRawData = fs.readFileSync(`./Models/EF/${dbContextFiles[0]}`).toString();
    const dbContextFilename = dbContextFiles[0];
    const extractDbContextNameStartFragment = 'public partial class ';
    const extractDbContextNameStartPosition = dbContextRawData.indexOf(extractDbContextNameStartFragment) + extractDbContextNameStartFragment.length;
    const extractDbContextNameEndPosition = dbContextRawData.indexOf(' :', extractDbContextNameStartPosition);
    const dbContextName = dbContextRawData.substring(extractDbContextNameStartPosition, extractDbContextNameEndPosition);

    const answers = await promptQuestion();
    const replacement = {
        snakeCaseModelsName: utils.camelToSnake(answers.models),
        firstLowerCamelCaseModelsName: utils.snakeToFirstLowerCamel(answers.models),
        firstUpperCamelCaseModelsName: utils.snakeToFirstUpperCamel(answers.models),
        snakeCaseModelName: utils.camelToSnake(answers.model),
        firstLowerCamelCaseModelName: utils.snakeToFirstLowerCamel(answers.model),
        firstUpperCamelCaseModelName: utils.snakeToFirstUpperCamel(answers.model)
    };

    // prepare template string
    let controllerTemplate = fs.readFileSync(path.join(__dirname, './template/controller.cs.template')).toString();
    let dataserviceTemplate = fs.readFileSync(path.join(__dirname, './template/dataservice.cs.template')).toString();
    let dtoTemplate = fs.readFileSync(path.join(__dirname, './template/dto.cs.template')).toString();
    let modelTemplate = fs.readFileSync(path.join(__dirname, './template/model.cs.template')).toString();

    // check folder exists
    if (!fs.existsSync('./Dataservices')) {
        fs.mkdirSync('./Dataservices');
    }
    if (!fs.existsSync('./Controllers')) {
        fs.mkdirSync('./Controllers');
    }
    if (!fs.existsSync('./Models')) {
        fs.mkdirSync('./Models');
    }
    if (!fs.existsSync('./Models/EF')) {
        fs.mkdirSync('./Models/EF');
    }
    if (!fs.existsSync('./Models/DTOs')) {
        fs.mkdirSync('./Models/DTOs');
    }

    // answers.model, answers.models
    for (const key in replacement) {
        controllerTemplate = controllerTemplate.replace(new RegExp(`{${key}}`, 'gi'), replacement[key]);
        dataserviceTemplate = dataserviceTemplate.replace(new RegExp(`{${key}}`, 'gi'), replacement[key]);
        dtoTemplate = dtoTemplate.replace(new RegExp(`{${key}}`, 'gi'), replacement[key]);
        modelTemplate = modelTemplate.replace(new RegExp(`{${key}}`, 'gi'), replacement[key]);
    }
    fs.writeFileSync(`./Controllers/${replacement.firstUpperCamelCaseModelName}Controller.cs`,
        controllerTemplate
            .replace(/{namespace}/gi, answers.namespace)
            .replace(/{authorizeFactoryNamePrefix}/gi, answers.authorizeFactoryNamePrefix)
            .replace(/DBContext/g, dbContextName)
    );
    fs.writeFileSync(`./Dataservices/${replacement.firstUpperCamelCaseModelName}Dataservice.cs`,
        dataserviceTemplate
            .replace(/{namespace}/gi, answers.namespace)
            .replace(/DBContext/g, dbContextName)
    );
    fs.writeFileSync(`./Models/DTOs/${replacement.firstUpperCamelCaseModelName}.cs`, dtoTemplate.replace(/{namespace}/gi, answers.namespace));
    fs.writeFileSync(`./Models/EF/${replacement.firstUpperCamelCaseModelName}.cs`, modelTemplate.replace(/{namespace}/gi, answers.namespace));

    // insert model to dbContext
    let efRawData = fs.readFileSync(`./Models/EF/${dbContextFilename}`).toString();
    const insertStartPosition = efRawData.indexOf('protected override void OnModelCreating');
    efRawData = `${efRawData.substring(0, insertStartPosition)}\n        public virtual DbSet<${replacement.firstUpperCamelCaseModelName}> ${replacement.firstUpperCamelCaseModelName} { get; set; }\n        ${efRawData.substring(insertStartPosition)}`;
    fs.writeFileSync(`./Models/EF/${dbContextFilename}`, efRawData);
})();

async function promptQuestion () {
    return new Promise((resolve, reject) => {
        inquirer.prompt([{
            type: 'input',
            name: 'namespace',
            message: 'what is ur namespace'
        }, {
            type: 'input',
            name: 'authorizeFactoryNamePrefix',
            message: 'what is ur authorize factory name prefix'
        }, {
            type: 'input',
            name: 'model',
            message: 'what is ur model name'
        }, {
            type: 'input',
            name: 'models',
            message: 'what is ur models name'
        }])
            .then(answers => {
                resolve(answers);
            })
            .catch(error => {
                reject(error);
            });
    });
}
