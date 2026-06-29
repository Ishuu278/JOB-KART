/* ============================================================
   js/companies-data.js — Shared Database for Job-Kart
   ============================================================ */

window.COMPANIES_DATA = {
  'leadjen': {
    id: 'leadjen',
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
    about: 'Leadjen Media is a premier digital marketing and IT solutions company dedicated to driving growth for businesses globally. We specialize in providing end-to-end digital solutions that help brands connect with their audiences, generate quality leads, and achieve measurable business goals. Headquartered in Bhubaneswar, Odisha, our passionate team of professionals serves clients across India and beyond with cutting-edge marketing technology.',
    mission: 'To empower businesses with cutting-edge digital strategies that deliver measurable, real-world results.',
    vision: 'To be the most trusted digital transformation partner in India by 2030, recognized for innovation and excellence.',
    mvv: [
      { icon: '🎯', label: 'Mission', desc: 'To empower businesses with cutting-edge digital strategies that deliver measurable, real-world results.' },
      { icon: '👁️', label: 'Vision', desc: 'To be the most trusted digital transformation partner in India by 2030.' },
      { icon: '💎', label: 'Values', desc: 'Innovation, Integrity, and absolute commitment to Client Success.' }
    ],
    coreValues: [
      'Innovation & Creativity',
      'Integrity & Transparency',
      'Client Success First',
      'Excellence in Execution',
      'Continuous Learning & Growth'
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80', label: 'Main Office' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80', label: 'Co-working Space' },
      { url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=400&q=80', label: 'Team Meeting' },
      { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80', label: 'Conference Hall' },
      { url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80', label: 'Creative Hub' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80', label: 'Relaxation Zone' }
    ],
    benefits: [
      { icon: '🏥', label: 'Comprehensive Health Insurance' },
      { icon: '⏰', label: 'Flexible Work Hours' },
      { icon: '🌴', label: 'Generous Paid Time Off' },
      { icon: '📚', label: 'Professional Learning Budget' },
      { icon: '🍕', label: 'Free Snacks & Catered Meals' },
      { icon: '💻', label: 'Home Office Setup Allowance' }
    ],
    stats: [
      { label: 'Hires Made', val: '45+', target: 45 },
      { label: 'Jobs Posted', val: '5', target: 5 },
      { label: 'Hiring Rate', val: '92%', target: 92 },
      { label: 'Followers', val: '12K', target: 12000 }
    ],
    rating: {
      score: '4.2',
      total: '128 Reviews',
      bars: [60, 20, 10, 5, 5]
    },
    reviews: [
      { author: 'Rahul S.', role: 'Marketing Executive', stars: '★★★★★', date: 'May 2026', text: 'Great place to work with excellent learning opportunities and a highly supportive team.' },
      { author: 'Priya K.', role: 'Telecaller', stars: '★★★★☆', date: 'Jan 2026', text: 'Good work-life balance, collaborative environment, and leadership that actually listens to feedback.' },
      { author: 'Amit P.', role: 'SEO Specialist', stars: '★★★★☆', date: 'Mar 2026', text: 'Fast-paced agency environment but very rewarding. You will grow your digital skillset quickly here.' },
      { author: 'Sneha R.', role: 'Social Media Manager', stars: '★★★★★', date: 'Jun 2026', text: 'Amazing creative freedom and a team that truly values fresh ideas. The monthly team outings are a great bonding experience.' },
      { author: 'Vikram T.', role: 'Digital Marketing Lead', stars: '★★★★☆', date: 'Feb 2026', text: 'Strong mentorship culture and transparent performance reviews. Room for rapid career growth if you are proactive.' }
    ],
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'Instagram', icon: 'IG', url: '#' },
      { label: 'Facebook', icon: 'FB', url: '#' },
      { label: 'Twitter / X', icon: 'X', url: '#' }
    ],
    jobs: [
      {
        id: 'telecaller-leadjen',
        title: 'Telecaller',
        exp: '0–2 Years',
        sal: '₹12,000–18,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: 'June 25, 2026',
        applyBefore: 'July 15, 2026',
        description: 'We are seeking energetic and enthusiastic Telecallers to join our business development team. You will be responsible for handling inbound and outbound sales calls, generating leads, following up on customer inquiries, and maintaining clean customer records. Excellent communication and persuasive skills are critical.',
        responsibilities: [
          'Initiate outbound telemarketing calls to prospective clients.',
          'Describe products and services, answer inquiries, and handle objections.',
          'Qualify leads and schedule online demonstrations for the sales team.',
          'Update CRM databases with accurate details of prospects and calls.'
        ],
        skills: ['Communication Skills', 'Lead Generation', 'Customer Handling', 'Follow-ups', 'CRM Tools'],
        benefits: ['Daily Performance Incentives', 'Health Insurance Cover', 'Structured Mentorship', 'Weekend Offs']
      },
      {
        id: 'marketing-executive-leadjen',
        title: 'Marketing Executive',
        exp: '0–2 Years',
        sal: '₹15,000–22,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: 'June 24, 2026',
        applyBefore: 'July 20, 2026',
        description: 'We are looking for a proactive Marketing Executive to coordinate and execute our field and digital marketing campaigns. You will collaborate on lead generation, local business outreach, competitor pricing audits, and brand positioning strategies to drive regional growth.',
        responsibilities: [
          'Conduct market research to identify target segments and customer needs.',
          'Coordinate offline events, client networking sessions, and local promotions.',
          'Develop marketing collaterals and social media assets with designers.',
          'Monitor campaign metrics, evaluate ROI, and prepare weekly reports.'
        ],
        skills: ['Lead Generation', 'Client Acquisition', 'Communication Skills', 'Competitor Analysis', 'Canva'],
        benefits: ['Travel Allowances', 'Mobile Bill Reimbursement', 'Performance Bonuses', 'Flexible Hours']
      },
      {
        id: 'digital-marketing-executive-leadjen',
        title: 'Digital Marketing Executive',
        exp: '1–3 Years',
        sal: '₹18,000–28,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: 'June 23, 2026',
        applyBefore: 'July 18, 2026',
        description: 'Join our digital growth team to plan, build, and optimize paid and organic web campaigns. You will lead search engine optimization (SEO), social media branding, Google Ads, and Meta campaigns to acquire international clients for Job-Kart partner services.',
        responsibilities: [
          'Design and execute paid search (SEM) and paid social campaign structures.',
          'Perform keyword research, on-page optimization, and backlink auditing.',
          'Write SEO-friendly articles, meta-descriptions, and blog copy.',
          'Leverage Google Analytics to measure conversion rates and optimize landing pages.'
        ],
        skills: ['SEO', 'Google Ads', 'Meta Ads', 'Content Marketing', 'Google Analytics'],
        benefits: ['Flexible Working Hours', 'Learning Budget', 'Health Insurance', 'Catered Meals']
      },
      {
        id: 'job-seo',
        title: 'SEO Executive',
        exp: '0–3 Years',
        sal: '₹14,000–20,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: 'June 22, 2026',
        applyBefore: 'July 12, 2026',
        description: 'We are looking for an SEO Executive who can scale search rankings for our corporate portals. You will identify business opportunities, audit web configurations, write meta details, and generate quality backlinks.',
        responsibilities: [
          'Perform detailed website technical audits and competitor profiles.',
          'Build strong external backlinks through outreach and guest postings.',
          'Analyze traffic trends in Search Console and report on keywords.',
          'Collaborate with developers to optimize page load speeds.'
        ],
        skills: ['On-Page SEO', 'Link Building', 'Google Search Console', 'Ahrefs', 'Technical SEO'],
        benefits: ['Annual Increment', 'Medical Insurance', 'Skill Certification Reimbursements']
      },
      {
        id: 'job-sme',
        title: 'Social Media Executive',
        exp: '0–2 Years',
        sal: '₹13,000–18,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: 'June 21, 2026',
        applyBefore: 'July 10, 2026',
        description: 'Manage and grow Job-Kart\'s brand presence across Instagram, LinkedIn, and Facebook. Create engaging short-form content, script video reels, design visual templates, and build community interactions.',
        responsibilities: [
          'Design monthly social media calendars aligned with brand positioning.',
          'Produce high-quality visual graphics and short video reels.',
          'Engage with followers, reply to comments, and moderate community forums.',
          'Audit channel insights to improve organic interaction rates.'
        ],
        skills: ['Social Media Management', 'Content Creation', 'Video Editing', 'Canva & Photoshop', 'Reels Creation'],
        benefits: ['Creative Workspace', 'Workshops & Training', 'Monthly Team Outings']
      }
    ]
  },
  'algopage': {
    id: 'algopage',
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
    about: 'Algopage Tech is a fast-growing, agile software development shop building innovative mobile apps and bespoke web platforms for startups and enterprise clients. We combine product design, cloud architecture, and modern programming standards to deliver high-performing digital systems.',
    mission: 'To build scalable, robust software solutions that solve real-world problems for global startups.',
    vision: 'To become a globally recognized engineering partner for tech-disruptors.',
    mvv: [
      { icon: '🚀', label: 'Mission', desc: 'To build scalable, robust software solutions that solve real-world problems.' },
      { icon: '👁️', label: 'Vision', desc: 'To be the most trusted software development agency in Odisha by 2030.' },
      { icon: '🤝', label: 'Values', desc: 'Collaboration, Quality, Speed, and Technical Rigor.' }
    ],
    coreValues: [
      'Quality First',
      'Agile Frameworks',
      'Extreme Ownership',
      'Continuous Learning',
      'User-Centric Engineering'
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80', label: 'Development Lab' },
      { url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80', label: 'Product Briefing' },
      { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80', label: 'Dev Standup' },
      { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80', label: 'Collaborator Hall' }
    ],
    benefits: [
      { icon: '💻', label: 'Premium Developer Gear' },
      { icon: '🏥', label: 'Employee Health Cover' },
      { icon: '📅', label: '5-Day Work Week' },
      { icon: '🎓', label: 'Certifications Reimbursed' },
      { icon: '🚀', label: 'Early-Stage Equity Options' },
      { icon: '🌴', label: 'Flexible Leave Framework' }
    ],
    stats: [
      { label: 'Hires Made', val: '12', target: 12 },
      { label: 'Jobs Posted', val: '2', target: 2 },
      { label: 'Hiring Rate', val: '88%', target: 88 },
      { label: 'Followers', val: '3K', target: 3000 }
    ],
    rating: {
      score: '4.5',
      total: '42 Reviews',
      bars: [70, 18, 8, 3, 1]
    },
    reviews: [
      { author: 'Dev M.', role: 'Full Stack Developer', stars: '★★★★★', date: 'Mar 2026', text: 'Best startup experience. Very flat hierarchy, cutting-edge tech stacks, and real code ownership.' },
      { author: 'Sara T.', role: 'Product Designer', stars: '★★★★★', date: 'Feb 2026', text: 'Creative freedom is highly encouraged. The engineering team collaborates closely with design.' },
      { author: 'Arjun K.', role: 'Backend Developer', stars: '★★★★☆', date: 'Apr 2026', text: 'Strong technical mentorship and exposure to modern architecture patterns. Great place to sharpen your skills.' },
      { author: 'Nisha B.', role: 'QA Engineer', stars: '★★★★☆', date: 'May 2026', text: 'Thorough code review culture and automated testing pipelines. Learned more here in 6 months than 2 years elsewhere.' }
    ],
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'GitHub', icon: 'GH', url: '#' },
      { label: 'Twitter / X', icon: 'X', url: '#' }
    ],
    jobs: [
      {
        id: 'job-mad',
        title: 'Mobile App Developer (Android / iOS / Flutter)',
        exp: '1–3 Years',
        sal: '₹25,000–45,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: 'June 24, 2026',
        applyBefore: 'July 22, 2026',
        description: 'We are seeking a Mobile App Developer with experience in cross-platform frameworks (Flutter/React Native) or native SDKs. You will work on expanding core modules, optimizing client UI layouts, implementing background synchronization, and deploying apps to markets.',
        responsibilities: [
          'Architect and build modular cross-platform mobile interfaces.',
          'Integrate RESTful JSON endpoints and local offline databases.',
          'Optimize rendering scripts to deliver 60 FPS visual smoothness.',
          'Deploy and monitor app binaries in the Apple App Store and Google Play Console.'
        ],
        skills: ['Flutter', 'Android SDK', 'iOS Development', 'REST APIs', 'Dart / JavaScript'],
        benefits: ['MacBook Developer Rig', 'Hybrid Work Allowed', 'Performance Bonuses']
      },
      {
        id: 'frontend-developer-algopage',
        title: 'Frontend Developer',
        exp: '2–4 Years',
        sal: '₹30,000–55,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: 'June 23, 2026',
        applyBefore: 'July 15, 2026',
        description: 'Build responsive and accessible client interfaces. You will translate wireframes into clean, structured components and maintain pixel-perfect responsive layouts across web properties.',
        responsibilities: [
          'Build reusable React components and client layouts.',
          'Implement fluid animations and screen transitions using pure CSS and JS.',
          'Ensure layouts comply with W3C web accessibility guidelines.',
          'Conduct cross-browser consistency testing.'
        ],
        skills: ['React.js', 'JavaScript (ES6+)', 'CSS3 / SCSS', 'HTML5', 'Responsive Design'],
        benefits: ['Flexible Timings', 'Learning Budget', 'Health Insurance']
      }
    ]
  },
  'technova': {
    id: 'technova',
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
    about: 'TechNova Solutions is a forward-thinking digital agency specializing in enterprise software development, system integrations, and modern product engineering. We believe in writing clean code, designing simple interfaces, and helping software scale with minimal overhead.',
    mission: 'To write robust enterprise-grade software and bridge the gap between abstract requirements and clean, shipping code.',
    vision: 'To build software systems that process millions of daily transactions without interruption.',
    mvv: [
      { icon: '🧱', label: 'Structure', desc: 'Writing modular code with predictable API boundaries.' },
      { icon: '⚡', label: 'Speed', desc: 'Developing performance-first backends and rapid client load structures.' },
      { icon: '🔒', label: 'Security', desc: 'Protecting corporate and user data with advanced access controls.' }
    ],
    coreValues: [
      'Clean Code',
      'System Security',
      'Collaboration & Clarity',
      'Scalable Systems',
      'Lifelong Learning'
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=400&q=80', label: 'Main Lobby' },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80', label: 'Open Dev Area' },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80', label: 'Meeting Lounge' }
    ],
    benefits: [
      { icon: '🏥', label: 'Top-tier Health Insurance' },
      { icon: '⏰', label: 'Fully Remote Work Option' },
      { icon: '📚', label: 'Certifications Allowance' },
      { icon: '🌴', label: 'Paid Sick and Casual Leaves' }
    ],
    stats: [
      { label: 'Hires Made', val: '120+', target: 120 },
      { label: 'Jobs Posted', val: '1', target: 1 },
      { label: 'Hiring Rate', val: '95%', target: 95 },
      { label: 'Followers', val: '24K', target: 24000 }
    ],
    rating: {
      score: '4.6',
      total: '240 Reviews',
      bars: [72, 18, 6, 3, 1]
    },
    reviews: [
      { author: 'Sumit R.', role: 'Senior Architect', stars: '★★★★★', date: 'April 2026', text: 'Highly technical engineering team, clean code practices, and great mentoring pipelines.' },
      { author: 'Kavita S.', role: 'DevOps Engineer', stars: '★★★★★', date: 'May 2026', text: 'Excellent infrastructure and tooling. CI/CD pipelines are world-class. Learned Kubernetes here from scratch.' },
      { author: 'Rohan M.', role: 'Frontend Developer', stars: '★★★★☆', date: 'March 2026', text: 'Strong emphasis on design systems and component architecture. Great for career growth in product engineering.' },
      { author: 'Pooja D.', role: 'Data Analyst', stars: '★★★★★', date: 'June 2026', text: 'Data-driven culture with access to modern BI tools. Management is approachable and genuinely invested in team success.' }
    ],
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'Twitter / X', icon: 'X', url: '#' }
    ],
    jobs: [
      {
        id: '101',
        title: 'Senior Frontend Developer',
        exp: '3–5 Years',
        sal: '₹8,00,000–12,00,000 / yr',
        type: 'Full-Time',
        location: 'Remote',
        fresher: false,
        postedDate: 'June 25, 2026',
        applyBefore: 'July 15, 2026',
        description: 'We are looking for a highly skilled Frontend Developer with a keen eye for design to join our expanding team. You will be responsible for building modern, responsive, and high-performance web interfaces.',
        responsibilities: [
          'Develop user-facing features using HTML, CSS, and modern JavaScript.',
          'Ensure the technical feasibility of UI/UX designs.',
          'Optimize application for maximum speed and scalability.',
          'Collaborate with back-end developers and web designers to improve usability.'
        ],
        skills: ['HTML5', 'CSS3 / SCSS', 'JavaScript (ES6+)', 'React.js', 'Responsive Design', 'Git'],
        benefits: [
          'Comprehensive health insurance.',
          'Flexible working hours and remote options.',
          'Annual learning and development budget.',
          'Paid time off and company holidays.'
        ]
      }
    ]
  },
  'northstar': {
    id: 'northstar',
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
    about: 'NorthStar Solutions provides enterprise consulting, system integration services, and digital architecture advice to banking, retail, and healthcare institutions. We specialize in migrative cloud architecture and workflow automation. Our team of seasoned consultants helps organizations modernize their IT infrastructure while minimizing operational disruption.',
    mission: 'To build stable cloud configurations and provide elite tech support workflows to enterprises.',
    vision: 'To be the preferred system integrator for high-security local clients.',
    mvv: [
      { icon: '⭐', label: 'Direction', desc: 'Navigating technical debt with planned steps and measurable milestones.' },
      { icon: '🛡️', label: 'Security', desc: 'Protecting enterprise data with zero-trust architecture and compliance-first design.' },
      { icon: '🤝', label: 'Partnership', desc: 'Building long-term client relationships through consistent delivery and transparency.' }
    ],
    coreValues: ['Reliability', 'Consultancy Quality', 'Rigorous Testing', 'Client Support', 'Knowledge Sharing'],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=400&q=80', label: 'Head Office' },
      { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80', label: 'Strategy Room' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80', label: 'Client Workshop' },
      { url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80', label: 'Training Center' }
    ],
    benefits: [
      { icon: '🏥', label: 'Premium Medical Insurance' },
      { icon: '📅', label: 'Flexible Time Off' },
      { icon: '📚', label: 'Certification Sponsorship' },
      { icon: '🏠', label: 'Work From Home Options' },
      { icon: '🎉', label: 'Annual Team Retreats' }
    ],
    stats: [
      { label: 'Hires Made', val: '65', target: 65 },
      { label: 'Jobs Posted', val: '3', target: 3 },
      { label: 'Hiring Rate', val: '86%', target: 86 },
      { label: 'Followers', val: '6K', target: 6000 }
    ],
    rating: { score: '4.1', total: '38 Reviews', bars: [50, 20, 15, 10, 5] },
    reviews: [
      { author: 'Meera G.', role: 'Solutions Consultant', stars: '★★★★☆', date: 'Jan 2026', text: 'Professional corporate management. Great benefits and structured growth path.' },
      { author: 'Rajesh P.', role: 'Cloud Architect', stars: '★★★★★', date: 'Mar 2026', text: 'Excellent exposure to enterprise-scale cloud migrations. The senior team is incredibly knowledgeable and always willing to mentor.' },
      { author: 'Ananya L.', role: 'Business Analyst', stars: '★★★★☆', date: 'May 2026', text: 'Strong client-facing role with real responsibility. The consulting environment sharpens both technical and soft skills quickly.' },
      { author: 'Suresh V.', role: 'Network Engineer', stars: '★★★☆☆', date: 'Feb 2026', text: 'Solid company with good infrastructure projects. Work-life balance could improve during peak project cycles.' }
    ],
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'Twitter / X', icon: 'X', url: '#' },
      { label: 'Facebook', icon: 'FB', url: '#' }
    ],
    jobs: [
      {
        id: 'cloud-consultant-northstar',
        title: 'Cloud Infrastructure Consultant',
        exp: '3–6 Years',
        sal: '₹10,00,000–16,00,000 / yr',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: 'June 26, 2026',
        applyBefore: 'July 20, 2026',
        description: 'Lead cloud migration and infrastructure optimization projects for enterprise clients across banking and healthcare sectors. You will design AWS/Azure architectures, implement CI/CD pipelines, and advise clients on cost-effective scaling strategies.',
        responsibilities: [
          'Design and implement multi-region cloud architectures on AWS and Azure.',
          'Conduct infrastructure audits and recommend optimization strategies.',
          'Build automated deployment pipelines using Terraform and Ansible.',
          'Present technical proposals and progress reports to client stakeholders.'
        ],
        skills: ['AWS', 'Azure', 'Terraform', 'Docker', 'Kubernetes', 'Linux'],
        benefits: ['Premium Health Cover', 'Client Travel Per Diem', 'Certification Bonuses', 'Flexible Hours']
      },
      {
        id: 'business-analyst-northstar',
        title: 'Business Analyst',
        exp: '2–4 Years',
        sal: '₹6,00,000–10,00,000 / yr',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: 'June 24, 2026',
        applyBefore: 'July 18, 2026',
        description: 'Bridge the gap between business needs and technology solutions by gathering requirements, documenting processes, and coordinating with development teams. You will work directly with enterprise clients in banking and retail.',
        responsibilities: [
          'Gather and document business requirements from client stakeholders.',
          'Create functional specifications and process flow diagrams.',
          'Coordinate with development and QA teams to ensure delivery alignment.',
          'Conduct user acceptance testing and gather feedback for iteration.'
        ],
        skills: ['Requirements Gathering', 'SQL', 'JIRA', 'Process Mapping', 'Stakeholder Management'],
        benefits: ['Health Insurance', 'Learning Allowance', 'Performance Bonuses']
      },
      {
        id: 'qa-engineer-northstar',
        title: 'QA Automation Engineer',
        exp: '1–3 Years',
        sal: '₹4,50,000–7,50,000 / yr',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: 'June 22, 2026',
        applyBefore: 'July 15, 2026',
        description: 'Design and execute automated test suites for enterprise web applications. You will build regression frameworks, perform API testing, and ensure release quality across multiple client projects.',
        responsibilities: [
          'Write and maintain automated test scripts using Selenium and Cypress.',
          'Perform API testing using Postman and REST Assured.',
          'Identify, document, and track bugs through resolution in JIRA.',
          'Collaborate with developers on testability improvements.'
        ],
        skills: ['Selenium', 'Cypress', 'Postman', 'JIRA', 'SQL', 'API Testing'],
        benefits: ['Health Insurance', 'Flexible Timings', 'Certification Support']
      }
    ]
  },
  'bluepoint': {
    id: 'bluepoint',
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
    about: 'Bluepoint Digital is a design agency that transforms how brands interact with customers. We specialize in graphic design, packaging, user experience layouts, and cinematic digital storytelling. From brand identity systems to immersive web experiences, our studio brings ideas to life with pixel-perfect precision.',
    mission: 'To deliver aesthetic excellence that communicates core message instantly.',
    vision: 'To set visual standards for web product designs globally.',
    mvv: [
      { icon: '🎨', label: 'Artistry', desc: 'Crafting pixel-perfect assets and high-end layouts that captivate audiences.' },
      { icon: '💡', label: 'Innovation', desc: 'Pushing creative boundaries with experimental design thinking and bold visual storytelling.' },
      { icon: '🤝', label: 'Collaboration', desc: 'Working hand-in-hand with clients to translate their vision into unforgettable brand experiences.' }
    ],
    coreValues: ['Creative Integrity', 'Visual Harmony', 'Customer Insight', 'Bold Expression', 'Attention to Detail'],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80', label: 'Studio Room' },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=400&q=80', label: 'Design Wall' },
      { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80', label: 'Creative Workshop' },
      { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80', label: 'Client Presentation' }
    ],
    benefits: [
      { icon: '🍕', label: 'Free Snacks & Drinks' },
      { icon: '⏰', label: 'Flexi Hours' },
      { icon: '🎨', label: 'Creative Tools Allowance' },
      { icon: '🌴', label: 'Paid Creative Leaves' },
      { icon: '📱', label: 'Latest Design Software' },
      { icon: '🏆', label: 'Portfolio Showcases' }
    ],
    stats: [
      { label: 'Hires Made', val: '22', target: 22 },
      { label: 'Jobs Posted', val: '2', target: 2 },
      { label: 'Hiring Rate', val: '91%', target: 91 },
      { label: 'Followers', val: '4K', target: 4000 }
    ],
    rating: { score: '4.4', total: '19 Reviews', bars: [60, 25, 10, 5, 0] },
    reviews: [
      { author: 'Karan J.', role: 'Visual Designer', stars: '★★★★★', date: 'Feb 2026', text: 'Highly collaborative design-driven workspace. Relaxed culture but expects top quality.' },
      { author: 'Tanya M.', role: 'UI/UX Designer', stars: '★★★★★', date: 'Apr 2026', text: 'Every project here is a chance to push creative boundaries. The team treats design as a craft, not just a service.' },
      { author: 'Rohit A.', role: 'Motion Designer', stars: '★★★★☆', date: 'May 2026', text: 'Fantastic creative energy and access to top-tier design tools. Client projects are diverse and always challenging.' },
      { author: 'Divya S.', role: 'Brand Strategist', stars: '★★★★★', date: 'Jun 2026', text: 'The leadership genuinely cares about design quality over speed. Rare to find an agency that respects the creative process this much.' }
    ],
    socials: [
      { label: 'Instagram', icon: 'IG', url: '#' },
      { label: 'Dribbble', icon: 'DR', url: '#' },
      { label: 'Behance', icon: 'BE', url: '#' }
    ],
    jobs: [
      {
        id: 'ui-designer-bluepoint',
        title: 'UI/UX Designer',
        exp: '1–3 Years',
        sal: '₹18,000–30,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: 'June 25, 2026',
        applyBefore: 'July 15, 2026',
        description: 'Design intuitive and visually compelling user interfaces for web and mobile products. You will create wireframes, interactive prototypes, and polished UI kits that align with client brand guidelines.',
        responsibilities: [
          'Create wireframes, user flows, and high-fidelity mockups in Figma.',
          'Design responsive layouts for web and mobile platforms.',
          'Conduct usability testing and iterate based on user feedback.',
          'Maintain and evolve design system component libraries.'
        ],
        skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping', 'Design Systems'],
        benefits: ['Creative Tools Budget', 'Flexible Hours', 'Portfolio Exposure', 'Team Outings']
      },
      {
        id: 'content-writer-bluepoint',
        title: 'Content Writer',
        exp: '0–2 Years',
        sal: '₹12,000–20,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: 'June 23, 2026',
        applyBefore: 'July 12, 2026',
        description: 'Craft compelling brand copy, website content, social media captions, and marketing collateral. You will work closely with designers and strategists to ensure every word reinforces the brand voice.',
        responsibilities: [
          'Write website copy, blog posts, and landing page content.',
          'Create social media captions and email marketing copy.',
          'Collaborate with designers on taglines and brand messaging.',
          'Proofread and edit content for grammar, tone, and consistency.'
        ],
        skills: ['Copywriting', 'SEO Writing', 'Brand Voice', 'Content Strategy', 'Proofreading'],
        benefits: ['Creative Workspace', 'Flexible Timings', 'Learning Budget']
      }
    ]
  },
  'vertex': {
    id: 'vertex',
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
    about: 'Vertex Outsourcing provides reliable back-office solutions, customer care, technical troubleshooting, and lead generation outsourcing services to Fortune 500 corporations globally. With over a decade of operational excellence, we manage high-volume voice and non-voice processes across multiple industry verticals.',
    mission: 'To scale client business operations with efficient and secure customer touchpoints.',
    vision: 'To be the most efficient customer support center in Eastern India.',
    mvv: [
      { icon: '📞', label: 'Care', desc: 'Answering customer tickets with empathy and speed to deliver outstanding experiences.' },
      { icon: '📊', label: 'Efficiency', desc: 'Optimizing every process through data-driven decision making and continuous improvement.' },
      { icon: '🔒', label: 'Trust', desc: 'Maintaining the highest standards of data security and client confidentiality.' }
    ],
    coreValues: ['Operational Discipline', 'Data Safety', 'Customer Satisfaction', 'Employee Support', 'Process Excellence'],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80', label: 'Call Floor' },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80', label: 'Training Room' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80', label: 'Break Area' },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80', label: 'Management Suite' }
    ],
    benefits: [
      { icon: '🏥', label: 'ESI & PF Cover' },
      { icon: '🚌', label: 'Shuttle Service' },
      { icon: '🍽️', label: 'Subsidized Meals' },
      { icon: '📈', label: 'Performance Incentives' },
      { icon: '🎓', label: 'Skill Development Programs' },
      { icon: '🎉', label: 'Festival Celebrations' }
    ],
    stats: [
      { label: 'Hires Made', val: '400+', target: 400 },
      { label: 'Jobs Posted', val: '3', target: 3 },
      { label: 'Hiring Rate', val: '80%', target: 80 },
      { label: 'Followers', val: '9K', target: 9000 }
    ],
    rating: { score: '3.8', total: '290 Reviews', bars: [40, 20, 20, 10, 10] },
    reviews: [
      { author: 'Deepak N.', role: 'Team Lead', stars: '★★★☆☆', date: 'March 2026', text: 'Good starting point for career. Shift timings can be challenging but good incentive policies.' },
      { author: 'Sunita R.', role: 'Customer Support', stars: '★★★★☆', date: 'Jan 2026', text: 'Steady work with regular shifts. The incentive structure rewards consistency and customer satisfaction scores.' },
      { author: 'Manoj K.', role: 'Process Associate', stars: '★★★☆☆', date: 'Apr 2026', text: 'Large organization with structured training programs. Growth depends on performance metrics and tenure.' },
      { author: 'Priyanka H.', role: 'Quality Analyst', stars: '★★★★☆', date: 'May 2026', text: 'Good exposure to quality frameworks and process improvement. The QA team is supportive and well-organized.' }
    ],
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'Facebook', icon: 'FB', url: '#' },
      { label: 'Twitter / X', icon: 'X', url: '#' }
    ],
    jobs: [
      {
        id: 'customer-support-vertex',
        title: 'Customer Support Executive',
        exp: '0–2 Years',
        sal: '₹10,000–16,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: true,
        postedDate: 'June 26, 2026',
        applyBefore: 'July 18, 2026',
        description: 'Handle inbound customer queries via voice and chat channels. You will resolve issues, process requests, and maintain high customer satisfaction scores in a fast-paced BPO environment.',
        responsibilities: [
          'Answer inbound customer calls and resolve queries within first contact.',
          'Document customer interactions accurately in the CRM system.',
          'Follow escalation procedures for complex technical issues.',
          'Meet daily KPIs for call handling time and customer satisfaction.'
        ],
        skills: ['Communication Skills', 'Customer Handling', 'CRM Tools', 'Problem Solving', 'Typing Speed'],
        benefits: ['ESI & PF', 'Performance Incentives', 'Free Transport', 'Meal Subsidy']
      },
      {
        id: 'quality-analyst-vertex',
        title: 'Quality Analyst',
        exp: '2–4 Years',
        sal: '₹20,000–30,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: 'June 24, 2026',
        applyBefore: 'July 15, 2026',
        description: 'Monitor and evaluate customer interactions to ensure service quality standards are met. You will conduct call audits, prepare quality reports, and coach agents on improvement areas.',
        responsibilities: [
          'Audit recorded calls and chat transcripts against quality rubrics.',
          'Prepare weekly quality scorecards and trend analysis reports.',
          'Conduct calibration sessions with team leads and trainers.',
          'Identify recurring errors and recommend process improvements.'
        ],
        skills: ['Quality Monitoring', 'Call Auditing', 'MS Excel', 'Analytical Skills', 'Coaching'],
        benefits: ['Health Insurance', 'Performance Bonuses', 'Shift Allowances']
      },
      {
        id: 'team-lead-vertex',
        title: 'Process Team Lead',
        exp: '4–6 Years',
        sal: '₹30,000–45,000 / mo',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: 'June 22, 2026',
        applyBefore: 'July 12, 2026',
        description: 'Lead a team of 15–20 customer support agents, manage daily operations, and drive performance improvement. You will handle escalations, conduct one-on-ones, and report to the operations manager.',
        responsibilities: [
          'Manage team scheduling, attendance, and shift assignments.',
          'Conduct daily huddles and weekly performance reviews.',
          'Handle escalated customer issues and complex complaints.',
          'Collaborate with quality and training teams on improvement initiatives.'
        ],
        skills: ['Team Management', 'Conflict Resolution', 'KPI Tracking', 'MS Excel', 'Leadership'],
        benefits: ['Health Insurance', 'Leadership Training', 'Performance Bonuses', 'Annual Retreats']
      }
    ]
  },
  'coastline': {
    id: 'coastline',
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
    about: 'Coastline Tech provides AWS, Azure, and Google Cloud hosting optimization, DevOps script structures, containerization, and data pipeline maintenance services. We help startups and mid-size companies build reliable, scalable cloud infrastructure without the overhead of a full in-house DevOps team.',
    mission: 'To minimize cloud infrastructure waste and automate pipeline deployments.',
    vision: 'To build zero-downtime server setups for server installations.',
    mvv: [
      { icon: '☁️', label: 'Cloud', desc: 'Deploying servers with security and elastic scaling for modern workloads.' },
      { icon: '⚙️', label: 'Automation', desc: 'Eliminating manual toil through Infrastructure as Code and CI/CD pipelines.' },
      { icon: '🛡️', label: 'Reliability', desc: 'Building fault-tolerant systems with monitoring, alerting, and rapid incident response.' }
    ],
    coreValues: ['Automation Always', 'Elastic Resource Scaling', 'Strict Firewall Security', 'Documentation First'],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80', label: 'DevOps Room' },
      { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80', label: 'Server Lab' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80', label: 'Team Huddle' },
      { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80', label: 'Cloud Dashboard' }
    ],
    benefits: [
      { icon: '💻', label: 'Cloud Credits for Learning' },
      { icon: '⏰', label: 'Remote-First Culture' },
      { icon: '📚', label: 'AWS/Azure Certification Sponsorship' },
      { icon: '🌴', label: 'Unlimited PTO Policy' },
      { icon: '🖥️', label: 'Home Office Stipend' }
    ],
    stats: [
      { label: 'Hires Made', val: '18', target: 18 },
      { label: 'Jobs Posted', val: '2', target: 2 },
      { label: 'Hiring Rate', val: '89%', target: 89 },
      { label: 'Followers', val: '2K', target: 2000 }
    ],
    rating: { score: '4.3', total: '14 Reviews', bars: [60, 20, 10, 10, 0] },
    reviews: [
      { author: 'Aman S.', role: 'Cloud Engineer', stars: '★★★★☆', date: 'April 2026', text: 'Highly technical work environment. Learned a lot about Kubernetes deployment standards.' },
      { author: 'Kriti P.', role: 'DevOps Intern', stars: '★★★★★', date: 'May 2026', text: 'Best place to learn cloud infrastructure hands-on. The mentors explain concepts clearly and give real project exposure from day one.' },
      { author: 'Tarun J.', role: 'SRE Engineer', stars: '★★★★☆', date: 'June 2026', text: 'Great for anyone passionate about automation and reliability engineering. Small team means you own your systems end to end.' },
      { author: 'Nandini R.', role: 'Platform Engineer', stars: '★★★★★', date: 'Mar 2026', text: 'Remote-first culture with excellent documentation practices. Every deployment is automated and every incident is a learning opportunity.' }
    ],
    socials: [
      { label: 'LinkedIn', icon: 'IN', url: '#' },
      { label: 'GitHub', icon: 'GH', url: '#' },
      { label: 'Twitter / X', icon: 'X', url: '#' }
    ],
    jobs: [
      {
        id: 'devops-engineer-coastline',
        title: 'DevOps Engineer',
        exp: '2–4 Years',
        sal: '₹8,00,000–14,00,000 / yr',
        type: 'Full-Time',
        location: 'Remote',
        fresher: false,
        postedDate: 'June 25, 2026',
        applyBefore: 'July 18, 2026',
        description: 'Build and maintain CI/CD pipelines, manage cloud infrastructure on AWS/Azure, and automate deployment workflows. You will work with containerized applications and ensure high availability across production environments.',
        responsibilities: [
          'Design and manage CI/CD pipelines using GitHub Actions and Jenkins.',
          'Provision and manage cloud infrastructure using Terraform.',
          'Monitor production systems using Prometheus and Grafana.',
          'Optimize container orchestration on Kubernetes clusters.'
        ],
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'CI/CD'],
        benefits: ['Remote-First', 'Cloud Certification Budget', 'Unlimited PTO', 'Home Office Stipend']
      },
      {
        id: 'cloud-admin-coastline',
        title: 'Cloud Administrator',
        exp: '1–3 Years',
        sal: '₹5,00,000–9,00,000 / yr',
        type: 'Full-Time',
        location: 'Bhubaneswar, Odisha',
        fresher: false,
        postedDate: 'June 23, 2026',
        applyBefore: 'July 15, 2026',
        description: 'Manage and optimize cloud hosting environments across AWS and Azure. You will handle server provisioning, backup management, security hardening, and cost optimization for client infrastructure.',
        responsibilities: [
          'Provision and configure EC2, RDS, and S3 resources on AWS.',
          'Manage Azure virtual machines, storage accounts, and networking.',
          'Implement backup strategies and disaster recovery procedures.',
          'Monitor cloud spend and recommend cost optimization measures.'
        ],
        skills: ['AWS', 'Azure', 'Linux', 'Networking', 'Shell Scripting', 'Backup Management'],
        benefits: ['Health Insurance', 'Certification Sponsorship', 'Flexible Hours']
      }
    ]
  }
};
