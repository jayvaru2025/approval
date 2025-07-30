import { getLogger, configure, addLayout } from 'log4js';

addLayout('json', (config) => {
  return (logEvent) => {
    return JSON.stringify(logEvent);
  };
});

configure({
  appenders: {
    // app: { type: "file", filename: "app.log" },
    out: { type: 'stdout', layout: { type: 'json', separator: ',' } },
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'debug',
    },
  },
});

const customLogger = (fileName: string | null) => {
  if (fileName) return getLogger(fileName);
  return getLogger();
};

export { customLogger };
