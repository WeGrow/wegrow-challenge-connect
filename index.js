"use strict"

var EventEmitter = require('events');
var WebSocket = require('ws');

var logger = require('./lib/logger');

// open global conection

var clients = {};

var BASE_URL = '';

var log = logger.getLogger({
    module: 'GlobalClient'
});
function routeGlobalMessage(message) {
    if (message.type == 'team.join') {
        // a new team has joined.
    } else if (message.type == 'team.connect') {
        // a team is ready to connect.
    } else if (message.type == 'team.left') {
        // a team has left.
    } else if (message.type == 'healthcheck') {
        // BONUS ☲
        // send back local team stats.
        // Format:
        //   globalWS.send(JSON.stringify({
        //       type: 'healthcheck',
        //       stats: [{
        //           id: 0,
        //           connected: false,
        //           deleted: false,
        //           messages_received: 0,
        //           props_received: 0
        //       }]
        //   }));
        var stats = [];
        Object.keys(clients).forEach(function(key) {
            var client = clients[key];
            stats.push(client.stats);
        });
        globalWS.send(JSON.stringify({
            type: 'healthcheck',
            stats: stats
        }));
    }
}

var globalSendMessage;
var globalWS = new WebSocket(BASE_URL + '/global')
globalWS.on('open', function open() {
    log.info('ws open');
    globalWS.on('message', function(data, flags) {
        log.info('ws message', {
            message: data
        });
        routeGlobalMessage(JSON.parse(data));
    });
});
