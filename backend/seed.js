const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Review = require('./models/Review');

dotenv.config();

const companiesData = [
  {
    name: 'Leadjen Media',
    industry: 'Digital Marketing & IT Services',
    hq: 'Bhubaneswar, Odisha',
    founded: '2015',
    size: '50–200 Employees',
    type: 'Private Company',
    website: 'www.leadjenmedia.com',
    email: 'careers@leadjenmedia.com',
    logoText: 'LM',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=120&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=320',
    about: 'Leadjen Media is a premier digital marketing and IT solutions company dedicated to driving growth for businesses globally.',
    mission: 'To empower businesses with cutting-edge digital strategies that deliver measurable, real-world results.',
    vision: 'To be the most trusted digital transformation partner in India by 2030.',
    mvv: [
      { icon: '🎯', label: 'Mission', desc: 'To empower businesses with cutting-edge digital strategies.' },
      { icon: '👁️', label: 'Vision', desc: 'To be the most trusted digital transformation partner in India by 2030.' },
      { icon: '💎', label: 'Values', desc: 'Innovation, Integrity, and commitment to Client Success.' }
    ],
    coreValues: ['Innovation & Creativity', 'Integrity & Transparency', 'Client Success First', 'Excellence in Execution', 'Continuous Learning & Growth'],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80', label: 'Main Office' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80', label: 'Co-working Space' },
      { url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=400&q=80', label: 'Team Meeting' }
    ],
    benefits: [
      { icon: '🏥', label: 'Comprehensive Health Insurance' },
      { icon: '⏰', label: 'Flexible Work Hours' },
      { icon: '🌴', label: 'Generous Paid Time Off' },
      { icon: '📚', label: 'Professional Learning Budget' }
    ],
    stats: [
      { label: 'Hires Made', val: '45+', target: 45 },
      { label: 'Jobs Posted', val: '5', target: 5 },
      { label: 'Hiring Rate', val: '92%', target: 92 },
      { label: 'Followers', val: '12K', target: 12000 }
    ],
    rating: { score: '4.2', total: '128 Reviews', bars: [60, 20, 10, 5, 5] },
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'Instagram', icon: 'IG', url: '#' },
      { label: 'Facebook', icon: 'FB', url: '#' }
    ],
    reviews: [
      { author: 'Rahul S.', role: 'Marketing Executive', stars: 5, date: 'May 2026', text: 'Great place to work with excellent learning opportunities.' },
      { author: 'Priya K.', role: 'Telecaller', stars: 4, date: 'Jan 2026', text: 'Good work-life balance and collaborative environment.' },
      { author: 'Amit P.', role: 'SEO Specialist', stars: 4, date: 'Mar 2026', text: 'Fast-paced agency environment but very rewarding.' }
    ],
    jobs: [
      {
        title: 'Telecaller',
        exp: '0–2 Years',
        sal: '₹12,000–18,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: new Date('2026-06-25'),
        applyBefore: new Date('2026-07-15'),
        description: 'Handle inbound and outbound sales calls, generate leads, and follow up on customer inquiries.',
        responsibilities: ['Initiate outbound telemarketing calls', 'Describe products and services', 'Qualify leads', 'Update CRM databases'],
        skills: ['Communication Skills', 'Lead Generation', 'Customer Handling', 'CRM Tools'],
        benefits: ['Daily Performance Incentives', 'Health Insurance Cover', 'Structured Mentorship']
      },
      {
        title: 'Marketing Executive',
        exp: '0–2 Years',
        sal: '₹15,000–22,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: new Date('2026-06-24'),
        applyBefore: new Date('2026-07-20'),
        description: 'Coordinate and execute field and digital marketing campaigns.',
        responsibilities: ['Conduct market research', 'Coordinate offline events', 'Develop marketing collaterals', 'Monitor campaign metrics'],
        skills: ['Lead Generation', 'Client Acquisition', 'Communication Skills', 'Canva'],
        benefits: ['Travel Allowances', 'Mobile Bill Reimbursement', 'Performance Bonuses']
      },
      {
        title: 'Digital Marketing Executive',
        exp: '1–3 Years',
        sal: '₹18,000–28,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: new Date('2026-06-23'),
        applyBefore: new Date('2026-07-18'),
        description: 'Plan, build, and optimize paid and organic web campaigns.',
        responsibilities: ['Design paid search campaigns', 'Perform keyword research', 'Write SEO-friendly articles', 'Leverage Google Analytics'],
        skills: ['SEO', 'Google Ads', 'Meta Ads', 'Content Marketing', 'Google Analytics'],
        benefits: ['Flexible Working Hours', 'Learning Budget', 'Health Insurance']
      },
      {
        title: 'SEO Executive',
        exp: '0–3 Years',
        sal: '₹14,000–20,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: new Date('2026-06-22'),
        applyBefore: new Date('2026-07-12'),
        description: 'Scale search rankings for corporate portals.',
        responsibilities: ['Perform website technical audits', 'Build external backlinks', 'Analyze traffic trends', 'Optimize page load speeds'],
        skills: ['On-Page SEO', 'Link Building', 'Google Search Console', 'Ahrefs'],
        benefits: ['Annual Increment', 'Medical Insurance', 'Skill Certification Reimbursements']
      },
      {
        title: 'Social Media Executive',
        exp: '0–2 Years',
        sal: '₹13,000–18,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: new Date('2026-06-21'),
        applyBefore: new Date('2026-07-10'),
        description: 'Manage and grow brand presence across social media platforms.',
        responsibilities: ['Design monthly social media calendars', 'Produce visual graphics', 'Engage with followers', 'Audit channel insights'],
        skills: ['Social Media Management', 'Content Creation', 'Video Editing', 'Canva'],
        benefits: ['Creative Workspace', 'Workshops & Training', 'Monthly Team Outings']
      }
    ]
  },
  {
    name: 'Algopage Tech',
    industry: 'Software Development & IT Consultancy',
    hq: 'Bhubaneswar, Odisha',
    founded: '2019',
    size: '10–50 Employees',
    type: 'Private Startup',
    website: 'www.algopage.com',
    email: 'hr@algopage.com',
    logoText: 'AP',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200&h=320',
    about: 'Algopage Tech is a fast-growing software development shop building innovative mobile apps and bespoke web platforms.',
    mission: 'To build scalable, robust software solutions that solve real-world problems.',
    vision: 'To become a globally recognized engineering partner for tech-disruptors.',
    coreValues: ['Quality First', 'Agile Frameworks', 'Extreme Ownership', 'Continuous Learning'],
    benefits: [
      { icon: '💻', label: 'Premium Developer Gear' },
      { icon: '🏥', label: 'Employee Health Cover' },
      { icon: '📅', label: '5-Day Work Week' },
      { icon: '🎓', label: 'Certifications Reimbursed' }
    ],
    stats: [
      { label: 'Hires Made', val: '12', target: 12 },
      { label: 'Jobs Posted', val: '2', target: 2 },
      { label: 'Hiring Rate', val: '88%', target: 88 },
      { label: 'Followers', val: '3K', target: 3000 }
    ],
    rating: { score: '4.5', total: '42 Reviews', bars: [70, 18, 8, 3, 1] },
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'GitHub', icon: 'GH', url: '#' }
    ],
    reviews: [
      { author: 'Dev M.', role: 'Full Stack Developer', stars: 5, date: 'Mar 2026', text: 'Best startup experience. Very flat hierarchy and cutting-edge tech.' },
      { author: 'Sara T.', role: 'Product Designer', stars: 5, date: 'Feb 2026', text: 'Creative freedom is highly encouraged.' }
    ],
    jobs: [
      {
        title: 'Mobile App Developer',
        exp: '1–3 Years',
        sal: '₹25,000–45,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: new Date('2026-06-24'),
        applyBefore: new Date('2026-07-22'),
        description: 'Build cross-platform mobile applications using Flutter or React Native.',
        responsibilities: ['Architect cross-platform mobile interfaces', 'Integrate RESTful APIs', 'Optimize rendering scripts', 'Deploy to app stores'],
        skills: ['Flutter', 'Android SDK', 'iOS Development', 'REST APIs'],
        benefits: ['MacBook Developer Rig', 'Hybrid Work Allowed', 'Performance Bonuses']
      },
      {
        title: 'Frontend Developer',
        exp: '2–4 Years',
        sal: '₹30,000–55,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: new Date('2026-06-23'),
        applyBefore: new Date('2026-07-15'),
        description: 'Build responsive and accessible client interfaces.',
        responsibilities: ['Build reusable React components', 'Implement fluid animations', 'Ensure W3C accessibility', 'Cross-browser testing'],
        skills: ['React.js', 'JavaScript (ES6+)', 'CSS3 / SCSS', 'HTML5'],
        benefits: ['Flexible Timings', 'Learning Budget', 'Health Insurance']
      }
    ]
  },
  {
    name: 'TechNova Solutions',
    industry: 'Software Product Engineering',
    hq: 'Bhubaneswar, Odisha',
    founded: '2016',
    size: '150–300 Employees',
    type: 'Private Company',
    website: 'www.technovasolutions.com',
    email: 'careers@technova.com',
    logoText: 'TN',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&h=120&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200&h=320',
    about: 'TechNova Solutions is a forward-thinking digital agency specializing in enterprise software development.',
    mission: 'To write robust enterprise-grade software and bridge the gap between abstract requirements and clean code.',
    vision: 'To build software systems that process millions of daily transactions without interruption.',
    coreValues: ['Clean Code', 'System Security', 'Collaboration & Clarity', 'Scalable Systems'],
    benefits: [
      { icon: '🏥', label: 'Top-tier Health Insurance' },
      { icon: '⏰', label: 'Fully Remote Work Option' },
      { icon: '📚', label: 'Certifications Allowance' }
    ],
    stats: [
      { label: 'Hires Made', val: '120+', target: 120 },
      { label: 'Jobs Posted', val: '1', target: 1 },
      { label: 'Hiring Rate', val: '95%', target: 95 },
      { label: 'Followers', val: '24K', target: 24000 }
    ],
    rating: { score: '4.6', total: '240 Reviews', bars: [72, 18, 6, 3, 1] },
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'Twitter / X', icon: 'X', url: '#' }
    ],
    reviews: [
      { author: 'Sumit R.', role: 'Senior Architect', stars: 5, date: 'Apr 2026', text: 'Highly technical engineering team, clean code practices.' },
      { author: 'Kavita S.', role: 'DevOps Engineer', stars: 5, date: 'May 2026', text: 'Excellent infrastructure and tooling.' }
    ],
    jobs: [
      {
        title: 'Senior Frontend Developer',
        exp: '3–5 Years',
        sal: '₹8,00,000–12,00,000 / yr',
        type: 'Full-Time',
        location: 'Remote',
        fresher: false,
        postedDate: new Date('2026-06-25'),
        applyBefore: new Date('2026-07-15'),
        description: 'Build modern, responsive, and high-performance web interfaces.',
        responsibilities: ['Develop user-facing features', 'Ensure UI/UX feasibility', 'Optimize for speed', 'Collaborate with backend teams'],
        skills: ['HTML5', 'CSS3 / SCSS', 'JavaScript (ES6+)', 'React.js', 'Git'],
        benefits: ['Health insurance', 'Flexible working hours', 'Learning budget']
      }
    ]
  },
  {
    name: 'NorthStar Solutions',
    industry: 'IT Consulting & Services',
    hq: 'Bhubaneswar, Odisha',
    founded: '2018',
    size: '100–250 Employees',
    type: 'Private Company',
    website: 'www.northstarsol.com',
    email: 'careers@northstarsol.com',
    logoText: 'NS',
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=120&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200&h=320',
    about: 'NorthStar Solutions provides enterprise consulting, system integration services, and digital architecture advice.',
    mission: 'To build stable cloud configurations and provide elite tech support workflows.',
    vision: 'To be the preferred system integrator for high-security local clients.',
    coreValues: ['Reliability', 'Consultancy Quality', 'Rigorous Testing', 'Client Support'],
    benefits: [
      { icon: '🏥', label: 'Premium Medical Insurance' },
      { icon: '📅', label: 'Flexible Time Off' },
      { icon: '📚', label: 'Certification Sponsorship' },
      { icon: '🏠', label: 'Work From Home Options' }
    ],
    stats: [
      { label: 'Hires Made', val: '65', target: 65 },
      { label: 'Jobs Posted', val: '3', target: 3 },
      { label: 'Hiring Rate', val: '86%', target: 86 },
      { label: 'Followers', val: '6K', target: 6000 }
    ],
    rating: { score: '4.1', total: '38 Reviews', bars: [50, 20, 15, 10, 5] },
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'Twitter / X', icon: 'X', url: '#' }
    ],
    reviews: [
      { author: 'Meera G.', role: 'Solutions Consultant', stars: 4, date: 'Jan 2026', text: 'Professional corporate management. Great benefits.' },
      { author: 'Rajesh P.', role: 'Cloud Architect', stars: 5, date: 'Mar 2026', text: 'Excellent exposure to enterprise-scale cloud migrations.' }
    ],
    jobs: [
      {
        title: 'Cloud Infrastructure Consultant',
        exp: '3–6 Years',
        sal: '₹10,00,000–16,00,000 / yr',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: new Date('2026-06-26'),
        applyBefore: new Date('2026-07-20'),
        description: 'Lead cloud migration and infrastructure optimization projects.',
        responsibilities: ['Design multi-region cloud architectures', 'Conduct infrastructure audits', 'Build deployment pipelines', 'Present technical proposals'],
        skills: ['AWS', 'Azure', 'Terraform', 'Docker', 'Kubernetes'],
        benefits: ['Premium Health Cover', 'Client Travel Per Diem', 'Certification Bonuses']
      },
      {
        title: 'Business Analyst',
        exp: '2–4 Years',
        sal: '₹6,00,000–10,00,000 / yr',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: new Date('2026-06-24'),
        applyBefore: new Date('2026-07-18'),
        description: 'Bridge business needs and technology solutions.',
        responsibilities: ['Gather business requirements', 'Create functional specs', 'Coordinate with dev teams', 'Conduct UAT'],
        skills: ['Requirements Gathering', 'SQL', 'JIRA', 'Process Mapping'],
        benefits: ['Health Insurance', 'Learning Allowance', 'Performance Bonuses']
      },
      {
        title: 'QA Automation Engineer',
        exp: '1–3 Years',
        sal: '₹4,50,000–7,50,000 / yr',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: new Date('2026-06-22'),
        applyBefore: new Date('2026-07-15'),
        description: 'Design and execute automated test suites.',
        responsibilities: ['Write automated test scripts', 'Perform API testing', 'Track bugs in JIRA', 'Collaborate with developers'],
        skills: ['Selenium', 'Cypress', 'Postman', 'JIRA', 'SQL'],
        benefits: ['Health Insurance', 'Flexible Timings', 'Certification Support']
      }
    ]
  },
  {
    name: 'Bluepoint Digital',
    industry: 'Creative & Branding Agency',
    hq: 'Bhubaneswar, Odisha',
    founded: '2021',
    size: '20–80 Employees',
    type: 'Partnership Agency',
    website: 'www.bluepointdigital.com',
    email: 'hello@bluepointdigital.com',
    logoText: 'BD',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&h=120&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200&h=320',
    about: 'Bluepoint Digital is a design agency that transforms how brands interact with customers.',
    mission: 'To deliver aesthetic excellence that communicates core message instantly.',
    vision: 'To set visual standards for web product designs globally.',
    coreValues: ['Creative Integrity', 'Visual Harmony', 'Customer Insight', 'Bold Expression'],
    benefits: [
      { icon: '🍕', label: 'Free Snacks & Drinks' },
      { icon: '⏰', label: 'Flexi Hours' },
      { icon: '🎨', label: 'Creative Tools Allowance' },
      { icon: '📱', label: 'Latest Design Software' }
    ],
    stats: [
      { label: 'Hires Made', val: '22', target: 22 },
      { label: 'Jobs Posted', val: '2', target: 2 },
      { label: 'Hiring Rate', val: '91%', target: 91 },
      { label: 'Followers', val: '4K', target: 4000 }
    ],
    rating: { score: '4.4', total: '19 Reviews', bars: [60, 25, 10, 5, 0] },
    socials: [
      { label: 'Instagram', icon: 'IG', url: '#' },
      { label: 'Dribbble', icon: 'DR', url: '#' }
    ],
    reviews: [
      { author: 'Karan J.', role: 'Visual Designer', stars: 5, date: 'Feb 2026', text: 'Highly collaborative design-driven workspace.' },
      { author: 'Tanya M.', role: 'UI/UX Designer', stars: 5, date: 'Apr 2026', text: 'Every project is a chance to push creative boundaries.' }
    ],
    jobs: [
      {
        title: 'UI/UX Designer',
        exp: '1–3 Years',
        sal: '₹18,000–30,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: new Date('2026-06-25'),
        applyBefore: new Date('2026-07-15'),
        description: 'Design intuitive and visually compelling user interfaces.',
        responsibilities: ['Create wireframes and mockups', 'Design responsive layouts', 'Conduct usability testing', 'Maintain design systems'],
        skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping'],
        benefits: ['Creative Tools Budget', 'Flexible Hours', 'Portfolio Exposure']
      },
      {
        title: 'Content Writer',
        exp: '0–2 Years',
        sal: '₹12,000–20,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: new Date('2026-06-23'),
        applyBefore: new Date('2026-07-12'),
        description: 'Craft compelling brand copy and website content.',
        responsibilities: ['Write website copy', 'Create social media captions', 'Collaborate on brand messaging', 'Proofread content'],
        skills: ['Copywriting', 'SEO Writing', 'Brand Voice', 'Content Strategy'],
        benefits: ['Creative Workspace', 'Flexible Timings', 'Learning Budget']
      }
    ]
  },
  {
    name: 'Vertex Outsourcing',
    industry: 'BPO & Business Operations',
    hq: 'Bhubaneswar, Odisha',
    founded: '2013',
    size: '500–1000 Employees',
    type: 'Public Limited',
    website: 'www.vertexoutsource.com',
    email: 'jobs@vertexoutsource.com',
    logoText: 'VO',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&h=120&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&h=320',
    about: 'Vertex Outsourcing provides reliable back-office solutions and customer care services to Fortune 500 corporations.',
    mission: 'To scale client business operations with efficient and secure customer touchpoints.',
    vision: 'To be the most efficient customer support center in Eastern India.',
    coreValues: ['Operational Discipline', 'Data Safety', 'Customer Satisfaction', 'Employee Support'],
    benefits: [
      { icon: '🏥', label: 'ESI & PF Cover' },
      { icon: '🚌', label: 'Shuttle Service' },
      { icon: '🍽️', label: 'Subsidized Meals' },
      { icon: '📈', label: 'Performance Incentives' }
    ],
    stats: [
      { label: 'Hires Made', val: '400+', target: 400 },
      { label: 'Jobs Posted', val: '3', target: 3 },
      { label: 'Hiring Rate', val: '80%', target: 80 },
      { label: 'Followers', val: '9K', target: 9000 }
    ],
    rating: { score: '3.8', total: '290 Reviews', bars: [40, 20, 20, 10, 10] },
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'Facebook', icon: 'FB', url: '#' }
    ],
    reviews: [
      { author: 'Deepak N.', role: 'Team Lead', stars: 3, date: 'Mar 2026', text: 'Good starting point for career.' },
      { author: 'Sunita R.', role: 'Customer Support', stars: 4, date: 'Jan 2026', text: 'Steady work with regular shifts.' }
    ],
    jobs: [
      {
        title: 'Customer Support Executive',
        exp: '0–2 Years',
        sal: '₹10,000–16,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: new Date('2026-06-26'),
        applyBefore: new Date('2026-07-18'),
        description: 'Handle inbound customer queries via voice and chat channels.',
        responsibilities: ['Answer inbound calls', 'Document interactions', 'Follow escalation procedures', 'Meet daily KPIs'],
        skills: ['Communication Skills', 'Customer Handling', 'CRM Tools', 'Typing Speed'],
        benefits: ['ESI & PF', 'Performance Incentives', 'Free Transport']
      },
      {
        title: 'Quality Analyst',
        exp: '2–4 Years',
        sal: '₹20,000–30,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: new Date('2026-06-24'),
        applyBefore: new Date('2026-07-15'),
        description: 'Monitor and evaluate customer interactions for quality.',
        responsibilities: ['Audit recorded calls', 'Prepare quality reports', 'Conduct calibration sessions', 'Identify recurring errors'],
        skills: ['Quality Monitoring', 'Call Auditing', 'MS Excel', 'Coaching'],
        benefits: ['Health Insurance', 'Performance Bonuses', 'Shift Allowances']
      },
      {
        title: 'Process Team Lead',
        exp: '4–6 Years',
        sal: '₹30,000–45,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: new Date('2026-06-22'),
        applyBefore: new Date('2026-07-12'),
        description: 'Lead a team of 15-20 customer support agents.',
        responsibilities: ['Manage team scheduling', 'Conduct performance reviews', 'Handle escalations', 'Collaborate with quality teams'],
        skills: ['Team Management', 'Conflict Resolution', 'KPI Tracking', 'Leadership'],
        benefits: ['Health Insurance', 'Leadership Training', 'Performance Bonuses']
      }
    ]
  },
  {
    name: 'Coastline Tech',
    industry: 'Cloud & Infrastructure Services',
    hq: 'Bhubaneswar, Odisha',
    founded: '2020',
    size: '15–60 Employees',
    type: 'Private Startup',
    website: 'www.coastlinetech.com',
    email: 'hr@coastlinetech.com',
    logoText: 'CT',
    logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=120&h=120&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&h=320',
    about: 'Coastline Tech provides AWS, Azure, and Google Cloud hosting optimization and DevOps services.',
    mission: 'To minimize cloud infrastructure waste and automate pipeline deployments.',
    vision: 'To build zero-downtime server setups.',
    coreValues: ['Automation Always', 'Elastic Resource Scaling', 'Strict Firewall Security', 'Documentation First'],
    benefits: [
      { icon: '💻', label: 'Cloud Credits for Learning' },
      { icon: '⏰', label: 'Remote-First Culture' },
      { icon: '📚', label: 'AWS/Azure Certification Sponsorship' },
      { icon: '🖥️', label: 'Home Office Stipend' }
    ],
    stats: [
      { label: 'Hires Made', val: '18', target: 18 },
      { label: 'Jobs Posted', val: '2', target: 2 },
      { label: 'Hiring Rate', val: '89%', target: 89 },
      { label: 'Followers', val: '2K', target: 2000 }
    ],
    rating: { score: '4.3', total: '14 Reviews', bars: [60, 20, 10, 10, 0] },
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'GitHub', icon: 'GH', url: '#' }
    ],
    reviews: [
      { author: 'Aman S.', role: 'Cloud Engineer', stars: 4, date: 'Apr 2026', text: 'Highly technical work environment.' },
      { author: 'Kriti P.', role: 'DevOps Intern', stars: 5, date: 'May 2026', text: 'Best place to learn cloud infrastructure hands-on.' }
    ],
    jobs: [
      {
        title: 'DevOps Engineer',
        exp: '2–4 Years',
        sal: '₹8,00,000–14,00,000 / yr',
        type: 'Full-Time',
        location: 'Remote',
        fresher: false,
        postedDate: new Date('2026-06-25'),
        applyBefore: new Date('2026-07-18'),
        description: 'Build and maintain CI/CD pipelines and cloud infrastructure.',
        responsibilities: ['Design CI/CD pipelines', 'Provision cloud infrastructure', 'Monitor production systems', 'Optimize Kubernetes clusters'],
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'CI/CD'],
        benefits: ['Remote-First', 'Cloud Certification Budget', 'Unlimited PTO']
      },
      {
        title: 'Cloud Administrator',
        exp: '1–3 Years',
        sal: '₹5,00,000–9,00,000 / yr',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: new Date('2026-06-23'),
        applyBefore: new Date('2026-07-15'),
        description: 'Manage and optimize cloud hosting environments.',
        responsibilities: ['Provision EC2 and RDS resources', 'Manage Azure VMs', 'Implement backup strategies', 'Monitor cloud spend'],
        skills: ['AWS', 'Azure', 'Linux', 'Networking', 'Shell Scripting'],
        benefits: ['Health Insurance', 'Certification Sponsorship', 'Flexible Hours']
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');

    await Company.deleteMany({});
    await Job.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    for (const companyData of companiesData) {
      const { jobs, reviews, ...companyFields } = companyData;
      const company = await Company.create(companyFields);
      console.log(`Created company: ${company.name}`);

      if (jobs && jobs.length > 0) {
        const jobDocs = jobs.map(job => ({ ...job, companyId: company._id }));
        await Job.insertMany(jobDocs);
        console.log(`  Added ${jobs.length} jobs`);
      }

      if (reviews && reviews.length > 0) {
        const reviewDocs = reviews.map(review => ({ ...review, companyId: company._id }));
        await Review.insertMany(reviewDocs);
        console.log(`  Added ${reviews.length} reviews`);
      }
    }

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
