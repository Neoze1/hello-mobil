import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const files=['README.md','AGENTS.md','CLAUDE.md','GEMINI.md',...(await readdir(resolve(root,'docs'))).filter(file=>file.endsWith('.md')).map(file=>'docs/'+file)];
const failures=[];let count=0;
function anchors(text){return [...text.matchAll(/^#{1,6}\s+(.+)$/gm)].map(match=>match[1].toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s/g,'-'));}
for(const file of files){
 const text=await readFile(resolve(root,file),'utf8');
 for(const match of text.matchAll(/\]\(([^)]+)\)/g)){
  const target=match[1];if(/^(https?:|mailto:)/.test(target))continue;
  const [path,anchor]=target.split('#');const location=path?resolve(dirname(resolve(root,file)),decodeURIComponent(path)):resolve(root,file);
  try{const info=await stat(location);if(anchor&&info.isFile()&&!anchors(await readFile(location,'utf8')).includes(decodeURIComponent(anchor)))throw new Error('Missing anchor');count++;}
  catch{failures.push(file+' → '+target);}
 }
}
const agents=await readFile(resolve(root,'AGENTS.md'),'utf8');
for(const file of files.filter(file=>file.startsWith('docs/')))if(!agents.includes('('+file+')'))failures.push('AGENTS index missing '+file);
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`PASS: ${count} local document links and anchors; all canonical docs indexed in AGENTS.md. External URLs and unchanged teacher task examples are not counted as locally verified links.`);
