import { mkdir, writeFile } from 'node:fs/promises';
import { brands, catalog, catalogPackage } from '../catalog.mjs';

const output = new URL('../../public/catalog.json', import.meta.url);
await mkdir(new URL('../../public/', import.meta.url), { recursive: true });
await writeFile(output, JSON.stringify({ schemaVersion: 2, package: catalogPackage, brands, models: catalog }));