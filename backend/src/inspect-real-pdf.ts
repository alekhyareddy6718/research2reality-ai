import fs from 'fs';
const pdfParse = require('pdf-parse');

async function inspectRealPdf() {
  const realPdfPath = 'C:\\Users\\Alekhya Reddy\\Downloads\\testpapers.R2R.pdf';
  if (!fs.existsSync(realPdfPath)) {
    console.error('❌ Real PDF not found at:', realPdfPath);
    process.exit(1);
  }

  const pdfBuffer = fs.readFileSync(realPdfPath);
  console.log(`📄 File Path: ${realPdfPath}`);
  console.log(`📏 File Size: ${pdfBuffer.length} bytes (${(pdfBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);

  const parsed = await pdfParse(pdfBuffer);

  console.log(`📚 PDF Page Count: ${parsed.numpages} pages`);
  console.log(`📝 Extracted Text Length: ${parsed.text ? parsed.text.length : 0} characters`);
  console.log(`\n--- 🔍 First 800 characters of extracted text ---`);
  console.log(parsed.text.substring(0, 800));
  console.log(`-------------------------------------------------\n`);

  const textLower = parsed.text.toLowerCase();
  console.log('--- 🎯 Concept Verification in Real PDF Stream ---');
  console.log('covariate:', textLower.includes('covariate'));
  console.log('concept shift:', textLower.includes('concept shift'));
  console.log('optimal transport:', textLower.includes('optimal transport'));
  console.log('datashifts:', textLower.includes('datashifts'));
  console.log('novozymes:', textLower.includes('novozymes'));
  console.log('coloredmnist:', textLower.includes('coloredmnist'));
  console.log('pacs:', textLower.includes('pacs'));
}

inspectRealPdf().catch(err => {
  console.error('PDF inspection error:', err);
  process.exit(1);
});
