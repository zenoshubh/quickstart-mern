export const DEFAULT_PORTS = {
  frontend: 5173,
  backend: 8000
};

export const PORT_RANGES = {
  min: 1024,
  max: 65535
};

export const PROJECT_CONFIG = {
  maxNameLength: 50,
  defaultProjectName: "my-mern-app"
};

export const MONGO_CONFIG = {
  defaultUri: "enter_yours",
  validPrefixes: ["mongodb://", "mongodb+srv://"]
};

export const VALIDATION_CONFIG = {
  maxAttempts: 3,
  projectNameRegex: /^[a-z0-9][a-z0-9-_]*$/
};
