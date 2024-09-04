const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

// Function to create a logger with a specified filename and level
const createFileLogger = (filename, level) => {
  const logFilePath = `/home/vijay7396/CoE_PD/logs/node_logs/${filename}`;
  return createLogger({
    level: 'info',
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss', // Customize the timestamp format
        tz: 'Asia/Kolkata', // Set the timezone to Indian Standard Time (IST)
      }),
      printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    ),
    transports: [
      new transports.File({ filename: logFilePath, level }),
    ],
  });
};

module.exports = {
  createFileLogger,
};
