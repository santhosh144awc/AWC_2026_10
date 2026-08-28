import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../../src');

console.log('========================================');
console.log('RUNNING FULL CODEBASE QA VERIFICATION AUDIT');
console.log('========================================\n');

let failed = false;

// 1. Prohibited Jargon & Badge Phrases Check
const PROHIBITED_TERMS = [
  { term: 'Annuity-Due', exceptions: ['utils/calculations/'] },
  { term: 'Annuity Due', exceptions: ['utils/calculations/'] },
  { term: 'ring-fencing', exceptions: [] },
  { term: 'Ring-Fencing', exceptions: [] },
  { term: 'Ring-fencing', exceptions: [] },
  { term: 'savings velocity', exceptions: [] },
  { term: 'compounding velocity', exceptions: [] },
  { term: 'Forced Lead Capture', exceptions: [] },
  { term: 'Zero Forced', exceptions: [] },
  { term: 'No forced lead capture', exceptions: [] },
  { term: '100% Un-Gated & Private', exceptions: [] },
  { term: 'Tier 1 • Quick & Simple', exceptions: [] },
  { term: 'Tier 2 • Milestone Planning', exceptions: [] },
  { term: 'Tier 3 • Decision Trade-Offs', exceptions: [] },
  { term: 'Tier 4 • Deeper Analysis', exceptions: [] },
  { term: 'Max LTV (90%)', exceptions: [] },
  { term: 'QPFP Diagnostic Methodology', exceptions: [] },
  { term: 'Compound Fisher Relation', exceptions: ['utils/calculations/'] },
  { term: 'Real Return (Fisher)', exceptions: ['utils/calculations/'] }
];

function getAllFiles(dir, exts = ['.astro', '.tsx', '.ts', '.md']) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.astro') {
        files = files.concat(getAllFiles(fullPath, exts));
      }
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allSrcFiles = getAllFiles(srcDir);

console.log(`Auditing ${allSrcFiles.length} source files for prohibited jargon...`);

for (const file of allSrcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative(srcDir, file).replace(/\\/g, '/');

  for (const item of PROHIBITED_TERMS) {
    if (item.exceptions.some(exc => relPath.includes(exc))) {
      continue;
    }
    if (content.includes(item.term)) {
      console.error(`❌ VIOLATION in ${relPath}: Found prohibited term "${item.term}"`);
      failed = true;
    }
  }
}

if (!failed) {
  console.log('✅ PASS: Zero prohibited jargon or unstandardized badge terms found in client/page files.');
}

// 2. Audit Standardized Badges & WhatsApp Strings
console.log('\nAuditing Calculator WhatsApp Links & Standard Badges...');

const calculatorFiles = allSrcFiles.filter(f => f.replace(/\\/g, '/').includes('components/calculators') && f.endsWith('.tsx'));
console.log(`Found ${calculatorFiles.length} calculator files to audit.`);

for (const calcFile of calculatorFiles) {
  const content = fs.readFileSync(calcFile, 'utf-8');
  const rel = path.basename(calcFile);

  if (content.includes('wa.me')) {
    // Check phone number
    if (!content.includes('918087971566')) {
      console.error(`❌ ERROR in ${rel}: WhatsApp link does not use correct phone number 918087971566`);
      failed = true;
    } else {
      console.log(`✅ PASS: ${rel} has valid WhatsApp link format with phone 918087971566.`);
    }

    // Check that WhatsApp message starts with standardized greeting
    const hasStandardGreeting = content.includes('Hi Santhosh, I used the') || content.includes('Hi Santhosh, I was planning');
    if (!hasStandardGreeting) {
      console.error(`❌ ERROR in ${rel}: WhatsApp message does not follow standardized greeting format.`);
      failed = true;
    }

    // Check that closing asks the standardized question
    const hasStandardClosing = content.includes('Can we connect to discuss this plan?') || content.includes('Could you help me structure');
    if (!hasStandardClosing) {
      console.error(`❌ ERROR in ${rel}: WhatsApp message does not follow standardized closing format.`);
      failed = true;
    }
  }
}

console.log('\n========================================');
if (failed) {
  console.error('QA AUDIT FAILED');
  process.exit(1);
} else {
  console.log('QA AUDIT PASSED: ALL CHECKS SUCCESSFUL');
  console.log('========================================');
  process.exit(0);
}
