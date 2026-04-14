// internal-imports
import { corsConfig, env, loadModules } from '@/core/index.js';

// external-imports
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

// type-imports
import type { Application } from 'express';

// function to create application
export default function createApp(): Application {
  // create express application
  const application = express();

  // attach middlewares
  application
    .use(cookieParser(env.COOKIE_SECRET))
    .use(cors(corsConfig))
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

  // load all modules
  loadModules(application);

  // return the application
  return application;
}
