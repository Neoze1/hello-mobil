import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const directory of ['.','public','scripts'])for(const file of await readdir(resolve(root,directory))){if(!/\.(mjs|js)$/.test(file))continue;const result=spawnSync(process.execPath,['--check',resolve(root,directory,file)],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
console.log('All JavaScript modules passed syntax checks.');
