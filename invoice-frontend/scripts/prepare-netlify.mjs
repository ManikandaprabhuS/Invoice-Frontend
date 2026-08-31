import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const browserOutput = resolve(process.cwd(), 'dist', 'invoice-frontend', 'browser');
const clientEntry = resolve(browserOutput, 'index.csr.html');
const netlifyEntry = resolve(browserOutput, 'index.html');

if (!existsSync(clientEntry)) {
  throw new Error(`Angular browser entry was not found at ${clientEntry}.`);
}

copyFileSync(clientEntry, netlifyEntry);
console.log('[netlify] Generated dist/invoice-frontend/browser/index.html');
