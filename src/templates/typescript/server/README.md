# MERN Server (TypeScript)

A TypeScript-based Express.js server template for MERN stack applications.

## Features

- TypeScript with strict type checking
- Express.js server with CORS support
- MongoDB integration with Mongoose
- Modular architecture with controllers, services, and routes
- Custom error handling and API response utilities
- Environment configuration support
- Development server with hot reload using nodemon

## Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts             # Server entry point
├── constants/            # App constants
├── controllers/          # Request handlers
├── lib/                 # Database connection
├── middlewares/         # Custom middleware
├── models/              # Database models
├── routes/              # API routes
├── services/            # Business logic
└── utils/               # Utility functions
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   CORS_ORIGIN=http://localhost:5173
   MONGODB_URI=your_mongodb_connection_string
   PORT=8000
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## API Endpoints

- `GET /api/v1/health` - Health check endpoint

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - CORS middleware
- **cookie-parser** - Cookie parsing middleware
- **dotenv** - Environment configuration

## Development Dependencies

- **typescript** - TypeScript compiler
- **ts-node** - TypeScript execution for Node.js
- **nodemon** - Development server with hot reload
- **@types/*** - Type definitions for libraries
