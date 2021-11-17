'use strict';
const http = require('https');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const staticAlias = require('node-static-alias');
const fs = require('fs');
var fileServer = new staticAlias.Server('./', {
    alias: [{
        match: /\/([^/]+\/)*([^/]+)\.(js|css|png|woff2|woff|ttf|html|gif|svg|json|jpg)$/,
        serve: function (params) {
            return params.reqPath.replace(/\//gi, '').substring(1);
        }
    }]
});

const options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/server.crt')
};

http.createServer(options, function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(9527);

console.log('Sever Launch Port 9527');
