const { fork, execSync } = require('child_process');
const path = require('path');
execSync('npm i');
const fs = require('fs-extra');

(async () => {
    await installHomoAuthApi();
    console.log('migrate article from ef model');
    execSync('dotnet ef migrations add Article --context IotDbContext');
    execSync('dotnet ef database update --context IotDbContext');
    console.log('initialize iot api finish');
})();

function installHomoAuthApi () {
    if (fs.existsSync('./Homo.AuthApi')) {
        fs.rmSync('./Homo.AuthApi', {
            recursive: true,
            force: true
        });
    };
    if (fs.existsSync('./Homo.Api')) {
        fs.rmSync('./Homo.Api', {
            recursive: true,
            force: true
        });
    };
    return new Promise((resolve, reject) => {
        // execSync('dotnet new -u Homo.AuthApi && dotnet nuget locals all --clear && dotnet new -i Homo.AuthApi::5.0.0-alpha.8 && dotnet new homo-auth-api -o Homo.AuthApi && dotnet restore');
        execSync('dotnet new homo-auth-api -o Homo.AuthApi && dotnet restore');
        fs.unlinkSync(path.join(__dirname, '../Homo.AuthApi/Program.cs'));
        fs.unlinkSync(path.join(__dirname, '../Homo.AuthApi/Startup.cs'));
        const childProcess = fork('./Homo.AuthApi/tools/initialize.js', { silent: false });
        childProcess.on('close', () => {
            fs.unlinkSync(path.join(__dirname, '../Homo.AuthApi/AuthApi.csproj'));
            fs.unlinkSync(path.join(__dirname, '../Homo.AuthApi/Dockerfile'));
            fs.unlinkSync(path.join(__dirname, '../Homo.AuthApi/package-lock.json'));
            fs.unlinkSync(path.join(__dirname, '../Homo.AuthApi/package.json'));
            fs.copySync(path.join(__dirname, '../Homo.AuthApi/Homo.Api'), './Homo.Api');
            fs.rmSync(path.join(__dirname, '../Homo.AuthApi/Homo.Api'), { recursive: true, force: true });
            resolve();
        });
    });
}
