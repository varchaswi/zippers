const path = require('path');
require('winston-daily-rotate-file');

const { createLogger, format, transports } = require('winston');
const fs = require('fs');

const logDir = '../reports';
const inputs = "../inputs";
const roleopenOutput = '../reports/roleopen';
const ordersOutput = "../reports/orders";
const diagnosticsOutput = "../reports/diagnostics";
const redOutput = "../reports/redmachine";
const whiteOutput = "../reports/whitemachine";
const blueOutput = "../reports/bluemachine";
const greenOutput = "../reports/greenmachine";

var filesArray = [logDir, inputs, roleopenOutput,ordersOutput,diagnosticsOutput, redOutput, whiteOutput, blueOutput, greenOutput];

filesArray.forEach(function (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
})
const roleopenFile = new transports.DailyRotateFile({
  filename: `${roleopenOutput}/%DATE%-roleopen.csv`,
  datePattern: 'DD-MM-YYYY'
});
const ordersFile = new transports.DailyRotateFile({
  filename: `${ordersOutput}/%DATE%-orders.csv`,
  datePattern: 'DD-MM-YYYY',
  
});
const diagnosticsFile = new transports.DailyRotateFile({
    filename: `${diagnosticsOutput}/%DATE%-diagnostics.csv`,
    datePattern: 'DD-MM-YYYY'
  });
const redFile = new transports.DailyRotateFile({
  filename: `${redOutput}/%DATE%-RED.csv`,
  datePattern: 'DD-MM-YYYY'
});
const blueFile = new transports.DailyRotateFile({
  filename: `${blueOutput}/%DATE%-BLUE.csv`,
  datePattern: 'DD-MM-YYYY'
});
const greenFile = new transports.DailyRotateFile({
  filename: `${greenOutput}/%DATE%-GREEN.csv`,
  datePattern: 'DD-MM-YYYY'
});
const whiteFile = new transports.DailyRotateFile({
  filename: `${whiteOutput}/%DATE%-WHITE.csv`,
  datePattern: 'DD-MM-YYYY'
});
const roleopenLogger = createLogger({

  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    format.printf(info => `${info.timestamp},${info.message}`)
  ),
  transports: [
    roleopenFile
  ]
});
const ordersLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    format.printf(info => `${info.timestamp},${info.message}`)
  ),
  transports: [
    ordersFile
  ]
});
const diagnosticsLogger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS'
      }),
      format.printf(info => `${info.message},${timestamp}`)
    ),
    transports: [
      ordersFile
    ]
  });
const redLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    format.printf(info => `${info.timestamp},${info.message}`)
  ),
  transports: [
    redFile
  ]
});
const blueLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    format.printf(info => `${info.timestamp},${info.message}`)
  ),
  transports: [
    blueFile
  ]
});
const greenLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    format.printf(info => `${info.timestamp},${info.message}`)
  ),
  transports: [
    greenFile
  ]
});
const whiteLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    format.printf(info => `${info.timestamp},${info.message}`)
  ),
  transports: [
    whiteFile
  ]
});

module.exports = { roleopenLogger, ordersLogger,diagnosticsLogger,redLogger,blueLogger,greenLogger,whiteLogger };