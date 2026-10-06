import { cpSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');

// dist is generated deployment output. Keeping the source files at the project
// root preserves the game's zero-build local workflow.
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
copyFileSync(resolve(root, 'index.html'), resolve(output, 'index.html'));
copyFileSync(resolve(root, 'styles.css'), resolve(output, 'styles.css'));
cpSync(resolve(root, 'js'), resolve(output, 'js'), { recursive: true });

console.log('Built static Fruitopia site in dist/');
