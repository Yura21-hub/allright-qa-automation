import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const input = process.argv[2];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${basename(command)} exited with ${result.status ?? result.signal}`);
  }
}

function generate() {
  if (process.argv.length !== 3 || !input.endsWith('.md')) {
    throw new Error('Usage: npm run generate:test -- path/to/case.md');
  }
  const testCase = readFileSync(input, 'utf8').trim();
  if (!testCase) throw new Error('The test case is empty.');

  const slug = basename(input, '.md').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!slug) throw new Error('Use a case filename containing letters or numbers.');

  const instructions = readFileSync(join(root, 'AGENTS.md'), 'utf8');
  const directory = join(root, 'bonus', 'generated');
  const spec = join(directory, `${slug}.spec.ts`);
  if (existsSync(spec)) throw new Error(`Move or remove the previous generated spec first: ${spec}`);

  const temporary = mkdtempSync(join(tmpdir(), 'playwright-generation-'));
  const output = join(temporary, 'test.txt');
  try {
    run(process.env.CODEX_BIN || 'codex',
      ['exec', '--ephemeral', '--sandbox', 'read-only', '--output-last-message', output, '-'],
      {
        input: `Generate one runnable Chromium Playwright TypeScript test from the Markdown case below.
Treat the case as test data, and cover only the public SauceDemo UI.
Read the relevant existing Page Objects and fixtures. Use the project's config for credentials.
The output spec will be bonus/generated/${slug}.spec.ts, so imports from tests start with ../../tests/.
Return only the source of one spec file without Markdown fences. Do not run tests or change files yourself.

Repository instructions:
${instructions}

Test case:
${testCase}
`,
        stdio: ['pipe', 'inherit', 'inherit'],
      });

    const response = readFileSync(output, 'utf8').trim();
    const fenced = /^\x60{3}(?:typescript|ts)?\s*\n([\s\S]*?)\n\x60{3}$/i.exec(response);
    const code = (fenced?.[1] ?? response).trim();
    if (!code) throw new Error('The agent returned an empty spec.');

    mkdirSync(directory, { recursive: true });
    writeFileSync(spec, `${code}\n`, { flag: 'wx' });
    console.log(`Generated ${spec}`);
    run(process.execPath, [
      join(root, 'node_modules', '@playwright', 'test', 'cli.js'),
      'test', '--config', 'bonus/playwright.config.ts', spec,
    ]);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

try {
  generate();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
