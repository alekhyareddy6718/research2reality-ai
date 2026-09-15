import fs from 'fs';
import path from 'path';

function buildSimplePdf(title: string, content: string): Buffer {
  const pdfHeader = '%PDF-1.4\n';
  const body = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
               `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
               `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n` +
               `4 0 obj\n<< /Length ${content.length + 100} >>\nstream\nBT\n/F1 14 Tf\n50 700 Td\n(${title}) Tj\n0 -30 Td\n/F1 10 Tf\n(${content.replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj\nET\nendstream\nendobj\n` +
               `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

  const xrefOffset = pdfHeader.length + body.length;
  const xref = `xref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000230 00000 n \n0000000400 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdfHeader + body + xref, 'binary');
}

const pdfBuffer = buildSimplePdf(
  'LoRA-Edge: Parameter-Efficient Fine-Tuning for Edge Devices',
  'Abstract: We present LoRA-Edge, an optimized low-rank adaptation matrix decomposition method for deploying large language models to ARM microcontrollers. Our benchmark demonstrates 94.8% accuracy with sub-40ms latency.'
);

const targetDir = path.join(__dirname, '../scratch');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetPath = path.join(targetDir, 'LoRA_Edge_Research_Paper.pdf');
fs.writeFileSync(targetPath, pdfBuffer);
console.log(`✅ Created test PDF file at: ${targetPath} (${pdfBuffer.length} bytes)`);
