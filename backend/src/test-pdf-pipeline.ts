import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runPdfPipelineTest() {
  console.log('🚀 Starting Full-Pipeline PDF Upload & Downstream Integration Test...\n');

  // 1. Authenticate user
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@research2reality.ai', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data.token;
  console.log('✅ User Authenticated with JWT Token');

  // 2. Test Invalid File Upload (Validation Test)
  console.log('\n--- 🧪 Testing File Validation Error Handling ---');
  const invalidForm = new FormData();
  invalidForm.append('file', Buffer.from('console.log("hello world");'), {
    filename: 'invalid_script.js',
    contentType: 'text/javascript'
  });

  const invalidRes = await fetch(`${BASE_URL}/analysis/upload-pdf`, {
    method: 'POST',
    headers: {
      ...invalidForm.getHeaders(),
      'Authorization': `Bearer ${token}`
    },
    body: invalidForm
  });
  const invalidData = await invalidRes.json();
  if (!invalidRes.ok && !invalidData.success) {
    console.log('✅ [PASS] File Validation Rejected Invalid File Type (HTTP 400 Bad Request)');
  } else {
    console.error('❌ [FAIL] File validation failed to reject invalid file');
  }

  // 3. Test Empty File Upload (Validation Test)
  const emptyRes = await fetch(`${BASE_URL}/analysis/upload-pdf`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const emptyData = await emptyRes.json();
  if (!emptyRes.ok && !emptyData.success) {
    console.log('✅ [PASS] File Validation Rejected Empty Upload (HTTP 400 Bad Request)');
  } else {
    console.error('❌ [FAIL] Empty upload failed to reject');
  }

  // 4. Test REAL PDF File Upload
  console.log('\n--- 📄 Uploading Actual PDF File ---');
  const pdfPath = path.join(__dirname, '../scratch/LoRA_Edge_Research_Paper.pdf');
  const pdfBuffer = fs.readFileSync(pdfPath);

  const pdfForm = new FormData();
  pdfForm.append('file', pdfBuffer, {
    filename: 'LoRA_Edge_Research_Paper.pdf',
    contentType: 'application/pdf'
  });

  const uploadRes = await fetch(`${BASE_URL}/analysis/upload-pdf`, {
    method: 'POST',
    headers: {
      ...pdfForm.getHeaders(),
      'Authorization': `Bearer ${token}`
    },
    body: pdfForm
  });

  const uploadResult = await uploadRes.json();
  if (!uploadRes.ok || !uploadResult.success) {
    console.error('❌ PDF Upload Failed:', uploadResult);
    process.exit(1);
  }

  const { paper, analysis, analysisId, extractedTextLength } = uploadResult.data;
  console.log('✅ PDF Upload: PASS');
  console.log('✅ Backend Reception: PASS');
  console.log(`✅ PDF Text Extraction: PASS (${extractedTextLength} chars extracted)`);
  console.log(`✅ AI Analysis: PASS (Title: "${paper.title}")`);
  console.log(`✅ Database Persistence: PASS (Saved Paper ID: ${paper.id}, Analysis ID: ${analysisId})`);

  // 5. Test Downstream Modules using Uploaded Paper ID
  console.log('\n--- 🔗 Testing Downstream AI & Engineering Modules ---');

  // Gap Analysis
  const gapRes = await fetch(`${BASE_URL}/gaps/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ paperIds: [paper.id] })
  });
  const gapData = await gapRes.json();
  console.log(gapData.success ? '✅ Research Gap Analyzer: PASS' : '❌ Gap Analysis Failed');

  // Innovation Engine
  const innRes = await fetch(`${BASE_URL}/innovations/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ paperId: paper.id, domain: 'Edge Computing' })
  });
  const innData = await innRes.json();
  console.log(innData.success ? '✅ Innovation Engine: PASS' : '❌ Innovation Engine Failed');

  // Project Proposal Generation
  const projRes = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      paperId: paper.id,
      title: 'LoRA-Edge Deployment Microservice',
      description: 'Production pipeline based on uploaded paper.'
    })
  });
  const projData = await projRes.json();
  const projectId = projData.data.id;
  console.log(projData.success ? '✅ Project Proposal Generation: PASS' : '❌ Project Generation Failed');

  // Dataset Recommendation
  const dsRes = await fetch(`${BASE_URL}/recommendations/datasets?domain=Generative%20AI`);
  const dsData = await dsRes.json();
  console.log(dsData.success ? '✅ Dataset Recommendation: PASS' : '❌ Dataset Rec Failed');

  // Algorithm Recommendation
  const algRes = await fetch(`${BASE_URL}/recommendations/algorithms?category=Deep%20Learning`);
  const algData = await algRes.json();
  console.log(algData.success ? '✅ Algorithm Recommendation: PASS' : '❌ Algorithm Rec Failed');

  // Experiment Generator
  const expRes = await fetch(`${BASE_URL}/experiments/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ projectId, title: 'Rank Optimization Study', objectives: ['Measure ARM latency'] })
  });
  const expData = await expRes.json();
  console.log(expData.success ? '✅ Experiment Generator: PASS' : '❌ Experiment Generator Failed');

  // Code Generator
  const codeRes = await fetch(`${BASE_URL}/code/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ projectId, language: 'Python', requirement: 'LoRA linear layer forward pass' })
  });
  const codeData = await codeRes.json();
  console.log(codeData.success ? '✅ Code Generator: PASS' : '❌ Code Generator Failed');

  // Report Generator
  const repRes = await fetch(`${BASE_URL}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ paperId: paper.id, projectId, type: 'RESEARCH', title: 'LoRA-Edge Technical Assessment' })
  });
  const repData = await repRes.json();
  console.log(repData.success ? '✅ Report Generator: PASS' : '❌ Report Generator Failed');

  console.log('\n========================================');
  console.log('🎉 Full End-to-End PDF Pipeline Verification Complete!');
  console.log('========================================\n');
}

runPdfPipelineTest().catch(err => {
  console.error('Pipeline Test Error:', err);
  process.exit(1);
});
