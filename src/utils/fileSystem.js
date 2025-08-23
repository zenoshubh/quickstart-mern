import fs from "fs";
import path from "path";

export async function copyDir(src, dest) {
  try {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      // Skip node_modules, .env, and dist directories
      if (["node_modules", ".env", "dist"].includes(entry.name)) {
        continue;
      }
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to copy directory from ${src} to ${dest}: ${error.message}`);
  }
}

export async function checkIfDirectoryExists(dirPath) {
  try {
    const stats = fs.statSync(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export function createEnvFiles(clientPath, serverPath, config) {
  const { frontendPort, backendPort, mongoUri } = config;
  
  const clientEnvContent = `VITE_REACT_APP_API_URL=http://localhost:${backendPort}\nVITE_PORT=${frontendPort}\n`;
  const serverEnvContent = `CORS_ORIGIN="http://localhost:${frontendPort}"\nMONGODB_URI="${mongoUri}"\nPORT=${backendPort}\n`;
  
  fs.writeFileSync(clientPath, clientEnvContent);
  fs.writeFileSync(serverPath, serverEnvContent);
}

export function updateEnvFiles(clientPath, serverPath, config) {
  const { frontend, backend } = config;
  
  // Update client .env
  fs.writeFileSync(
    clientPath,
    `VITE_REACT_APP_API_URL=http://localhost:${backend}\nVITE_PORT=${frontend}\n`
  );
  
  // Update server .env
  let serverEnvContent = fs.readFileSync(serverPath, "utf-8");
  serverEnvContent = serverEnvContent.replace(
    /CORS_ORIGIN\s*=\s*["']?http:\/\/localhost:\d+["']?/,
    `CORS_ORIGIN="http://localhost:${frontend}"`
  );
  serverEnvContent = serverEnvContent.replace(
    /PORT\s*=\s*\d+/,
    `PORT=${backend}`
  );
  fs.writeFileSync(serverPath, serverEnvContent);
}

export function createRootPackageJson(projectDir, projectName, useTypeScript, ports) {
  const { frontend } = ports;
  
  const rootPkg = {
    name: `${projectName}-root`,
    version: "1.0.0",
    description: `${useTypeScript ? "TypeScript" : "JavaScript"} MERN stack application`,
    scripts: {
      "setup": "npm run install-client && npm run install-server",
      "install-client": "cd client && npm install",
      "install-server": "cd server && npm install",
      "dev": "concurrently \"npm run dev-client\" \"npm run dev-server\"",
      "dev-client": `cd client && npm run dev -- --port ${frontend}`,
      "dev-server": "cd server && npm run dev",
      "build": "cd client && npm run build",
      "build-server": "cd server && npm run build"
    }
  };
  
  fs.writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify(rootPkg, null, 2)
  );
}
