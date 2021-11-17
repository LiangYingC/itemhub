const { exec, execSync } = require('child_process');
execSync('npm i');

const fs = require('fs');
const inquirer = require('inquirer');
const randomstring = require('randomstring');
const path = require('path');

(async () => {
    await installHomoApi();
    if (process.env.PACK_ONLY === 'true') {
        return;
    }
    // build secrets.json
    if (!fs.existsSync('./secrets.json')) {
        const secrets = JSON.parse(fs.readFileSync(path.join(__dirname, '../secrets.template.json')).toString()).Config.Secrets;
        const answersForSecrets = await promptQuestion(secrets);
        for (const key in answersForSecrets) {
            if (!answersForSecrets[key] && key.endsWith('Key')) {
                answersForSecrets[key] = randomstring.generate(32);
            }
        }
        const config = { Config: { Secrets: answersForSecrets } };
        fs.writeFileSync('./secrets.json', JSON.stringify(config, null, 4));
    }
    // build appsettings.json
    if (!fs.existsSync('./appsettings.json')) {
        const appsettingsRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '../appsettings.template.json')).toString());
        const common = appsettingsRaw.Config.Common;
        const answersForCommon = await promptQuestion(common);
        for (const key in appsettingsRaw.Config.Common) {
            if (answersForCommon[key]) {
                appsettingsRaw.Config.Common[key] = answersForCommon[key];
            }
        }
        fs.writeFileSync('./appsettings.json', JSON.stringify(appsettingsRaw, null, 4));
    }

    // resotre database from ef
    console.log('resotre database from ef');
    if (fs.existsSync('./Migrations')) {
        fs.rmSync('./Migrations', { recursive: true, force: true });
    }
    execSync('dotnet ef migrations add InitialCreate --context DBContext');
    execSync('dotnet ef database update --context DBContext');

    // build rsa key for protect sensitive information
    console.log('create rsa key');
    if (!fs.existsSync('./secrets')) {
        fs.mkdirSync('./secrets');
    }
    execSync('openssl genrsa -out ./secrets/key.pem 4096');
    execSync('openssl rsa -in ./secrets/key.pem -out ./secrets/key.pub -pubout -outform pem');
    execSync('openssl rsa -pubin -in ./secrets/key.pub -RSAPublicKey_out -outform dem > ./secrets/key.pub.der');
    execSync('openssl rsa -in ./secrets/key.pem -outform dem > ./secrets/key.der');

    // remove template file
    console.log('remove template file');
    fs.unlinkSync(path.join(__dirname, '../secrets.template.json'));
    fs.unlinkSync(path.join(__dirname, '../appsettings.template.json'));

    console.log('initialize auth api finish');
    // run api server and dev-front-end-server
    // exec('dotnet watch run --launch-profile dev');
    // exec('cd ./tools/dev-front-end-server && npm install && node server.js');
})();

async function promptQuestion (keys) {
    const arrayOfSecrets = [];
    for (const key in keys) {
        let defaultValue = keys[key];
        if (defaultValue === '') {
            defaultValue = (key.endsWith('Key') ? 'random' : 'empty string');
        }
        arrayOfSecrets.push({
            type: 'input',
            name: key,
            message: `what is ur ${key} (${defaultValue})`
        });
    }

    return new Promise((resolve, reject) => {
        inquirer.prompt(arrayOfSecrets)
            .then(answers => {
                resolve(answers);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function installHomoApi () {
    if (fs.existsSync('./Homo.Api')) {
        fs.rmSync('./Homo.Api', {
            recursive: true,
            force: true
        });
    };
    return new Promise((resolve, reject) => {
        exec(`dotnet new -u Homo.Api && dotnet nuget locals all --clear && dotnet new -i Homo.Api::5.0.5-alpha.2 && rm -rf ${path.join(__dirname, '../Homo.Api')} && dotnet new homo-api -o ${path.join(__dirname, '../Homo.Api')} && dotnet restore`, (error, stdout, stderr) => {
            if (error) {
                throw error;
            }
            if (stderr) {
                throw error;
            }
            resolve();
        });
    }).then(() => {
        fs.rmSync(path.join(__dirname, '../Homo.Api/Properties'), { recursive: true, force: true });
        fs.rmSync(path.join(__dirname, '../Homo.Api/Localization/Common'), { recursive: true, force: true });
        fs.rmSync(path.join(__dirname, '../Homo.Api/Localization/Error'), { recursive: true, force: true });
        fs.rmSync(path.join(__dirname, '../Homo.Api/Localization/Validation'), { recursive: true, force: true });
        fs.unlinkSync(path.join(__dirname, '../Homo.Api/api.csproj'));
        fs.unlinkSync(path.join(__dirname, '../Homo.Api/appsettings.dev.json'));
        fs.unlinkSync(path.join(__dirname, '../Homo.Api/appsettings.json'));
        fs.unlinkSync(path.join(__dirname, '../Homo.Api/appsettings.staging.json'));
        fs.unlinkSync(path.join(__dirname, '../Homo.Api/appsettings.prod.json'));
        fs.unlinkSync(path.join(__dirname, '../Homo.Api/package-lock.json'));
        fs.unlinkSync(path.join(__dirname, '../Homo.Api/Program.cs'));
        fs.unlinkSync(path.join(__dirname, '../Homo.Api/Startup.cs'));
    });
}
