const winston = require('winston');
const fs = require('fs');
// Create a log directory if it doesn't exist
const logDir = '/home/vijay7396/CoE_PD/logs/node_logs/';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
// Define formats for console and file transports
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })
);
const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {

        return `${timestamp} -${level} : ${message}`;
    })
);
const logger = winston.createLogger({
    format: winston.format.combine(
        // winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({ format: consoleFormat }), // Console format
        new winston.transports.File({
            filename: `${logDir}/checklist.log`,
            level: 'info', // Log levels to file 
            format: fileFormat // File format
        })
    ]
});
// Custom colors for log levels
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
});

module.exports = logger;
