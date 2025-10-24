import fs from 'node:fs';
import path from 'node:path';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Pavement Performance Suite API',
      version: '1.0.0',
      description: 'Auto-generated OpenAPI spec from route annotations.',
    },
    servers: [{ url: process.env.NEXTAUTH_URL || 'http://localhost:3000' }],
  },
  apis: ['pages/api/**/*.ts'],
} as const;

const spec = swaggerJSDoc(options);

const outDir = path.join(process.cwd(), 'public');
const outFile = path.join(outDir, 'swagger.json');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(spec, null, 2));

console.log(`OpenAPI spec written to ${outFile}`);
