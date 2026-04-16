export const APP_CONFIG = {
  // all nodes envs
  NODE_ENVS: {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TESTING: 'testing',
  } as const,

  // all module related constants
  MODULE_CONFIG: {
    DIR_NAME: 'modules',
    CURRENT_VERSION: 'v1',
  } as const,

  // all winston related constants
  WINSTON_CONFIG: {
    DIR_PATH: 'logs/%DATE%',
    COMBINED_FILE_NAME: 'combined.log',
    ERROR_FILE_NAME: 'error.log',
    DATE_PATTERN: 'YYYY-MM-DD',
    TIMESTAMP_FORMAT: 'HH:mm:ss',
  } as const,

  // all task related constants
  TASK_CONFIG: {
    // all available task status
    STATUS: {
      PENDING: 'pending',
      COMPLETED: 'completed',
    } as const,

    // all available task sort options
    SORT_OPTIONS: {
      TITLE: 'title',
      DUE_DATE: 'dueDate',
      CREATED_AT: 'createdAt',
    } as const,

    // all available sort orders
    SORT_ORDERS: {
      ASC: 'asc',
      DESC: 'desc',
    } as const,
  },
};
