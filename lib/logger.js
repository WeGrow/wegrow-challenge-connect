var winston = require('winston');

function getLogger(superMeta) {
    var logger = new winston.Logger({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: 'bot-connect.log' })
        ]
    });
    logger.rewriters.push(function(level, msg, meta) {
        Object.assign(meta, superMeta);
        return meta;
    });
    return logger;
};

module.exports.getLogger = getLogger;
