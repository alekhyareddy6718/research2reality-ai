import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runVerification() {
  console.log('🚀 Starting Research2Reality AI Automated End-to-End API Verification...\n');
  let passed = 0;
  let failed = 0;

  const test = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  };

  // 1. Health Check
  await test('Health Check Endpoint', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (!data.success || data.status !== 'ONLINE') throw new Error('Health check status invalid');
  });

  // 2. User Authentication
  let userToken = '';
  await test('User Login', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@research2reality.ai', password: 'password123' })
    });
    const data = await res.json();
    if (!data.success || !data.data.token) throw new Error(data.error?.message || 'Login failed');
    userToken = data.data.token;
  });

  // 3. Admin Authentication
  let adminToken = '';
  await test('Admin Login', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@research2reality.ai', password: 'password123' })
    });
    const data = await res.json();
    if (!data.success || !data.data.token) throw new Error(data.error?.message || 'Admin login failed');
    adminToken = data.data.token;
  });

  // 4. Fetch Papers
  let samplePaperId = '';
  await test('Fetch Research Papers', async () => {
    const res = await fetch(`${BASE_URL}/papers`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data.papers) || data.data.papers.length === 0) {
      throw new Error('No papers returned');
    }
    samplePaperId = data.data.papers[0].id;
  });

  // 5. Paper Analysis
  await test('Analyze Paper', async () => {
    const res = await fetch(`${BASE_URL}/analysis/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ paperId: samplePaperId })
    });
    const data = await res.json();
    if (!data.success || !data.data.analysis?.summary) throw new Error(data.error?.message || 'Analysis failed');
  });

  // 6. Research Gap Analyzer
  await test('Analyze Research Gaps', async () => {
    const res = await fetch(`${BASE_URL}/gaps/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ paperIds: [samplePaperId] })
    });
    const data = await res.json();
    if (!data.success || !data.data.result?.gaps) throw new Error(data.error?.message || 'Gap analysis failed');
  });

  // 7. Innovation Engine
  await test('Generate Innovation', async () => {
    const res = await fetch(`${BASE_URL}/innovations/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ paperId: samplePaperId, domain: 'AI SaaS' })
    });
    const data = await res.json();
    if (!data.success || !data.data.innovation?.title) throw new Error(data.error?.message || 'Innovation failed');
  });

  // 8. Projects Workspace CRUD
  let projectId = '';
  await test('Create Project Workspace', async () => {
    const res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        paperId: samplePaperId,
        title: 'LoRA Realtime Fine-Tuner',
        description: 'Accelerated low-rank adaptation deployment pipeline.'
      })
    });
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error(data.error?.message || 'Project creation failed');
    projectId = data.data.id;
  });

  await test('Fetch User Projects', async () => {
    const res = await fetch(`${BASE_URL}/projects`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error('Fetch projects failed');
  });

  // 9. Recommendations
  await test('Get Dataset Recommendations', async () => {
    const res = await fetch(`${BASE_URL}/recommendations/datasets?domain=NLP`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data.datasets)) throw new Error('Dataset recommendations failed');
  });

  // 10. Code Generator
  await test('Generate Code Snippet', async () => {
    const res = await fetch(`${BASE_URL}/code/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        projectId,
        language: 'Python',
        requirement: 'PyTorch LoRA attention layer forward pass'
      })
    });
    const data = await res.json();
    if (!data.success || !data.data.codeSnippet?.code) throw new Error(data.error?.message || 'Code generation failed');
  });

  // 11. Experiments Generator
  await test('Generate Experiment Protocol', async () => {
    const res = await fetch(`${BASE_URL}/experiments/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        projectId,
        title: 'LoRA Rank Evaluation',
        objectives: ['Evaluate accuracy and throughput']
      })
    });
    const data = await res.json();
    if (!data.success || !data.data.experiment?.workflowSteps) throw new Error(data.error?.message || 'Experiment generation failed');
  });

  // 12. Startup Pitch Generator
  await test('Generate Startup Pitch', async () => {
    const res = await fetch(`${BASE_URL}/startups/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        projectId,
        paperId: samplePaperId
      })
    });
    const data = await res.json();
    if (!data.success || !data.data.startup?.name) throw new Error(data.error?.message || 'Startup generation failed');
  });

  // 13. Reports Export Generator
  await test('Generate Report Export', async () => {
    const res = await fetch(`${BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        paperId: samplePaperId,
        type: 'RESEARCH',
        title: 'Comprehensive Transformer Analysis'
      })
    });
    const data = await res.json();
    if (!data.success || !data.data.report?.id) throw new Error(data.error?.message || 'Report generation failed');
  });

  // 14. Patent Search
  await test('Patent Search', async () => {
    const res = await fetch(`${BASE_URL}/patents?query=Transformer`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data.patents)) throw new Error('Patent search failed');
  });

  // 15. Admin Dashboard Analytics
  await test('Admin Stats Endpoint', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || !data.data.overview?.totalUsers) throw new Error('Admin stats failed');
  });

  console.log(`\n========================================`);
  console.log(`🎉 Verification Finished: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runVerification();
