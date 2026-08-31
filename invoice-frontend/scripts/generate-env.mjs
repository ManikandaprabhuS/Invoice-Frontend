import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const projectRoot = process.cwd();
const envPath = resolve(projectRoot, '.env');
const outputPath = resolve(projectRoot, 'public', 'env.js');

const variables = {};

const envFileContents = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';

for (const sourceLine of envFileContents.split(/\r?\n/)) {
  const line = sourceLine.trim();
  if (!line || line.startsWith('#')) continue;

  const separatorIndex = line.indexOf('=');
  if (separatorIndex <= 0) continue;

  const key = line.slice(0, separatorIndex).trim();
  let value = line.slice(separatorIndex + 1).trim();

  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  } else {
    value = value.replace(/\s+#.*$/, '').trim();
  }

  variables[key] = value;
}

const configuredApiUrl = process.env.API_BASE_URL?.trim() || variables.API_BASE_URL;
if (!configuredApiUrl) {
  throw new Error(
    'API_BASE_URL must be configured in the frontend .env file or the deployment environment.'
  );
}

let apiUrl;
try {
  apiUrl = new URL(configuredApiUrl);
} catch {
  throw new Error('API_BASE_URL must be a valid absolute URL, for example http://localhost:5000.');
}

if (!['http:', 'https:'].includes(apiUrl.protocol)) {
  throw new Error('API_BASE_URL must use http:// or https://.');
}

const apiBaseUrl = configuredApiUrl.replace(/\/+$/, '');
const browserEnvironment = { API_BASE_URL: apiBaseUrl };

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `globalThis.__env = Object.freeze(${JSON.stringify(browserEnvironment)});\n`,
  'utf8'
);

console.log('[frontend-env] Generated public/env.js');
