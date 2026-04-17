# conversely_ai_task_management_system
Task management system for conversely.ai backend developer internship

## Table of Contents
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
  - [Tree structure of the project](#tree-structure-of-the-project)
  - [Explanation of the folder structure](#explanation-of-the-folder-structure)
- [Demo](#demo)

## Installation
0. Make sure you have the following installed on your machine:
- Node.js
- pnpm
- Docker

1. Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/ManjeetSingh-02/conversely_ai_task_management_system.git
cd conversely_ai_task_management_system
```

2. Install dependencies:
```bash
pnpm install
```

3. Run docker containers for PostgreSQL and MongoDB:
```bash
docker compose up -d
```

4. Create a `.env` file in the root directory and add the following variables:
```env
ORIGIN_URL=http://localhost:5173
PORT=3000
POSTGRES_DB_URI=postgresql://admin:password@localhost:5432/conversely_ai_postgresdb
MONGO_DB_URI=mongodb://localhost:27017/conversely_ai_mongodb
NODE_ENV=development
COOKIE_SECRET=minimum_of_32_char_cookie_secret
ACCESS_TOKEN_SECRET=minimum_of_32_char_access_token_secret
ACCESS_TOKEN_LIFETIME=900000
REFRESH_TOKEN_SECRET=minimum_of_32_char_refresh_token_secret
REFRESH_TOKEN_LIFETIME=86400000
```

5. Run prisma migrations to create the necessary tables in the PostgreSQL database:
```bash
pnpm prisma migrate dev
```

6. Generate prisma client:
```bash
pnpm prisma generate
```

7. Now go to `src/core/database/prisma/client.ts` file and add the following code:
```typescript
// internal-imports
import { env } from '../../config/env.js';
import { PrismaClient } from './generated/client.js';

// external-imports
import { PrismaPg } from '@prisma/adapter-pg';

// create a new prisma client instance
export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.POSTGRES_DB_URI }),
});
```

8. Start the development server:
```bash
pnpm dev
```

## API Documentation
- **`postman_collection.json`**: It contains the postman collection for testing all the API endpoints, import this file into postman to access the predefined requests.

## Folder Structure

### Tree structure of the project:
```bash
.
├── node_modules
├── prisma
│   ├── migrations
│   └── schema.prisma
├── src
│   ├── app
│   │   ├── express
│   │   │   └── application.ts
│   │   └── index.ts
│   ├── core
│   │   ├── config
│   │   │   ├── constants.ts
│   │   │   ├── cors.ts
│   │   │   └── env.ts
│   │   ├── database
│   │   │   ├── generated
│   │   │   ├── mongoose.ts
│   │   │   └── prisma.ts
│   │   ├── lib
│   │   │   ├── bcrypt.ts
│   │   │   └── jwt.ts
│   │   ├── loader
│   │   │   └── modules.ts
│   │   ├── logger
│   │   │   └── winston.ts
│   │   ├── middleware
│   │   │   ├── authenticate.ts
│   │   │   └── zod.ts
│   │   ├── response
│   │   │   ├── error.ts
│   │   │   └── success.ts
│   │   ├── types
│   │   │   ├── express.d.ts
│   │   │   └── response.ts
│   │   ├── utils
│   │   │   └── async-handler.ts
│   │   └── index.ts
│   ├── modules
│   │   └── v1
│   │       ├── healthcheck
│   │       │   ├── controller.ts
│   │       │   ├── module.ts
│   │       │   └── route.ts
│   │       ├── tasks
│   │       │   ├── controller.ts
│   │       │   ├── module.ts
│   │       │   ├── route.ts
│   │       │   └── zod.ts
│   │       └── users
│   │           ├── controller.ts
│   │           ├── module.ts
│   │           ├── route.ts
│   │           └── zod.ts
│   └── server.ts
├── .env
├── .gitignore
├── .npmrc
├── .prettierignore
├── .prettierrc
├── docker-compose.yml
├── eslint.config.ts
├── package.json
├── pnpm-lock.yaml
├── postman_collection.json
├── prisma.config.ts
├── README.md
└── tsconfig.json
```

### Explanation of the folder structure:
  - I have organized the project into several folders to maintain a clean and modular structure.
  - `root` directory contains configuration files, environment variables, and documentation.
  - `prisma` folder contains the Prisma schema and migration files for PostgreSQL database.
  - `src` folder contains all the source code for the application and there are three main folders: `app`, `core`, and `modules`.
    - `app` folder contains the main application setup, including the Express application.
    - `core` folder contains all the core functionalities, such as database connections, configurations, utilities, and middleware.
    - `modules` folder contains the different modules of the application, each module is organized into its own folder with its controller, route, and zod schema.

## Demo
- Video Link: [Click Here](https://drive.google.com/drive/folders/1rcLjSXk-wQqOeC_9sWBdOKmvwarksRSn)