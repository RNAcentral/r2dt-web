/*
  This script updates the templates.js file with the latest models.json from the R2DT repository.
*/

import fs from 'fs';
import https from 'https';

const url = 'https://raw.githubusercontent.com/r2dt-bio/R2DT/main/data/models.json';
const outputFile = 'src/templates.js';

https.get(url, res => {
  let data = '';
  res.on('data', chunk => (data += chunk));
  res.on('end', () => {
    try {
      const models = JSON.parse(data);

      // Sort models by description
      const templates = [...models]
        .sort((a, b) => (a.description).trim().localeCompare((b.description).trim(), 'en', { sensitivity: 'base' }))
        .map(m => ({
          label: (m.description).trim(),
          model_id: m.model_id,
          source: m.source,
        }));

      // Write to file
      const jsContent = `export const templates = ${JSON.stringify(templates)};\n`;
      fs.writeFileSync(outputFile, jsContent);

      console.log(`Updated ${outputFile} with ${templates.length} templates.`);
    } catch (e) {
      console.warn('Error parsing models.json. Keeping existing templates.js.');
    }
  });
}).on('error', err => {
  console.warn('Network error fetching models.json:', err.message);
});
