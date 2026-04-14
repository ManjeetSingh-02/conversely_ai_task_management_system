export const APP_CONFIG = {
  // all nodes envs
  NODE_ENVS: {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TESTING: 'testing',
  },

  // all module related constants
  MODULE_CONFIG: {
    DIR_NAME: 'modules',
    CURRENT_VERSION: 'v1',
  },

  // all winston related constants
  WINSTON_CONFIG: {
    DIR_PATH: 'logs/%DATE%',
    COMBINED_FILE_NAME: 'combined.log',
    ERROR_FILE_NAME: 'error.log',
    DATE_PATTERN: 'YYYY-MM-DD',
    TIMESTAMP_FORMAT: 'HH:mm:ss',
  },

  // all available task status
  TASK_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
  },
};
