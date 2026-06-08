import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const spacingPx = {
  96: 'var(--space-5xl)',
  64: 'var(--space-4xl)',
  48: 'var(--space-3xl)',
  32: 'var(--space-2xl)',
  24: 'var(--space-xl)',
  16: 'var(--space-lg)',
  12: 'var(--space-md)',
  8: 'var(--space-sm)',
  4: 'var(--space-xs)',
};

const fontPx = {
  13: 'var(--text-xs)',
  14: 'var(--text-sm)',
  15: 'var(--text-md)',
  16: 'var(--text-base)',
};

const spacingProps =
  /^\s*(margin|padding|gap|row-gap|column-gap|scroll-margin|scroll-padding)(-[a-z]+)?\s*:/;
const fontProps = /^\s*font-size\s*:/;
const leadingProps = /^\s*line-height\s*:/;

const leadingMap = {
  1.2: 'var(--leading-tight)',
  1.35: 'var(--leading-snug)',
  1.45: 'var(--leading-snug)',
  1.5: 'var(--leading-body)',
  1.55: 'var(--leading-body)',
  1.65: 'var(--leading-relaxed)',
};

function replacePxTokens(value, pxMap) {
  return value.replace(/(?<![\w-])(\d+)px\b/g, (_, n) => pxMap[Number(n)] ?? `${n}px`);
}

function migrateFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split('\n');
  const next = lines.map((line) => {
    if (spacingProps.test(line)) {
      const colon = line.indexOf(':');
      if (colon === -1) return line;
      const prop = line.slice(0, colon + 1);
      const value = line.slice(colon + 1);
      return prop + replacePxTokens(value, spacingPx);
    }
    if (fontProps.test(line)) {
      const colon = line.indexOf(':');
      const prop = line.slice(0, colon + 1);
      const raw = line.slice(colon + 1).trim().replace(/;$/, '');
      const pxMatch = /^(\d+)px$/.exec(raw);
      const replaced = pxMatch ? (fontPx[Number(pxMatch[1])] ?? raw) : raw;
      return `${prop} ${replaced};`;
    }
    if (leadingProps.test(line)) {
      const colon = line.indexOf(':');
      const prop = line.slice(0, colon + 1);
      const value = line.slice(colon + 1).trim().replace(/;$/, '');
      const replaced = leadingMap[Number(value)] ?? value;
      return `${prop} ${replaced};`;
    }
    return line;
  });

  const output = next.join('\n');
  if (output !== original) {
    fs.writeFileSync(filePath, output);
    return true;
  }
  return false;
}

const dirs = [
  path.join(root, 'src', 'screens'),
  path.join(root, 'src', 'components'),
];

let changed = 0;
for (const dir of dirs) {
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.css')) continue;
    if (migrateFile(path.join(dir, name))) changed += 1;
  }
}

console.log(`Updated ${changed} CSS files.`);
