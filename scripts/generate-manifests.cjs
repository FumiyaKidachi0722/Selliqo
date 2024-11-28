/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/generate-manifests.cjs

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir);

languages.forEach((lang) => {
  const langDir = path.join(localesDir, lang);
  const files = fs
    .readdirSync(langDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''));

  const manifestPath = path.join(langDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2));
});
