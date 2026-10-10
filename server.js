/**
 * Aayusha Swad - Production Server Entry Point
 * Compatible with Hostinger Node.js, cPanel, VPS, and Cloud Application Managers.
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsxBin = path.resolve(__dirname, 'node_modules', '.bin', 'tsx');
const serverEntry = path.resolve(__dirname, 'server', 'index.ts');

const child = spawn(tsxBin, [serverEntry], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (err) => {
  console.error('[Startup Error] Failed to launch server process:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
