import { defineConfig } from '@playwright/test';
import main from '../playwright.config';

export default defineConfig({
  testDir: '.',
  workers: 1,
  reporter: 'list',
  outputDir: '../test-results/generated',
  projects: [{
    ...main.projects!.find((project) => project.name === 'ui'),
    name: 'generated',
    testMatch: ['**/generated/*.spec.ts', '**/examples/*.spec.ts'],
  }],
});
