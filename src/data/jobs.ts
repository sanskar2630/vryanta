export type Category = {
  slug: string;
  name: string;
  blurb: string;
};

export const categories: Category[] = [
  { slug: "teaching", name: "Teaching & Faculty", blurb: "Assistant professor, lecturer and tutor roles" },
  { slug: "research", name: "Research & Fellowships", blurb: "Project fellows, lab assistants, JRF posts" },
  { slug: "it", name: "IT & Software", blurb: "Developer, QA and support openings for freshers" },
  { slug: "data", name: "Data & Analytics", blurb: "Analyst, data entry and reporting roles" },
  { slug: "internships", name: "Internships", blurb: "Paid internships that convert to full-time" },
  { slug: "admin", name: "Administration", blurb: "Office, library and academic coordination" },
  { slug: "government", name: "Government Exams & Posts", blurb: "Public sector vacancies for graduates" },
  { slug: "part-time", name: "Part-time & Remote", blurb: "Flexible work while you finish studying" },
];

export type Job = {
  id: string;
  title: string;
  company: string;
  category: string;
  location: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  stipend: string;
  qualification: string;
  posted: string;
  featured?: boolean;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const jobs: Job[] = [
  {
    id: "assistant-professor-physics",
    title: "Assistant Professor — Physics",
    company: "Sunrise Institute of Science",
    category: "teaching",
    location: "Pune, Maharashtra",
    type: "Full-time",
    stipend: "₹48,000 – ₹62,000 / month",
    qualification: "M.Sc. Physics + NET/SET preferred",
    posted: "2 days ago",
    featured: true,
    summary:
      "Teach undergraduate physics courses and mentor final-year projects. Fresh postgraduates with strong fundamentals are encouraged to apply.",
    responsibilities: [
      "Deliver 12–14 lecture hours per week",
      "Supervise laboratory sessions and student projects",
      "Contribute to departmental research output",
    ],
    requirements: ["M.Sc. in Physics with 55% or above", "Clear communication in English", "NET/SET is an added advantage"],
  },
  {
    id: "junior-research-fellow",
    title: "Junior Research Fellow — Materials Lab",
    company: "National Centre for Applied Research",
    category: "research",
    location: "Bengaluru, Karnataka",
    type: "Contract",
    stipend: "₹37,000 / month + HRA",
    qualification: "M.Sc. / M.Tech in Chemistry or Materials",
    posted: "4 days ago",
    featured: true,
    summary:
      "Two-year funded fellowship on thin-film characterisation. Ideal for scholars planning a Ph.D. — registration support is provided.",
    responsibilities: [
      "Run sample synthesis and characterisation experiments",
      "Maintain lab records and prepare progress reports",
      "Co-author publications with the principal investigator",
    ],
    requirements: ["Postgraduate degree in a relevant science stream", "Hands-on lab experience", "Valid NET/GATE score"],
  },
  {
    id: "frontend-developer-trainee",
    title: "Frontend Developer Trainee",
    company: "Northwind Systems",
    category: "it",
    location: "Remote (India)",
    type: "Full-time",
    stipend: "₹4.5 – ₹6 LPA",
    qualification: "B.E./B.Tech/BCA/MCA — 2024–2026 batch",
    posted: "1 day ago",
    featured: true,
    summary:
      "A six-month paid training track that converts into a full-time engineering role. No prior work experience required.",
    responsibilities: [
      "Build product screens with React and TypeScript",
      "Fix bugs reported by the QA team",
      "Participate in daily code reviews",
    ],
    requirements: ["Comfort with JavaScript fundamentals", "One personal or academic project", "Willingness to learn on the job"],
  },
  {
    id: "data-analyst-fresher",
    title: "Data Analyst (Fresher)",
    company: "Meridian Retail Group",
    category: "data",
    location: "Hyderabad, Telangana",
    type: "Full-time",
    stipend: "₹3.6 – ₹5 LPA",
    qualification: "Any graduate with statistics coursework",
    posted: "6 days ago",
    summary: "Support the merchandising team with weekly sales dashboards and ad-hoc analysis.",
    responsibilities: ["Prepare weekly performance reports", "Clean and validate store data", "Present findings to category managers"],
    requirements: ["Excel and SQL basics", "Attention to detail", "Good written communication"],
  },
  {
    id: "campus-library-assistant",
    title: "Library & Academic Assistant",
    company: "Greenfield University",
    category: "admin",
    location: "Lucknow, Uttar Pradesh",
    type: "Full-time",
    stipend: "₹22,000 / month",
    qualification: "Graduate; B.Lib. preferred",
    posted: "1 week ago",
    summary: "Manage circulation, digital catalogues and reading-room support for 4,000 students.",
    responsibilities: ["Catalogue new acquisitions", "Assist students with reference queries", "Maintain digital lending records"],
    requirements: ["Basic computer proficiency", "Organised and punctual", "Local candidates preferred"],
  },
  {
    id: "content-research-intern",
    title: "Content & Research Intern",
    company: "Beacon EdTech",
    category: "internships",
    location: "Remote",
    type: "Internship",
    stipend: "₹15,000 / month (6 months)",
    qualification: "Final-year students of any stream",
    posted: "3 days ago",
    summary: "Research and write exam-preparation material with a certificate and pre-placement offer on completion.",
    responsibilities: ["Research syllabus topics", "Draft question banks", "Review peer submissions"],
    requirements: ["Strong writing skills", "15 hours per week availability", "Own laptop and internet"],
  },
  {
    id: "ssc-cgl-assistant",
    title: "Assistant Section Officer (SSC CGL 2026)",
    company: "Staff Selection Commission",
    category: "government",
    location: "Multiple states",
    type: "Full-time",
    stipend: "Pay Level 7 (₹44,900 start)",
    qualification: "Bachelor's degree in any discipline",
    posted: "5 days ago",
    summary: "Central government notification open for graduates under 30. Tier-1 exam scheduled next quarter.",
    responsibilities: ["Handle departmental correspondence", "Maintain official records", "Support senior officers on file work"],
    requirements: ["Graduate in any stream", "Age 18–30 with applicable relaxations", "Complete the online application before the deadline"],
  },
  {
    id: "evening-maths-tutor",
    title: "Evening Mathematics Tutor",
    company: "BrightPath Coaching",
    category: "part-time",
    location: "Jaipur, Rajasthan",
    type: "Part-time",
    stipend: "₹450 / hour",
    qualification: "B.Sc./M.Sc. Mathematics students welcome",
    posted: "2 days ago",
    summary: "Teach classes 9–12 mathematics in evening batches, 3 days a week. Perfect alongside your own studies.",
    responsibilities: ["Take two evening batches", "Set and evaluate weekly tests", "Track student progress"],
    requirements: ["Solid grasp of school-level maths", "Available 5–8 pm", "Patient with beginners"],
  },
  {
    id: "lab-technician-biotech",
    title: "Lab Technician — Biotechnology",
    company: "Helix Diagnostics",
    category: "research",
    location: "Kochi, Kerala",
    type: "Full-time",
    stipend: "₹26,000 / month",
    qualification: "B.Sc./M.Sc. Biotechnology or Microbiology",
    posted: "1 week ago",
    summary: "Run routine sample processing in an NABL-accredited diagnostics lab.",
    responsibilities: ["Process patient samples", "Calibrate instruments daily", "Follow biosafety protocols"],
    requirements: ["Science graduate", "Careful documentation habits", "Shift flexibility"],
  },
  {
    id: "qa-tester-trainee",
    title: "QA Tester Trainee",
    company: "Cobalt Softworks",
    category: "it",
    location: "Indore, Madhya Pradesh",
    type: "Full-time",
    stipend: "₹3.2 LPA",
    qualification: "Any engineering or computer graduate",
    posted: "3 days ago",
    summary: "Manual testing role with structured mentoring into automation over the first year.",
    responsibilities: ["Execute test cases", "Log and verify defects", "Write regression checklists"],
    requirements: ["Logical thinking", "Basic SDLC understanding", "Good English documentation"],
  },
  {
    id: "guest-lecturer-commerce",
    title: "Guest Lecturer — Commerce",
    company: "City Degree College",
    category: "teaching",
    location: "Nagpur, Maharashtra",
    type: "Part-time",
    stipend: "₹800 / lecture",
    qualification: "M.Com or MBA (Finance)",
    posted: "4 days ago",
    summary: "Handle accountancy and business-statistics lectures for B.Com semesters 2 and 4.",
    responsibilities: ["Deliver 8 lectures per week", "Set internal assessments", "Guide student seminars"],
    requirements: ["Postgraduate in commerce", "Comfortable with classroom teaching", "Available on weekday mornings"],
  },
  {
    id: "operations-intern-logistics",
    title: "Operations Intern",
    company: "Trailhead Logistics",
    category: "internships",
    location: "Ahmedabad, Gujarat",
    type: "Internship",
    stipend: "₹12,000 / month (4 months)",
    qualification: "BBA/B.Com/MBA students",
    posted: "6 days ago",
    summary: "Shadow the dispatch team, track shipment SLAs and help improve the daily loading plan.",
    responsibilities: ["Track daily dispatch data", "Coordinate with warehouse supervisors", "Prepare weekly SLA summary"],
    requirements: ["Excel comfort", "On-site availability", "Interest in supply chain"],
  },
];

export const getJob = (id: string) => jobs.find((job) => job.id === id);

export const getCategory = (slug: string) => categories.find((category) => category.slug === slug);

export const countByCategory = (slug: string) => jobs.filter((job) => job.category === slug).length;
