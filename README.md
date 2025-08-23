# 🚀 QuickStart MERN

[![npm version](https://img.shields.io/npm/v/quickstart-mern.svg)](https://www.npmjs.com/package/quickstart-mern)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript Support](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> **The fastest way to bootstrap a production-ready MERN stack application**

## 📦 Installation

```bash
npx quickstart-mern
```

QuickStart MERN is a powerful CLI tool that generates a complete, production-ready MERN (MongoDB, Express, React, Node.js) stack application in seconds. Choose between JavaScript or TypeScript, get automatic path aliases, MongoDB integration, and start coding immediately.

## ✨ Features

### 🎯 **Zero Configuration**

- **Instant Setup**: Generate complete MERN stack in under 30 seconds
- **Smart Defaults**: Sensible configurations that work out of the box
- **Auto Dependencies**: Automatically installs and configures all dependencies

### 🔧 **Language Flexibility**

- **TypeScript Support**: Full TypeScript templates with strict type checking
- **JavaScript Ready**: Modern ES modules with latest syntax support
- **Path Aliases**: Clean `@/` imports instead of `../../../` mess

### 🗄️ **Database Integration**

- **MongoDB Ready**: Mongoose ORM pre-configured with connection handling
- **Health Checks**: Built-in database connectivity monitoring
- **Flexible Setup**: Run with or without database connection

### 🎨 **Modern Stack**

- **React 19**: Latest React features with hooks and concurrent rendering
- **Express 5**: Modern Express.js with enhanced security
- **Vite 7**: Lightning-fast development with HMR
- **TailwindCSS 4**: Latest utility-first CSS framework
- **ESLint**: Code quality and consistency enforcement

### 🚀 **Developer Experience**

- **Interactive CLI**: Beautiful prompts with arrow key navigation
- **VSCode Integration**: Auto-opens configuration files
- **Hot Reload**: Instant feedback during development
- **Concurrency**: Run client and server simultaneously
- **Custom Ports**: Configure ports to avoid conflicts

## 🎮 Usage

### Interactive Mode

```bash
npx quickstart-mern
```

The CLI will guide you through:

1. **Project Name**: Enter your project name (follows npm naming conventions)
2. **Language Choice**: Select JavaScript or TypeScript
3. **Database Setup**: Configure MongoDB connection (optional)
4. **Dependency Installation**: Auto-install or manual setup
5. **Port Configuration**: Use defaults or customize ports
6. **Launch Options**: Start development servers immediately

### Example Workflow

```bash
$ npx quickstart-mern

🚀 MERN Stack Project Generator
Create a full-stack JavaScript or TypeScript application

✔ Project name: my-awesome-app
✔ Choose your preferred language: TypeScript (recommended for larger projects)
✔ Do you want to connect to MongoDB? Yes, I have a MongoDB connection string
✔ Do you want to install dependencies now? Yes, install dependencies automatically
✔ How would you like to proceed? Install dependencies and run on default ports

🎯 Creating my-awesome-app with TypeScript...
✅ TypeScript templates copied successfully!
✅ Environment files created
✅ Dependencies installed successfully!

🎯 Starting development servers...
ℹ Frontend: http://localhost:5173
ℹ Backend: http://localhost:8000
```

## 📁 Generated Project Structure

```
my-awesome-app/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── app/              # App configuration & routing
│   │   │   ├── App.tsx       # Main App component
│   │   │   ├── main.tsx      # React entry point
│   │   │   └── routes.tsx    # React Router configuration
│   │   ├── pages/            # Page components
│   │   │   └── Home.tsx      # Landing page with MERN branding
│   │   ├── components/       # Reusable UI components
│   │   ├── constants/        # Frontend configuration
│   │   └── assets/           # Static assets
│   ├── public/
│   │   └── mern.svg         # MERN stack logo
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration with @ aliases
│   ├── tsconfig.json        # TypeScript configuration
│   ├── tailwind.config.js   # TailwindCSS configuration
│   └── .env                 # Frontend environment variables
│
├── server/                   # Express backend application
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   │   └── health.controller.ts
│   │   ├── services/         # Business logic
│   │   │   └── health.service.ts  # Database health checking
│   │   ├── routes/           # API routes
│   │   │   └── health.routes.ts
│   │   ├── middlewares/      # Express middlewares
│   │   │   └── error.middleware.ts
│   │   ├── lib/              # Database & external libraries
│   │   │   └── connectDB.ts  # MongoDB connection
│   │   ├── utils/            # Helper utilities
│   │   │   ├── ApiError.ts   # Custom error classes
│   │   │   ├── ApiResponse.ts # Standardized responses
│   │   │   └── asyncHandler.ts # Async error handling
│   │   ├── models/           # Database models
│   │   ├── constants/        # Backend configuration
│   │   ├── app.ts           # Express app configuration
│   │   └── server.ts        # Server entry point
│   ├── package.json         # Backend dependencies
│   ├── tsconfig.json        # TypeScript config with @ aliases
│   ├── nodemon.json         # Nodemon configuration
│   └── .env                 # Backend environment variables
│
├── package.json             # Root package.json with scripts
└── README.md               # Project documentation
```

## 🔧 Configuration

### Environment Variables

#### Client (.env)

```bash
VITE_REACT_APP_API_URL=http://localhost:8000  # Backend API URL
VITE_PORT=5173                                # Frontend port
```

#### Server (.env)

```bash
PORT=8000                                     # Backend port
CORS_ORIGIN="http://localhost:5173"           # Frontend URL for CORS
MONGODB_URI="your_mongodb_connection_string"  # MongoDB connection
```

### Path Aliases

Both client and server support clean imports:

```typescript
// Instead of: import { something } from '../../../utils/something'
import { something } from "@/utils/something";

// Available aliases:
import component from "@/components/MyComponent"; // Client
import service from "@/services/MyService"; // Server
import controller from "@/controllers/MyController"; // Server
```

## 🏃‍♂️ Available Scripts

### Root Level

```bash
npm run dev          # Start both client and server concurrently
npm run setup        # Install dependencies for both client and server
npm run build        # Build client for production
npm run build-server # Build server for production (TypeScript only)
```

### Client

```bash
cd client
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Server

```bash
cd server
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript (TS projects only)
npm run start        # Start production server (TS projects only)
```

## 🗄️ Database Integration

### MongoDB Setup

1. **With Connection String**: Provide your MongoDB URI during setup
2. **Without Database**: Skip database setup and add it later
3. **Health Monitoring**: Built-in `/api/v1/health` endpoint

### Health Check Response

```json
{
  "message": "Server is healthy",
  "timestamp": "2025-01-23T10:30:00.000Z",
  "uptime": 3600,
  "database": {
    "status": "connected",
    "message": "Database connection is healthy",
    "readyState": 1,
    "host": "cluster.mongodb.net",
    "name": "myapp"
  }
}
```

## 🎨 UI Components & Styling

### TailwindCSS Integration

- **TailwindCSS 4**: Latest version with modern features
- **Responsive Design**: Mobile-first approach
- **Custom Theme**: MERN stack color scheme (MongoDB green, React cyan, Node.js blue)
- **Dark Mode Ready**: Built-in dark mode support

### Icon Libraries

- **TypeScript Projects**: Lucide React (tree-shakeable, lightweight)
- **JavaScript Projects**: React Icons (comprehensive icon set)

### Sample Home Page

The generated project includes a beautiful landing page featuring:

- ✅ Backend connectivity test
- 📊 Interactive feature showcase
- 🎨 MERN stack branding
- 📱 Responsive design
- ⚡ Performance optimizations

## 🚀 Production Deployment

### Build Process

```bash
# Build client
npm run build

# Build server (TypeScript)
npm run build-server

# Start production server
npm start
```

### Environment Setup

1. Set production environment variables
2. Configure MongoDB Atlas connection
3. Update CORS origins for your domain
4. Set up CI/CD pipelines

### Recommended Hosting

- **Client**: Vercel, Netlify, AWS S3 + CloudFront
- **Server**: Railway, Render, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas, AWS DocumentDB

## ⚡ Performance Features

### Development

- **Vite HMR**: Instant hot module replacement
- **TypeScript**: Compile-time error checking
- **Concurrency**: Parallel client/server development
- **Source Maps**: Debug-friendly builds

### Production

- **Tree Shaking**: Dead code elimination
- **Code Splitting**: Automatic bundle optimization
- **Compression**: Built-in gzip/brotli support
- **Caching**: Optimized asset caching

## 🧪 Testing Ready

The generated project is testing-ready with:

- Jest configuration (can be added)
- React Testing Library setup
- API endpoint testing structure
- Mock data generation utilities

## 🛠️ Troubleshooting

### Common Issues

**Port Already in Use**

```bash
# Use custom ports during setup
quickstart-mern
# Select "Install dependencies with custom ports"
```

**MongoDB Connection Issues**

```bash
# Check your connection string format
mongodb://username:password@host:port/database
# or
mongodb+srv://username:password@cluster.mongodb.net/database
```

**Permission Denied (Global Install)**

```bash
# Fix npm permissions
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
```

**TypeScript Compilation Errors**

```bash
# Rebuild TypeScript project
cd server
npm run build
```

### Getting Help

- 🐛 **Issues**: [GitHub Issues](https://github.com/zenoshubh/quickstart-mern/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/zenoshubh/quickstart-mern/discussions)
- 📧 **Email**: Open an issue for support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/zenoshubh/quickstart-mern.git
cd quickstart-mern
npm install
npm link  # Test CLI locally
```

## 📄 License

ISC © [zenoshubh](https://github.com/zenoshubh)

## 🙏 Acknowledgments

- **React Team**: For the amazing React ecosystem
- **Vite Team**: For blazing fast development experience
- **MongoDB**: For the flexible document database
- **Express Team**: For the minimal web framework
- **TailwindCSS**: For the utility-first CSS framework
- **TypeScript Team**: For type safety in JavaScript

---

<div align="center">
  <strong>Made with ❤️ for the JavaScript community</strong><br>
  <em>Star ⭐ this repo if it helped you build something awesome!</em>
</div>
