// internal-imports
import { createApp } from '@/app/index.js';
import { env, logger } from '@/core/index.js';

// external-imports
import http from 'http';

// function to start the server
async function startServer(): Promise<void> {
  // create express application
  const application = createApp();

  // create http server
  const server = http.createServer(application);

  // promise to attach event listeners
  await new Promise<void>((resolve, reject) =>
    server
      .once('error', reject)
      .once('listening', () => {
        logger.info(`Server is running @ ${env.PORT}`);
        resolve();
      })
      .listen(env.PORT)
  );
}

// start the server
startServer().catch(error => {
  logger.error(error);
  process.exit(1);
});
