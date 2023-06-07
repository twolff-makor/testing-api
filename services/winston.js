const { createLogger, format, transports} = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, simple } = format;

const consoleTransport = new transports.Console();
const fileTransport = new transports.File({ filename: 'log_files.log' });

const logger = createLogger({
    level: 'info',
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    },
  format: format.combine(
    format.timestamp(),
    format.simple()
  ),
  transports: [
    consoleTransport,
    fileTransport, 
    new DailyRotateFile({
        filename: 'log_files/application-%DATE%.log',
        datePattern: 'YYYY-MM-DDTHHmmss',
        maxSize: '10m', 
        maxFiles: 1 // Keep only the latest log file
      }),
  ]
});

// logger.info('This is an informational message.');
// logger.debug('This is a debug message.');
// logger.error('An error occurred:', new Error('Sample error'));


module.exports = logger;
  