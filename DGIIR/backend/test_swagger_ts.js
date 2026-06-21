import { setupSwagger } from './src/docs/swagger.js';
import fs from 'fs';
const content = fs.readFileSync('./src/docs/swagger.ts', 'utf8');
console.log("TS CONTENT:");
console.log(content.substring(content.indexOf('servers:'), content.indexOf('components:')));
