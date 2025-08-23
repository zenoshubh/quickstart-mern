import fs from "fs";

export function validateProjectName(name) {
  // Check for valid project name (npm package name rules)
  const validNameRegex = /^[a-z0-9][a-z0-9-_]*$/;
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Project name cannot be empty" };
  }
  if (!validNameRegex.test(name.toLowerCase())) {
    return { valid: false, error: "Project name must start with lowercase letter or number and contain only lowercase letters, numbers, hyphens, and underscores" };
  }
  if (name.length > 50) {
    return { valid: false, error: "Project name must be less than 50 characters" };
  }
  return { valid: true };
}

export function validatePortNumber(port, name) {
  const portNum = parseInt(port, 10);
  if (isNaN(portNum)) {
    return { valid: false, error: `${name} port must be a valid number` };
  }
  if (portNum < 1024 || portNum > 65535) {
    return { valid: false, error: `${name} port must be between 1024 and 65535` };
  }
  return { valid: true, port: portNum };
}

export async function validateDirectoryExists(dirPath) {
  try {
    const stats = fs.statSync(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export async function validateTemplateExists(language, templatesDir) {
  const templatePath = `${templatesDir}/${language}`;
  const clientPath = `${templatePath}/client`;
  const serverPath = `${templatePath}/server`;
  
  const clientExists = await validateDirectoryExists(clientPath);
  const serverExists = await validateDirectoryExists(serverPath);
  
  if (!clientExists || !serverExists) {
    throw new Error(`${language} templates are missing. Expected client and server directories in templates/${language}/`);
  }
  
  return { clientPath, serverPath };
}

export function isMongoUriValid(envContent) {
  // Improved validation: handles quotes, whitespace, and checks for a real URI
  const match = envContent.match(/MONGODB_URI\s*=\s*["']?(.*?)["']?\s*(?:\n|$)/);
  if (!match) return false;
  const uri = match[1].trim();
  // Check for non-empty, not default, and starts with mongodb:// or mongodb+srv://
  return (
    uri &&
    uri !== "enter_yours" &&
    uri !== "" &&
    (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))
  );
}
