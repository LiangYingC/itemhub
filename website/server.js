'use strict';
const http = require('https');
const staticAlias = require('node-static-alias');
const fs = require('fs');
const path = require('path');

/**
 * http.createServer will launch sever
 * */
fs.copyFileSync(`./src/config.${process.env.NODE_ENV}.js`, './src/config.js');

const fileServer = new staticAlias.Server('./src/', {
    alias: [{
        match: /\/config.js$/,
        serve: process.env.NODE_ENV === 'prod' ? 'config.js' : 'config.dev.js'
    }, {
        match: /\/([^/]+\/)*$/,
        serve: () => {
            return path.join(__dirname, 'src/index.html');
        }
    }, {
        match: /\/([^/]+\/)*([^/]+)\.(js|css|png|woff2|woff|ttf|html|gif|svg|json|jpg)$/,
        serve: function (params) {
            return path.join(__dirname, `src/${params.reqPath}`);
        }
    }]
});

const options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/server.crt')
};

http.createServer(options, function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(443);
