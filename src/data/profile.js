/**
 * ─────────────────────────────────────────────────────────────
 *  ALL personal content for the site lives in this file.
 *  Edit text here; components read from it automatically.
 *  Icons are referenced by name (see src/components/icons.js).
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Rupesh Singh',
  initials: 'RS',
  title: 'Azure Cloud Engineer (L2)',
  location: 'Kolkata, India',
  tagline:
    'I design, secure and keep Azure networks running for enterprise workloads, and build automation and GenAI tools along the way.',
  email: 'rupeshsingh3787@gmail.com',
  // Shown as a second option in the Contact section. Remove to hide it.
  altEmail: 'rupeshsingh1345@gmail.com',

  // Files placed in /public. Use the exact file names.
  photo: {
    src: 'photo.jpg',
    alt: 'Portrait of Rupesh Singh',
  },
  resume: {
    src: 'Rupesh Singh.pdf',
    downloadAs: 'Rupesh-Singh-Resume.pdf',
  },

  social: [
    { label: 'GitHub', href: 'https://github.com/rupucoding', icon: 'github' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/therupeshsingh', icon: 'linkedin' },
    { label: 'LeetCode', href: 'https://leetcode.com/u/TbmSXPvqkt/', icon: 'leetcode' },
    {
      label: 'GeeksforGeeks',
      href: 'https://www.geeksforgeeks.org/user/rupeshsingh1345/',
      icon: 'gfg',
    },
    { label: 'Email', href: 'mailto:rupeshsingh3787@gmail.com', icon: 'mail' },
  ],

  // Visitor counts with GoatCounter (free, no cookies). Sign up at goatcounter.com,
  // then put your site code here, e.g. 'rupucoding' for rupucoding.goatcounter.com.
  // Empty = off. Only live builds count; `npm run dev` never does.
  analytics: {
    goatcounter: '',
  },

  // Used for SEO tags, Open Graph and the sitemap.
  site: {
    origin: 'https://rupucoding.github.io',
    description:
      'Rupesh Singh, L2 Azure Cloud Engineer in Kolkata. Azure networking, security and reliability for enterprise workloads, plus Python automation and GenAI tools.',
    keywords: [
      'Azure Cloud Engineer',
      'Azure networking',
      'Application Gateway',
      'NSG',
      'Private Endpoints',
      'Key Vault',
      'GenAI',
      'Python',
      'Kolkata',
    ],
  },

  about: {
    paragraphs: [
      "I'm an L2 Azure Cloud Engineer at Tata Consultancy Services, where I've spent the last two years on the front line of enterprise cloud infrastructure. I started as a network engineer handling 24/7 production support, and moved into Azure engineering, where I now work across VNets, NSGs, Application Gateway, Key Vault, Private Endpoints and Linux proxy infrastructure for a large enterprise client.",
      'I care about two things: keeping systems reliable (99.9% SLA, under-5-minute detection) and automating away repetitive work. Outside of tickets and change requests, I build tools in Python and GenAI, from an NSG rule automation tool to a multi-module GenAI optimization platform.',
      "I'm always learning, currently going deeper into DSA, system design and multi-cloud.",
    ],
    stats: [
      { value: '2+', label: 'Years in enterprise cloud & network operations' },
      { value: '1,000+', label: 'Production incidents resolved' },
      { value: '99.9%', label: 'SLA compliance' },
      { value: '35%', label: 'MTTR reduced on critical issues' },
    ],
  },

  experience: [
    {
      role: 'Azure Cloud Engineer (L2)',
      company: 'Tata Consultancy Services',
      location: 'Kolkata',
      period: 'Aug 2024 – Present',
      current: true,
      progression: [
        {
          title: 'System Engineer',
          subtitle: 'Azure Cloud Engineer (L2)',
          period: 'Aug 2024 – Present',
        },
      ],
      // Wrap a skill in **double asterisks** to highlight it.
      highlights: [
        'Resolved **1,000+ production incidents** for an enterprise client as part of an **L2 team** under **24/7 rotational support**, maintaining **99.9% SLA** compliance',
        'Kept mean time to detect **under 5 minutes** and cut **MTTR by 35%** for critical issues using **Azure Monitor**, **Splunk** and **Nagios XI**',
        'Manage **Azure networking** end to end: **VNets**, peering, **NSGs** and **Private Endpoints**',
        'Operate **Application Gateway with WAF**, listeners, routing rules and health probes; handle the **SSL certificate** lifecycle through **Key Vault**',
        'Control outbound access by **whitelisting external URLs** on **Squid proxy (Linux)** and **Azure Firewall** through **GitHub Actions** pipelines',
        'Diagnose connectivity issues with **Network Watcher** (IP Flow Verify, Connection Troubleshoot)',
        'Maintained network connectivity across **100+ sites** through the **Cisco Meraki** dashboard, troubleshooting **Cisco Catalyst** switches, routers and access points down to the physical layer; helped **migrate legacy Cisco APs to Meraki**',
        'Assisted **Azure Site Recovery (ASR)** activities for **disaster-recovery** readiness',
        'Track incidents and RFCs in **ServiceNow**; secure privileged access with **CyberArk** and **Azure Bastion**',
      ],
      stack: [
        'Azure Networking',
        'Application Gateway',
        'Azure Firewall',
        'Key Vault',
        'Network Watcher',
        'ASR',
        'Azure Monitor',
        'Splunk',
        'Nagios XI',
        'Cisco Meraki',
        'Cisco Catalyst',
        'ServiceNow',
        'CyberArk',
        'Squid on Linux',
        'GitHub Actions',
      ],
    },
  ],

  skills: [
    {
      title: 'Azure Cloud',
      icon: 'cloud',
      items: [
        'VNets',
        'VNet Peering',
        'NSGs & ASGs',
        'Application Gateway + WAF',
        'Azure Load Balancer',
        'Key Vault',
        'Private Endpoints & Private DNS',
        'Route Tables/UDRs (hub-spoke)',
        'Azure Bastion',
        'Network Watcher',
        'Azure Monitor',
        'Storage networking',
        'AKS (fundamentals)',
        'Proxies (Squid on Linux)',
        'URL whitelisting',
      ],
    },
    {
      title: 'Networking',
      icon: 'network',
      items: [
        'OSI & TCP/IP',
        'CIDR/subnetting',
        'DNS',
        'Troubleshooting (netstat, tracert, pathping)',
      ],
      // Optional labelled groups shown under the main items.
      subgroups: [
        {
          title: 'Cisco devices',
          items: [
            'Cisco Meraki',
            'Cisco Prime',
            'Cisco WLC',
            'Cisco Switches',
            'Legacy Cisco Switches (Classic)',
            'Legacy Cisco APs (Aironet)',
          ],
        },
      ],
    },
    {
      title: 'Monitoring, Security & ITSM',
      icon: 'shield',
      items: [
        'Splunk',
        'Nagios XI',
        'Azure Monitor',
        'CyberArk',
        'ServiceNow (Incident & Change/RFC)',
      ],
    },
    {
      title: 'Programming & Dev',
      icon: 'code',
      items: [
        'Python',
        'C++ (DSA)',
        'JavaScript',
        'React',
        'Git/GitHub',
        'GitHub Actions',
        'DevOps pipelines',
      ],
    },
    {
      title: 'AI / GenAI',
      icon: 'sparkles',
      items: [
        'RAG',
        'LLM routing & optimization',
        'Prompt engineering',
        'Claude',
        'GitHub Copilot',
      ],
    },
    {
      title: 'Professional',
      icon: 'users',
      items: [
        '24/7 on-call operations',
        'SLA management',
        'Incident communication',
        'Stakeholder updates',
        'WSR (weekly status reports)',
        'Documentation',
      ],
    },
  ],

  // Short keywords that drift faintly behind the hero. Keep each one brief.
  heroKeywords: [
    'Azure',
    'VNets',
    'NSG & ASG',
    'Application Gateway',
    'WAF',
    'Key Vault',
    'Private Endpoints',
    'Private DNS',
    'Hub-Spoke',
    'UDRs',
    'Load Balancer',
    'Bastion',
    'Network Watcher',
    'Azure Monitor',
    'AKS',
    'TCP/IP',
    'DNS',
    'Subnetting',
    'Squid Proxy',
    'Linux',
    'Splunk',
    'Nagios XI',
    'CyberArk',
    'ServiceNow',
    'Python',
    'C++',
    'JavaScript',
    'React',
    'Git',
    'GitHub Actions',
    'DevOps',
    'RAG',
    'GenAI',
    'LLM Ops',
    'Prompt Engineering',
  ],

  projects: {
    // Shown in the slider. Add `github: 'https://github.com/...'` to show a "View on GitHub" button.
    // visual: 'pipeline' | 'rules' | 'forecast' picks the illustration on the card.
    featured: [
      {
        title: 'GenAI Optimization Platform',
        description:
          'A modular platform that sits between apps and LLMs, built as seven modules from the gateway through to analytics. Uses TCS GenAI Lab as the LLM provider.',
        modules: [
          'Gateway',
          'Optimizer',
          'Router',
          'RAG',
          'Validator',
          'Governance Optimizer',
          'Analytics',
        ],
        provider: 'TCS GenAI Lab',
        tags: ['Python', 'GenAI', 'RAG', 'LLM Ops'],
        visual: 'pipeline',
      },
      {
        title: 'NSG Rule Automation Tool',
        description:
          'Python tool that automates creating, validating and auditing Azure NSG rules, reducing manual errors in change requests.',
        tags: ['Python', 'Azure', 'Automation'],
        visual: 'rules',
      },
      {
        title: 'AI Retail Demand Forecast Assistant',
        description:
          'Built for TCS AI Fridays Season 2, where it made the Top 7 Regional Finalists. Forecasts store-level demand to help with inventory planning.',
        badge: 'Top 7 Regional Finalist',
        tags: ['Python', 'ML', 'Forecasting', 'GenAI'],
        visual: 'forecast',
      },
    ],
    // Smaller grid below the slider. Add `link` for a live URL, `github` for a repo.
    other: [
      {
        title: 'This Portfolio',
        description:
          'React + Vite site with LeetCode stats fetched at build time, a daily scheduled GitHub Actions deploy, a Markdown blog and learning log, and generated SEO pages.',
        tags: ['React', 'Vite', 'GitHub Actions'],
        link: 'https://rupucoding.github.io/portFolio/',
        github: 'https://github.com/rupucoding/portFolio',
      },
      {
        title: 'NOC Dashboard',
        description: 'Monitoring dashboard for network operations.',
        tags: ['Monitoring', 'Dashboard'],
      },
      {
        title: 'File Scanner App',
        description: 'A utility app for scanning files.',
        tags: [],
      },
      {
        title: 'PNR Status Checker',
        description: 'Checks the booking status of an Indian Railways PNR.',
        tags: [],
      },
      {
        title: 'Progress Calculator',
        description: 'A web-based progress calculator, live on GitHub Pages.',
        tags: ['Web'],
        link: 'https://rupucoding.github.io',
      },
      {
        title: 'AI DSA Tutor',
        description: 'React + FastAPI + RAG tutor for DSA practice.',
        tags: ['React', 'FastAPI', 'RAG'],
        status: 'In progress',
      },
    ],
  },

  certifications: [
    {
      name: 'Claude Certified Developer – Foundations',
      issuer: 'Anthropic',
      date: 'Aug 2026',
    },
    {
      name: 'Microsoft Certified: GitHub Copilot',
      issuer: 'Microsoft',
      date: 'Aug 2026',
    },
    {
      name: 'Generative AI certification',
    },
    {
      name: 'Infrastructure and Data Security training',
    },
  ],

  achievements: [
    {
      title: 'TCS AI Fridays Season 2',
      detail: 'Top 7 Regional Finalist',
    },
  ],

  education: [
    {
      degree: 'B.Tech, Electronics and Communication Engineering',
      school: 'Meghnad Saha Institute of Technology',
      location: 'Kolkata',
      period: '2020 – 2024',
      grade: 'CGPA 8.46',
      coursework: [
        'Data Structures & Algorithms',
        'Computer Networks',
        'Operating Systems',
        'Design & Analysis of Algorithms',
      ],
    },
  ],

  // Section headings shown on the page.
  headings: {
    about: 'Reliability first, automation always',
    experience: "Where I've been working",
    skills: 'What I work with',
    projects: "Things I've built",
    certifications: 'Credentials and recognition',
    education: 'Foundations',
    blog: 'Notes from the field',
    learning: 'DSA practice, one problem at a time',
  },

  blog: {
    intro:
      'Practical notes on Azure networking, operations and automation, written up after working through the problem.',
    // The news timeline below the posts (stories live in src/data/timeline.js).
    timelineHeading: 'Cloud news timeline',
    timelineIntro:
      'The cloud and networking stories I followed each month: launches, outages and investments, with a short note on why each one matters to an engineer running production on Azure. Dated when they happened; every card links to the original source.',
  },

  // The learning log: one Markdown file per day in src/content/learning (see README).
  learning: {
    intro:
      'I work through data structures, algorithms and system design every day and write down what I learned: the problems I solved, the idea that made each one click, and where I got stuck.',
  },

  contact: {
    heading: "Let's talk",
    blurb:
      'Open to conversations about Azure networking, cloud operations and GenAI tooling. Email is the fastest way to reach me.',
  },
}

export default profile
