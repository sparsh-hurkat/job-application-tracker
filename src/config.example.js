// Configuration file - COPY THIS TO config.js AND FILL IN YOUR VALUES
// DO NOT COMMIT config.js TO GIT - it contains sensitive API keys

export const config = {
  coverLetterTemplate: `**Dear Hiring Manager,**

I am excited to apply for the Software Engineer Intern role at [Company Name]. I am currently pursuing a Master of Information Systems Management at Carnegie Mellon University and bring over three years of industry experience as a full-stack software engineer at MoneyView, where I built scalable, high-performance systems used by millions of users.

At MoneyView, I contributed across the stack, designing and optimizing backend services, cloud infrastructure, and frontend systems. I reduced backend API latency by 15% through Node.js and MongoDB optimizations, improved user registration workflows by 5 minutes using AWS Lambda and DynamoDB, and enhanced system reliability with automated workflows and caching strategies. I also led the delivery of a full-stack partner platform from concept to production, enabling vendor transaction management and generating ~$1.5M in first-year revenue, and built real-time WebSocket-based systems that quadrupled verification throughput.

Beyond production systems, I have built modular, scalable architectures for complex workflows, such as my Job Application Agent, where I designed a microservice-based system for parsing, retrieval, and evaluation. I am also doing advanced cloud engineering projects at CMU, including building a Java-based auto-scaling controller on AWS and a multi-threaded key-value store with strong consistency guarantees, demonstrating my experience with distributed systems and high-throughput backends.

I am particularly drawn to [Company Name] because of [specific product, mission, tech stack, or engineering challenge], and I would be excited to contribute my experience building reliable, scalable, and maintainable systems to your engineering team.

Thank you for your time and consideration. I look forward to the opportunity to discuss how my experience aligns with your team's goals.

Sincerely,
Sparsh Hurkat
`,

  resume: `Sparsh Hurkat
sparsh@cmu.edu
(412) 641-9624
sparshhurkat.vercel.app
linkedin.com/in/sparsh-hurkat

EDUCATION

Carnegie Mellon University, Pittsburgh, PA	August 2025 - December 2026 (Expected)
Master of Information Systems Management	GPA: 3.3/4
Coursework: Cloud Computing, Object-Oriented Programming in Java, Database Management, Distributed Systems
Vellore Institute of Technology, Vellore, India	May 2022
Bachelor of Technology in Electronics & Communication Engineering	GPA: 3.74/4
Coursework: Data Structures & Algorithms, Problem Solving & OOP, Foundation to Programming, ML Fundamentals
SKILLS

Languages & Databases: Python, Java, Typescript, JavaScript, SQL, MongoDB, DynamoDB, Redis
Cloud, DevOps & Tools: AWS, SST, Azure, Docker, Kubernetes, Jenkins, CI/CD, Kafka, Linux, Git, Jest, RAG pipelines
Frameworks & Full-Stack Development: Spring, Node.js, React.js, Next.js, React-Native, Hibernate, LangChain, REST APIs

EXPERIENCE

MoneyView (Fintech), Bangalore, India	March 2022 - July 2025
Software Engineer 2
Cut average user registration time by 5 minutes by optimizing a serverless onboarding microservice (SST, AWS Lambda, DynamoDB) with improved query patterns, targeted caching, and streamlined API workflows using TypeScript
Reduced p95 latency by 10% through optimizations to the service layer (Node.js/MongoDB); Built reusable CMS-driven page components and migrated the main platform to Next.js, improving Lighthouse score, maintainability and scalability
Mentored 2 interns on JavaScript fundamentals, Object-Oriented development with Java Spring Boot, and Agile practices
Software Engineer 1
Increased verification throughput 4x by leading the development of a real-time video verification platform using WebSockets, Amazon Chime, and Java microservices; implemented OCR-based document parsing, Google SSO auth, and scalable agent–customer routing to replace a third-party vendor and cut operational cost
Led frontend development of a TypeScript/React vendor dashboard with real-time, large-scale data handling (50k+ transactions), enabling fast partner operations and the launch of a new product line that generated $1.5M in first-year revenue
Reduced agent workload by 40% and doubled call-handling capacity by building voice & chat virtual assistants using OpenAI APIs and Langchain, integrating them with Java microservices on AWS ECS and a React-based agent portal
PROJECTS

Distributed Systems & Cloud Engineering	Ongoing
Architected a multi-cloud autoscaling system for a high-traffic e-commerce platform using AWS EC2, Terraform, and GitHub Actions; designing load balancing strategies to sustain 10x traffic bursts while optimizing for cloud cost efficiency
Recreated the WeChat Spring-based microservice architecture by containerizing chat services with Docker and deploying them on Kubernetes using Helm, enabling autoscaling, failure handling, and CI/CD automation
RAG Product Visualization System	December 2025
Improved visual attribute-accuracy by 40% by engineering a multi-agent RAG + diffusion workflow, integrating FAISS retrieval, dynamic-k heuristics, and LLM-driven prompt refinement
Cut end-to-end generation time by 3× by automating data ingestion, review-to-prompt translation, and multi-model image synthesis, enabling iterative evaluation and alignment across 50K+ customer reviews
Market Run - Gamified retail shopping journey, 24-hour HackCMU 2025	September 2025
Enhanced user interactivity in a React Native Pac-Man style game by integrating real-time indoor movement data using inbuilt sensors (no GPS) to dynamically update player movement across retail store aisles
HONORS

Recipient, William W. and Ruth F. Cooper Fellowship for demonstrated academic excellence & professional accomplishments
`,

  // Get your Gemini API key from: https://aistudio.google.com/app/apikey
  // Replace the placeholder below with your actual key
  geminiApiKey: 'your-gemini-api-key-here'
};
