// scripts/update-templates.js
// Script untuk otomasi update template agent dari repo upstream

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Konfigurasi repo upstream dan folder lokal
// Support token for private repo or authenticated clone
const TEMPLATES_REPO_TOKEN = process.env.TEMPLATES_REPO_TOKEN;
let UPSTREAM_REPO = 'https://github.com/Psianturi/somnia-infra-kit.git';
if (TEMPLATES_REPO_TOKEN) {
  UPSTREAM_REPO = `https://${TEMPLATES_REPO_TOKEN}@github.com/Psianturi/somnia-infra-kit.git`;
}
const TMP_DIR = './.tmp-templates';
const LOCAL_TEMPLATES = path.resolve(__dirname, '../templates');

async function main() {
  // Clone repo upstream ke folder sementara
  console.log('Cloning upstream templates...');
  execSync(`git clone --depth=1 ${UPSTREAM_REPO} ${TMP_DIR}`);

  // Copy semua isi folder templates dari upstream ke local
  const upstreamTemplates = path.join(TMP_DIR, 'templates');
  if (fs.existsSync(upstreamTemplates)) {
    await fs.copy(upstreamTemplates, LOCAL_TEMPLATES, { overwrite: true });
    console.log('Templates updated from upstream.');
  } else {
    throw new Error('Upstream templates folder not found!');
  }

  // Cleanup
  await fs.remove(TMP_DIR);
}

main().catch(e => {
  console.error('Update templates failed:', e);
  process.exit(1);
});
