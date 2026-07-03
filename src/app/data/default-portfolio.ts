import { PortfolioData } from '../models/portfolio.model';

export const DEFAULT_PORTFOLIO: PortfolioData = {
  name: 'Seif Eddine Rezgui',
  title: 'Software Engineer & Actuary',
  tagline: 'Building fintech & insurtech platforms where code meets risk.',
  summary:
    'Software Engineer with a dual background in Fintech Engineering and Actuarial Science (M2). ' +
    'Builds and ships full-stack insurance and fintech platforms with FastAPI and Angular, integrates ' +
    'complex third-party APIs, and applies actuarial methods to real-world pricing and risk. Open to ' +
    'roles in InsurTech, Fintech, and banking, locally and internationally.',
  email: 'rezguiseifeddine@gmail.com',
  phone: '+216 52 262 086',
  location: 'Tunis, Tunisia',
  linkedin: 'https://linkedin.com/in/seif-eddine-rezgui',
  github: 'https://github.com/seifeddinerezgui',
  profileImage: 'profile.jpeg',
  stats: [
    { value: '+70%', label: 'Platform performance gain' },
    { value: '1h30', label: 'Saved per project for sales' },
    { value: '2', label: 'Degrees — Fintech & Actuarial' },
    { value: '4+', label: 'Years building software' }
  ],
  experiences: [
    {
      role: 'Software Engineer & Actuary',
      company: 'Brokins SAS',
      location: 'Sousse, Tunisia',
      period: 'Oct 2025 — Present',
      bullets: [
        'Designed and built a full-stack insurance comparison platform with FastAPI (Python) and Angular, integrating APIs from multiple French insurance providers.',
        'Developed an in-platform CRM module and integrated HubSpot and third-party APIs to streamline commercial workflows.',
        'Built a social-media AI manager agent using n8n, Buffer, Airtable, and the Gemini API to automate content creation and publishing.',
        'Improved platform performance by 70%, cutting average processing time per project by 1h30 for sales teams, while bridging actuarial requirements and software to ensure regulatory and pricing accuracy.'
      ]
    },
    {
      role: 'Software Engineer Intern',
      company: 'Brokins SAS',
      location: 'Sousse, Tunisia',
      period: 'Mar 2025 — Sep 2025',
      bullets: [
        'Contributed to the early development of the insurance comparison platform across backend APIs and frontend components.',
        'Collaborated with senior engineers to integrate insurance-provider APIs and implement core business logic.'
      ]
    },
    {
      role: 'Software Engineer Intern',
      company: 'Attijari Leasing',
      location: 'Tunis, Tunisia (Hybrid)',
      period: 'Jun 2024 — Sep 2024',
      bullets: [
        'Built internal software tools for the leasing division, gaining hands-on experience in banking and financial services.',
        'Worked with cross-functional teams to translate business requirements into technical solutions.'
      ]
    },
    {
      role: 'Web Developer Intern',
      company: 'VERMEG — Banking & Insurance Software',
      location: 'Tunis, Tunisia (Hybrid)',
      period: 'Aug 2023 — Sep 2023',
      bullets: [
        'Developed a client-facing web application with Spring Boot (Java) and Angular based on detailed client specifications.',
        'Gained exposure to enterprise-grade banking and insurance software practices.'
      ]
    }
  ],
  projects: [
    {
      name: 'Insurance Comparison Platform',
      description:
        'Full-stack platform comparing offers from multiple French insurance providers in real time. FastAPI backend orchestrating provider APIs, Angular frontend, built-in CRM with HubSpot sync. Cut sales processing time by 1h30 per project.',
      tech: ['FastAPI', 'Angular', 'Python', 'MySQL', 'HubSpot API'],
      featured: true
    },
    {
      name: 'Social-Media AI Manager Agent',
      description:
        'Autonomous agent that plans, generates and publishes social content. Orchestrated with n8n, scheduled through Buffer, content store in Airtable, generation powered by the Gemini API.',
      tech: ['n8n', 'Gemini API', 'Buffer', 'Airtable'],
      featured: true
    },
    {
      name: 'Leasing Division Internal Tools',
      description:
        'Internal software tools for a banking leasing division — workflow digitization and reporting for financial operations at Attijari Leasing.',
      tech: ['Java', 'SQL', 'Excel/VBA']
    },
    {
      name: 'Client Web Application — VERMEG',
      description:
        'Client-facing web application built to detailed enterprise specifications for a banking & insurance software vendor.',
      tech: ['Spring Boot', 'Angular', 'Java']
    }
  ],
  education: [
    {
      degree: "M2 — Master's Degree in Actuarial Science",
      school: "IRA — Institut du Risque et de l'Assurance, Le Mans University",
      location: 'France',
      period: '2023 — 2025',
      details: 'Risk modeling, life & non-life insurance pricing, stochastic models, and financial mathematics.'
    },
    {
      degree: 'Engineering Degree in Fintech',
      school: "ESPRIT — École Supérieure Privée d'Ingénierie et de Technologie",
      location: 'Tunisia',
      period: '2020 — 2025',
      details: 'Financial technology, software engineering, data science, and digital banking systems.'
    }
  ],
  skills: [
    { category: 'Languages', items: ['Python', 'R', 'Java', 'TypeScript', 'SQL (MySQL)', 'VBA'] },
    { category: 'Frameworks', items: ['FastAPI', 'Angular', 'Spring Boot'] },
    { category: 'Actuarial', items: ['Excel (Advanced)', 'VBA', 'MATLAB', 'Prophet'] },
    { category: 'Data & BI', items: ['Power BI', 'Pandas', 'NumPy'] },
    { category: 'Tooling', items: ['Git', 'REST APIs', 'n8n', 'HubSpot CRM', 'Docker', 'Agile / Scrum'] }
  ],
  certifications: [
    'Docker',
    'GitHub Foundations',
    'Advanced Microsoft Excel',
    'Advanced SQL',
    'Cisco Certified Network Associate Security (CCNA Security)'
  ],
  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'French', level: 'B2 — Upper Intermediate' },
    { name: 'English', level: 'B2 — Upper Intermediate' }
  ],
  interests: [
    'Insurance Technology (InsurTech)',
    'Fintech & Digital Banking',
    'Actuarial Modeling',
    'API Architecture',
    'Risk Analysis'
  ]
};
