// Generates a minimal valid PDF resume for testing text extraction.
const fs = require('fs');
const path = require('path');

const lines = [
  'AISHA SHARMA',
  'Bhubaneswar, Odisha',
  'aisha@demo.com | +91 98765 43210',
  '',
  'SKILLS',
  'JavaScript, React, Node.js, MongoDB, Express, HTML, CSS, Python',
  'Figma, REST APIs, Git, Tailwind, Redux',
  '',
  'EDUCATION',
  'B.Tech Computer Science, KIIT University, 2026',
  'Class XII, DAV Public School, 2022',
  '',
  'EXPERIENCE',
  'Frontend Developer Intern at Algopage Tech (2025-2026)',
  'Built responsive dashboards with React and Tailwind, REST API integration',
  '',
  'PROJECTS',
  'Job-Kart - full-stack job portal using MERN stack',
];

// Build a simple one-page PDF with Helvetica text
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
let content = 'BT /F1 11 Tf 50 770 Td 16 TL\n';
for (const line of lines) {
  content += `(${esc(line)}) Tj T*\n`;
}
content += 'ET';

const objects = [];
objects.push('<< /Type /Catalog /Pages 2 0 R >>');
objects.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>');
objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

let pdf = '%PDF-1.4\n';
const offsets = [0];
objects.forEach((obj, i) => {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
});
const xrefStart = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i++) {
  pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

const out = path.join(__dirname, 'test-resume.pdf');
fs.writeFileSync(out, pdf, 'binary');
console.log('wrote', out, fs.statSync(out).size, 'bytes');
