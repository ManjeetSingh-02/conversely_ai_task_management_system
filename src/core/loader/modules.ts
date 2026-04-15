// internal-imports
import { APP_CONFIG } from '../config/constants.js';
import { env } from '../config/env.js';
import { logger } from '../logger/winston.js';

// external-imports
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// type-imports
import type { Application } from 'express';

// function to initialize all modules
export async function loadModules(application: Application) {
  // get the modules directory path
  const completeModulesDirPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '../..',
    APP_CONFIG.MODULE_CONFIG.DIR_NAME,
    APP_CONFIG.MODULE_CONFIG.CURRENT_VERSION
  );

  // get the file name as per environment variable
  const MODULE_FILE_NAME =
    env.NODE_ENV === APP_CONFIG.NODE_ENVS.DEVELOPMENT ? 'module.ts' : 'module.js';

  // if the modules directory doesn't exist, log a warning and return
  if (!fs.existsSync(completeModulesDirPath)) {
    logger.warn(`(${completeModulesDirPath}) doesn't exist`);
    return;
  }

  // read all the directories in the modules directory
  const moduleDirs = fs.readdirSync(completeModulesDirPath);

  // if no modules found, log a warning and return
  if (moduleDirs.length === 0) {
    logger.warn(`(${completeModulesDirPath}) has no modules`);
    return;
  }

  // loop through each module directory
  for (const moduleDir of moduleDirs) {
    // get the path for the module directory
    const moduleDirPath = path.join(completeModulesDirPath, moduleDir);

    // check if the path is not a directory or prefix with '_', if so continue
    if (!fs.statSync(moduleDirPath).isDirectory() || moduleDir.startsWith('_')) continue;

    // get the path for the module file
    const moduleFilePath = path.join(moduleDirPath, MODULE_FILE_NAME);

    // check if the module file exists, if not log a warning and continue
    if (!fs.existsSync(moduleFilePath)) {
      logger.warn(`(${moduleDir}/${MODULE_FILE_NAME}) doesn't exist`);
      continue;
    }

    // import the module file
    const module = await import(moduleFilePath);

    // if module doesn't have a default export, log a warning and continue
    if (!module.default) {
      logger.warn(`(${moduleDir}/${MODULE_FILE_NAME}) has no default export`);
      continue;
    }

    // if the module has a default export, call it with the application instance and log a success message
    module.default(application);
    logger.info(`(${moduleDir}) module loaded successfully`);
  }
}
