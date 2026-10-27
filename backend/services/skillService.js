// Shared skill dictionary + text extraction helpers.
// Used by both resume upload (auto-fill) and the ATS scanner so scoring
// always matches what we can detect.

const SKILL_DICTIONARY = [
  // languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Kotlin', 'Swift', 'SQL', 'R', 'MATLAB', 'Dart', 'Scala', 'Perl', 'Bash', 'Shell', 'HTML', 'CSS', 'SASS', 'NoSQL',
  // frontend
  'React', 'Angular', 'Vue', 'Next.js', 'Svelte', 'jQuery', 'Redux', 'Tailwind', 'Bootstrap', 'GraphQL', 'Webpack', 'Figma', 'UI/UX', 'Responsive Design', 'REST API', 'AJAX',
  // backend / data
  'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Spring Boot', 'Laravel', '.NET', 'Hibernate', 'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Firebase', 'Oracle', 'SQLite', 'Mongoose', 'Prisma', 'Supabase',
  // cloud / devops
  'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform', 'Ansible', 'Linux', 'Git', 'GitHub', 'GitLab', 'Nginx', 'Microservices', 'Lambda', 'EC2', 'S3', 'DynamoDB', 'Vercel', 'Heroku', 'Netlify',
  // data / ai
  'Machine Learning', 'Deep Learning', 'Data Science', 'Data Analysis', 'Data Analytics', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'Power BI', 'Tableau', 'Excel', 'SPSS', 'Hadoop', 'Spark', 'Big Data', 'ETL', 'Data Visualization', 'Statistics', 'AI',
  // qa / tools
  'Selenium', 'Playwright', 'Cypress', 'Jest', 'JMeter', 'Postman', 'API Testing', 'Manual Testing', 'Automation Testing', 'TestNG', 'Appium', 'JIRA', 'Agile', 'Scrum', 'Kanban',
  // mobile
  'Android', 'iOS', 'React Native', 'Flutter',
  // business / marketing
  'SEO', 'SEM', 'Digital Marketing', 'Content Writing', 'Content Marketing', 'Social Media Marketing', 'Google Analytics', 'Email Marketing', 'Copywriting', 'Market Research', 'Lead Generation', 'Sales', 'Business Development', 'CRM', 'Salesforce', 'HubSpot', 'Customer Support', 'Telecalling', 'Client Servicing', 'Account Management', 'Negotiation', 'Recruitment', 'HR', 'Payroll', 'Tally', 'Accounting', 'Bookkeeping', 'GST', 'Financial Analysis', 'Excel Modeling', 'Communication', 'Leadership', 'Public Speaking', 'Problem Solving', 'Team Management', 'Project Management', 'Time Management', 'MS Office', 'PowerPoint', 'WordPress'
];

// Canonical singular key for dedupe ("REST APIs" === "REST API")
const skillKey = (s) => s.toLowerCase().replace(/s$/, '').trim();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Find every dictionary skill present in a block of text
function detectSkills(text) {
  const found = [];
  for (const skill of SKILL_DICTIONARY) {
    const pattern = new RegExp('(^|[^A-Za-z0-9+#.])' + escapeRegex(skill) + '($|[^A-Za-z0-9+#])', 'i');
    if (pattern.test(text)) found.push(skill);
  }
  const seen = new Set();
  return found.filter(s => {
    const k = skillKey(s);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Contact extraction shared by upload + ATS checks
function extractEmail(text) {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0].toLowerCase() : null;
}

function extractPhone(text) {
  const candidates = text.match(/(?:\+?91[\s-]?)?\d{5}[\s-]?\d{5}|(?:\+?91[\s-]?)?\d{3}[\s-]?\d{3}[\s-]?\d{4}|(?:\+?91[\s-]?)?\d{10}/g) || [];
  for (const c of candidates) {
    const digits = c.replace(/\D/g, '');
    if (digits.length === 10 && /^[6-9]/.test(digits)) return digits.slice(0, 5) + ' ' + digits.slice(5);
    if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits[2])) return '+91 ' + digits.slice(2, 7) + ' ' + digits.slice(7);
  }
  return null;
}

function extractEducation(text) {
  const patterns = [
    /B\.?\s?Tech(?:\(?[A-Za-z.\s]*\)?)?/, /B\.?\s?E\b(?:\(?[A-Za-z.\s]*\)?)?/, /B\.?\s?Sc\b[A-Za-z.\s]*/,
    /B\.?\s?CA\b/, /B\.?\s?Com\b[A-Za-z.\s]*/, /M\.?\s?Tech[A-Za-z.\s]*/, /M\.?\s?Sc\b[A-Za-z.\s]*/,
    /M\.?\s?CA\b/, /M\.?\s?Com\b[A-Za-z.\s]*/, /MBA(?:\(?[A-Za-z.\s]*\)?)?/, /Diploma(?:\s+in\s+[A-Za-z0-9&.\s]+)?/,
    /Ph\.?\s?D\b/, /Intermediate/
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].replace(/\s+/g, ' ').trim();
  }
  return null;
}

module.exports = { SKILL_DICTIONARY, skillKey, detectSkills, extractEmail, extractPhone, extractEducation, escapeRegex };
