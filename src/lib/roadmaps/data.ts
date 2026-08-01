// src/lib/roadmaps/data.ts
// All 6 career roadmaps with real node trees

export interface RoadmapNode {
  id: string
  label: string
  description: string
  skills: string[]          // skills from user profile that unlock this node
  prerequisites: string[]   // node IDs that must be completed first
  resources?: string        // link to learning content
  xp: number
}

export interface Roadmap {
  id: string
  title: string
  emoji: string
  description: string
  color: string
  nodes: RoadmapNode[]
  edges: Array<{ from: string; to: string }>
}

export const ROADMAPS: Roadmap[] = [
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    emoji: '🌐',
    description: 'Build complete web apps from frontend to backend to deployment.',
    color: 'indigo',
    nodes: [
      { id: 'html', label: 'HTML & CSS', description: 'Structure and style web pages.', skills: ['HTML/CSS'], prerequisites: [], xp: 50 },
      { id: 'js', label: 'JavaScript', description: 'Add interactivity and logic to web pages.', skills: ['JavaScript'], prerequisites: ['html'], xp: 100 },
      { id: 'react', label: 'React.js', description: 'Build component-based UI with hooks, state, and JSX.', skills: ['React'], prerequisites: ['js'], xp: 150 },
      { id: 'node', label: 'Node.js', description: 'Run JavaScript on the server, handle HTTP requests.', skills: ['Node.js'], prerequisites: ['js'], xp: 150 },
      { id: 'sql', label: 'SQL & PostgreSQL', description: 'Design relational databases and write queries.', skills: ['SQL', 'PostgreSQL'], prerequisites: ['node'], xp: 100 },
      { id: 'rest', label: 'REST APIs', description: 'Design and build backend APIs for frontend to consume.', skills: ['REST APIs'], prerequisites: ['node', 'sql'], xp: 100 },
      { id: 'nextjs', label: 'Next.js', description: 'Full-stack React framework with SSR, SSG, and API routes.', skills: ['Next.js'], prerequisites: ['react', 'rest'], xp: 200 },
      { id: 'docker', label: 'Docker', description: 'Containerise your app for consistent deployment.', skills: ['Docker'], prerequisites: ['rest'], xp: 150 },
      { id: 'deploy', label: 'Cloud Deployment', description: 'Deploy apps to AWS, GCP, or Vercel with CI/CD.', skills: ['AWS', 'GCP'], prerequisites: ['docker', 'nextjs'], xp: 200 },
    ],
    edges: [
      { from: 'html', to: 'js' }, { from: 'js', to: 'react' }, { from: 'js', to: 'node' },
      { from: 'node', to: 'sql' }, { from: 'node', to: 'rest' }, { from: 'sql', to: 'rest' },
      { from: 'react', to: 'nextjs' }, { from: 'rest', to: 'nextjs' }, { from: 'rest', to: 'docker' },
      { from: 'docker', to: 'deploy' }, { from: 'nextjs', to: 'deploy' },
    ]
  },
  {
    id: 'datascience',
    title: 'Data Scientist',
    emoji: '📊',
    description: 'Extract insights from data using ML, statistics, and visualisation.',
    color: 'purple',
    nodes: [
      { id: 'python', label: 'Python', description: 'Learn Python fundamentals: loops, functions, OOP.', skills: ['Python'], prerequisites: [], xp: 100 },
      { id: 'math', label: 'Math & Statistics', description: 'Linear algebra, probability, and statistical inference.', skills: ['DSA'], prerequisites: [], xp: 100 },
      { id: 'pandas', label: 'Pandas & NumPy', description: 'Data manipulation and numerical computation.', skills: ['Python'], prerequisites: ['python'], xp: 100 },
      { id: 'viz', label: 'Data Visualisation', description: 'Plot and communicate insights using Matplotlib and Seaborn.', skills: ['Python'], prerequisites: ['pandas'], xp: 80 },
      { id: 'sql2', label: 'SQL for Analytics', description: 'Query large datasets, aggregations, and window functions.', skills: ['SQL', 'PostgreSQL'], prerequisites: ['pandas'], xp: 100 },
      { id: 'ml', label: 'Machine Learning', description: 'Supervised, unsupervised learning. Scikit-Learn.', skills: ['Machine Learning'], prerequisites: ['math', 'pandas'], xp: 200 },
      { id: 'dl', label: 'Deep Learning', description: 'Neural networks, CNNs, RNNs using PyTorch or TensorFlow.', skills: ['Deep Learning'], prerequisites: ['ml'], xp: 250 },
      { id: 'nlp', label: 'NLP', description: 'Text classification, embeddings, transformers.', skills: ['NLP'], prerequisites: ['dl'], xp: 250 },
      { id: 'mlops', label: 'MLOps', description: 'Deploy and monitor ML models in production.', skills: ['Docker', 'AWS'], prerequisites: ['ml', 'dl'], xp: 200 },
    ],
    edges: [
      { from: 'python', to: 'pandas' }, { from: 'math', to: 'ml' }, { from: 'pandas', to: 'viz' },
      { from: 'pandas', to: 'sql2' }, { from: 'pandas', to: 'ml' }, { from: 'ml', to: 'dl' },
      { from: 'dl', to: 'nlp' }, { from: 'ml', to: 'mlops' }, { from: 'dl', to: 'mlops' },
    ]
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    emoji: '⚙️',
    description: 'Automate infrastructure, CI/CD, and cloud deployments.',
    color: 'orange',
    nodes: [
      { id: 'linux', label: 'Linux & Shell', description: 'File system, processes, bash scripting, permissions.', skills: ['Linux'], prerequisites: [], xp: 100 },
      { id: 'git2', label: 'Git & Version Control', description: 'Branching, merging, tagging, and collaboration.', skills: ['Git'], prerequisites: [], xp: 50 },
      { id: 'python2', label: 'Python / Go Scripting', description: 'Automation scripts for ops tasks.', skills: ['Python', 'Go'], prerequisites: ['linux'], xp: 100 },
      { id: 'docker2', label: 'Docker', description: 'Build, tag, push, and run containers.', skills: ['Docker'], prerequisites: ['linux'], xp: 150 },
      { id: 'cicd', label: 'CI/CD Pipelines', description: 'GitHub Actions, Jenkins, GitLab CI.', skills: ['Git'], prerequisites: ['docker2', 'git2'], xp: 150 },
      { id: 'k8s', label: 'Kubernetes', description: 'Orchestrate containers at scale with pods, services, deployments.', skills: ['Kubernetes'], prerequisites: ['docker2'], xp: 250 },
      { id: 'aws2', label: 'AWS / GCP / Azure', description: 'EC2, S3, VPC, IAM, managed services.', skills: ['AWS', 'GCP', 'Azure'], prerequisites: ['linux', 'git2'], xp: 200 },
      { id: 'monitoring', label: 'Monitoring & Observability', description: 'Prometheus, Grafana, logging, alerting.', skills: [], prerequisites: ['k8s', 'aws2'], xp: 150 },
    ],
    edges: [
      { from: 'linux', to: 'python2' }, { from: 'linux', to: 'docker2' }, { from: 'git2', to: 'cicd' },
      { from: 'docker2', to: 'cicd' }, { from: 'docker2', to: 'k8s' }, { from: 'linux', to: 'aws2' },
      { from: 'git2', to: 'aws2' }, { from: 'k8s', to: 'monitoring' }, { from: 'aws2', to: 'monitoring' },
    ]
  },
  {
    id: 'android',
    title: 'Android Developer',
    emoji: '📱',
    description: 'Build native Android apps with Kotlin and Jetpack Compose.',
    color: 'green',
    nodes: [
      { id: 'java2', label: 'Java / Kotlin', description: 'OOP basics, classes, inheritance, exceptions.', skills: ['Java'], prerequisites: [], xp: 100 },
      { id: 'android_basics', label: 'Android Studio Basics', description: 'Project structure, AVD, Gradle, and layouts.', skills: [], prerequisites: ['java2'], xp: 100 },
      { id: 'compose', label: 'Jetpack Compose', description: 'Declarative UI toolkit for Android.', skills: [], prerequisites: ['android_basics'], xp: 150 },
      { id: 'mvvm', label: 'MVVM Architecture', description: 'ViewModel, LiveData, StateFlow, Repository pattern.', skills: [], prerequisites: ['compose'], xp: 150 },
      { id: 'retrofit', label: 'Retrofit & APIs', description: 'Consume REST APIs from Android apps.', skills: ['REST APIs'], prerequisites: ['mvvm'], xp: 100 },
      { id: 'room', label: 'Room Database', description: 'Local SQLite persistence with Room ORM.', skills: ['SQL'], prerequisites: ['mvvm'], xp: 100 },
      { id: 'playstore', label: 'Publishing to Play Store', description: 'Signing, versioning, and releasing an APK/AAB.', skills: [], prerequisites: ['retrofit', 'room'], xp: 100 },
    ],
    edges: [
      { from: 'java2', to: 'android_basics' }, { from: 'android_basics', to: 'compose' },
      { from: 'compose', to: 'mvvm' }, { from: 'mvvm', to: 'retrofit' }, { from: 'mvvm', to: 'room' },
      { from: 'retrofit', to: 'playstore' }, { from: 'room', to: 'playstore' },
    ]
  },
  {
    id: 'ml_engineer',
    title: 'ML Engineer',
    emoji: '🤖',
    description: 'Design, train, and deploy ML models at production scale.',
    color: 'pink',
    nodes: [
      { id: 'ml_python', label: 'Python & Math', description: 'NumPy, linear algebra, calculus.', skills: ['Python'], prerequisites: [], xp: 100 },
      { id: 'ml_algos', label: 'ML Algorithms', description: 'Regression, classification, clustering, decision trees.', skills: ['Machine Learning'], prerequisites: ['ml_python'], xp: 200 },
      { id: 'feature', label: 'Feature Engineering', description: 'Preprocessing, normalisation, encoding, selection.', skills: ['Machine Learning'], prerequisites: ['ml_algos'], xp: 150 },
      { id: 'pytorch', label: 'PyTorch / TensorFlow', description: 'Build and train neural networks.', skills: ['Deep Learning'], prerequisites: ['ml_algos'], xp: 200 },
      { id: 'cv', label: 'Computer Vision', description: 'CNNs, object detection, image segmentation.', skills: ['Deep Learning'], prerequisites: ['pytorch'], xp: 200 },
      { id: 'nlp2', label: 'NLP & Transformers', description: 'BERT, GPT, HuggingFace transformers.', skills: ['NLP'], prerequisites: ['pytorch'], xp: 250 },
      { id: 'mlops2', label: 'MLOps & Deployment', description: 'FastAPI, Docker, model serving, monitoring.', skills: ['Docker', 'AWS'], prerequisites: ['cv', 'nlp2'], xp: 250 },
    ],
    edges: [
      { from: 'ml_python', to: 'ml_algos' }, { from: 'ml_algos', to: 'feature' },
      { from: 'ml_algos', to: 'pytorch' }, { from: 'pytorch', to: 'cv' }, { from: 'pytorch', to: 'nlp2' },
      { from: 'cv', to: 'mlops2' }, { from: 'nlp2', to: 'mlops2' },
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    emoji: '🔐',
    description: 'Protect systems, networks, and data from attacks.',
    color: 'red',
    nodes: [
      { id: 'network', label: 'Networking Fundamentals', description: 'TCP/IP, DNS, HTTP, OSI model, subnetting.', skills: [], prerequisites: [], xp: 100 },
      { id: 'linux2', label: 'Linux & Command Line', description: 'File permissions, processes, network tools.', skills: ['Linux'], prerequisites: [], xp: 100 },
      { id: 'crypto', label: 'Cryptography', description: 'Symmetric, asymmetric encryption, hashing, PKI.', skills: [], prerequisites: ['network'], xp: 150 },
      { id: 'webvulns', label: 'Web Application Security', description: 'OWASP Top 10: XSS, SQLi, CSRF, IDOR.', skills: [], prerequisites: ['network', 'linux2'], xp: 200 },
      { id: 'pentest', label: 'Penetration Testing', description: 'Kali Linux, Metasploit, Burp Suite, recon.', skills: [], prerequisites: ['webvulns', 'crypto'], xp: 250 },
      { id: 'incident', label: 'Incident Response', description: 'Log analysis, forensics, threat hunting.', skills: [], prerequisites: ['pentest'], xp: 200 },
      { id: 'certs', label: 'Certifications Path', description: 'CompTIA Security+, CEH, OSCP roadmap.', skills: [], prerequisites: ['incident'], xp: 100 },
    ],
    edges: [
      { from: 'network', to: 'crypto' }, { from: 'network', to: 'webvulns' }, { from: 'linux2', to: 'webvulns' },
      { from: 'webvulns', to: 'pentest' }, { from: 'crypto', to: 'pentest' },
      { from: 'pentest', to: 'incident' }, { from: 'incident', to: 'certs' },
    ]
  }
]
