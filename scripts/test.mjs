import ts from 'typescript';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
await mkdir('tests/.compiled', {recursive:true});
for (const name of ['fixtures','store','adapter']) {
 const source=await readFile(`src/demo/${name}.ts`,'utf8');
 const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/from '(\.\/[^']+)'/g,"from '$1.mjs'");
 await writeFile(`tests/.compiled/${name}.mjs`,output);
}
const result=spawnSync(process.execPath,['--test','--test-isolation=none','tests/demo.test.mjs'],{stdio:'inherit'});
process.exit(result.status??1);
