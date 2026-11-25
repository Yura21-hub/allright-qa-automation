import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Target = { baseURL: string; username: string; password: string };
type Config = { ui: Target; api: Target };

function readConfig(filename: string, optional = false): unknown {
  const path = resolve(__dirname, '../../config', filename);
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    if (optional && (error as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw new Error(`Could not read ${filename}`, { cause: error });
  }
}

function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Expected an object for ${label}`);
  }
  return value as Record<string, unknown>;
}

const defaults = object(readConfig('demo.json'), 'demo.json');
const overrides = object(readConfig('local.json', true), 'local.json');

function target(key: keyof Config): Target {
  const properties = {
    ...object(defaults[key], `demo.json ${key}`),
    ...object(Object.hasOwn(overrides, key) ? overrides[key] : {}, `local.json ${key}`),
  };
  const { baseURL, username, password } = properties;
  if (typeof baseURL !== 'string' || !/^https?:\/\//.test(baseURL)
      || typeof username !== 'string' || !username || typeof password !== 'string' || !password) {
    throw new Error(`Invalid ${key} config. Provide baseURL, username, and password.`);
  }
  new URL(baseURL);
  return { baseURL, username, password };
}

export const config: Config = { ui: target('ui'), api: target('api') };
