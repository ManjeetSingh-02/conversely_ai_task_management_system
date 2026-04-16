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

  // all task related constants
  TASK_CONFIG: {
    // all available task status
    STATUS: {
      PENDING: 'pending',
      COMPLETED: 'completed',
    },

    // all available task sort options
    SORT_OPTIONS: {
      TITLE: 'title',
      DUE_DATE: 'dueDate',
      CREATED_AT: 'createdAt',
    },

    // all available sort orders
    SORT_ORDERS: {
      ASC: 'asc',
      DESC: 'desc',
    },
  },
};
