/**
 * Vite Environment Manager
 *
 * This module provides a centralized location to access environment variables.
 * Vite injects variables prefixed with VITE_ automatically into import.meta.env.
 */

interface EnvConfig {
  mode: string;
  baseUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
  // Define your custom VITE_ environment variables here.
  apiUrl?: string;
  [key: string]: unknown;
}

const env: EnvConfig = {
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL,
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  apiUrl: import.meta.env.VITE_API_URL,
};

/**
 * Retrieves an environment variable by key from Vite's injected env.
 * Optionally, a default value can be provided.
 *
 * @param key - The name of the environment variable.
 * @param defaultValue - A fallback default value.
 * @returns The environment variable value or defaultValue if not defined.
 */
export const getEnv = (key: string, defaultValue?: string): string | undefined => {
  const value = (import.meta.env as Record<string, any>)[key];
  return value === undefined ? defaultValue : value;
};

export default env;