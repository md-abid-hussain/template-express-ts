# Ultimate Open Source Starter Kit

## Introduction

This starter kit provides a robust foundation for building modern web applications using TypeScript, Express, and Prisma.

## Features

- TypeScript for type safety
- Express for building APIs
- Prisma for database management
- Pre-configured ESLint and Prettier for code quality
- Docker support for containerization
- Husky for Git hooks
- Comprehensive error handling

## Getting Started

### Prerequisites

- Node.js (v20.16.0)
- Docker (optional)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/md-abid-hussain/template-express-ts.git
   cd template-express-ts
   ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Set up environment variables:
    ```sh
    cp .env.example .env
    ```
4. Make prisma migrations
    ```sh
    npx prisma migrate dev
    ```
5. Start the development server:
    ```sh
    npm run dev
    ```
6. Visit `http://localhost:3000` to access the application.


## Scripts
 - `npm run dev`: Start the development server
 - `npm run build`: Build the application
 - `npm start`: Start the production server
 - `npm run lint`: Lint the code
 - `npm run format`: Format the code
 - `npm run migrate`: Create a new migration
 - `npm run generate`: Generate Prisma client
 - `npm run reset`: Reset the database
 - `npm run prepare`: Prepare the project for publishing


## Contributing
Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
