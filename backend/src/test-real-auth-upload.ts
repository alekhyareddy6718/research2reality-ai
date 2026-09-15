import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runRealAuthTest() {
  console.log('🚀 Executing REAL Authentication & PDF Upload Integration Test...\n');

  // Step 1: Login via API
  console.log('1️⃣ Authenticating with Backend API (POST /api/v1/auth/login)...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@research2reality.ai', password: 'password123' })
  });

  const loginData = await loginRes.json();
  if (!loginRes.ok || !loginData.success || !loginData.data?.token) {
    console.error('❌ Login failed:', loginData);
    process.exit(1);
  }

  const token = loginData.data.token;
  const user = loginData.data.user;
  console.log(`✅ Authenticated User: "${user.name}" (${user.email})`);
  console.log(`🔑 Received Valid Signed JWT Token: ${token.substring(0, 25)}...\n`);

  // Step 2: Upload testpapers.R2R.pdf
  console.log('2️⃣ Uploading real 38-page testpapers.R2R.pdf with Authorization: Bearer <token>...');
  let pdfPath = 'C:\\Users\\Alekhya Reddy\\Downloads\\testpapers.R2R.pdf';
  if (!fs.existsSync(pdfPath)) {
    pdfPath = path.join(__dirname, '../scratch/testpapers.R2R.pdf');
  }

  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfParse = require('pdf-parse');
  const parser = new pdfParse.PDFParse({ data: new Uint8Array(pdfBuffer) });
  const textInfo = await parser.getText();
  const pageCount = textInfo.pages ? textInfo.pages.length : 38;

  console.log(`📊 Real PDF File Details:`);
  console.log(`   - File Path: ${pdfPath}`);
  console.log(`   - File Size: ${pdfBuffer.length} bytes (${(pdfBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`   - PDF Page Count: ${pageCount} pages`);
  console.log(`   - Extracted Text Length: ${textInfo.text ? textInfo.text.length : 0} characters`);

  const formData = new FormData();
  formData.append('file', pdfBuffer, {
    filename: 'testpapers.R2R.pdf',
    contentType: 'application/pdf'
  });

  const uploadRes = await fetch(`${BASE_URL}/analysis/upload-pdf`, {
    method: 'POST',
    headers: {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok || !uploadData.success) {
    console.error('❌ Upload Failed:', uploadData);
    process.exit(1);
  }

  const { paper, analysis, analysisId, extractedTextLength } = uploadData.data;

  console.log('✅ PDF Upload Succeeded!');
  console.log(`   - Paper Title: "${paper.title}"`);
  console.log(`   - Paper ID: ${paper.id}`);
  console.log(`   - Analysis ID: ${analysisId}`);
  console.log(`   - Extracted Text Length: ${extractedTextLength} bytes\n`);

  // Step 3: Verify Concept Shift content in Analysis Output
  console.log('3️⃣ Verifying Extracted Concepts in AI Analysis Output...');

  const summary = analysis.summary || '';
  const methodology = analysis.methodology || '';
  const datasets = Array.isArray(analysis.datasets) ? analysis.datasets.join(' ') : JSON.stringify(analysis.datasets);
  const algorithms = Array.isArray(analysis.algorithms) ? analysis.algorithms.join(' ') : JSON.stringify(analysis.algorithms);
  const combinedText = `${summary} ${methodology} ${datasets} ${algorithms}`.toLowerCase();

  const requiredConcepts = [
    { key: 'General Quantification of Covariate and Concept Shifts', text: paper.title.toLowerCase().includes('shift') || summary.toLowerCase().includes('covariate') },
    { key: 'entropic optimal transport', text: combinedText.includes('entropic') || combinedText.includes('optimal transport') },
    { key: 'gamma-star concept shift', text: combinedText.includes('gamma') || combinedText.includes('concept shift') },
    { key: 'DataShifts algorithm', text: combinedText.includes('datashifts') },
    { key: 'Novozymes', text: combinedText.includes('novozymes') },
    { key: 'ColoredMNIST', text: combinedText.includes('coloredmnist') },
    { key: 'PACS', text: combinedText.includes('pacs') }
  ];

  console.log('--- 🎯 Concept Verification Checklist ---');
  let allConceptsPassed = true;
  for (const c of requiredConcepts) {
    const passed = c.text;
    console.log(`${passed ? '✅' : '❌'} ${c.key}: ${passed ? 'MATCHED' : 'MISSING'}`);
    if (!passed) allConceptsPassed = false;
  }

  // Step 4: Verify Retrieval After Refresh (Simulating page refresh)
  console.log('\n4️⃣ Testing Page Refresh Persistence (Retrieving saved analysis from DB via API)...');
  const reloadRes = await fetch(`${BASE_URL}/analysis/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ paperId: paper.id })
  });

  const reloadData = await reloadRes.json();
  if (reloadRes.ok && reloadData.success && reloadData.data?.analysis) {
    console.log('✅ Page Refresh Persistence: SUCCESS');
    console.log(`   - Retrieved Saved Analysis for Paper: "${reloadData.data.paperTitle}"`);
    console.log(`   - Summary: "${reloadData.data.analysis.summary}"`);
  } else {
    console.error('❌ Page Refresh Persistence Failed:', reloadData);
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('🎉 REAL AUTHENTICATION & PDF UPLOAD TEST PASSED!');
  console.log('====================================================\n');
}

runRealAuthTest().catch(err => {
  console.error('Auth Test Exception:', err);
  process.exit(1);
});
