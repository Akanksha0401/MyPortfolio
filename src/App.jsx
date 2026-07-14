import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   Akanksha Mishra — Portfolio
   Sections: Nav, Hero (photo + count-up stats), Experience (expandable),
   Skills, Education, Recognition, Projects, Contact
--------------------------------------------------------------------------- */

const LINKS = {
  email: "mailto:akankshawork369@gmail.com",
  linkedin: "https://www.linkedin.com/in/am0401",
  github: "https://github.com/Akanksha0401",
  leetcode: "https://leetcode.com/u/8WvRc9G79U/", // ← replace with your LeetCode profile URL
};

/* ---- Count-up hook: animates a number from 0 when it scrolls into view ---- */
function useCountUp(target, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setValue(target);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          setValue(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return [ref, value];
}

function Stat({ label, target, prefix = "", suffix = "" }) {
  const [ref, value] = useCountUp(target);
  return (
    <div className="stat" ref={ref}>
      <dt>{label}</dt>
      <dd>
        {prefix}
        {value.toLocaleString("en-IN")}
        {suffix}
      </dd>
    </div>
  );
}

/* ---- Animated latency-style sparkline (signature element) ---- */
function Sparkline() {
  return (
    <div className="spark-wrap" aria-hidden="true">
      <svg viewBox="0 0 900 120" preserveAspectRatio="none" className="spark">
        <path
          className="spark-line"
          d="M0,86 L60,84 L110,90 L160,70 L210,78 L260,52 L310,64 L360,40 L410,58 L460,30 L510,48 L560,26 L610,44 L660,20 L710,38 L760,16 L810,30 L860,12 L900,22"
        />
        <circle className="spark-dot" cx="900" cy="22" r="4" />
      </svg>
      <div className="spark-grid" />
    </div>
  );
}

function Nav() {
  return (
    <header className="nav">
      <a href="#top" className="nav-name">
        am<span className="accent">.</span>
      </a>
      <nav className="nav-links" aria-label="Primary">
        <a href="#experience">experience</a>
        <a href="#skills">skills</a>
        <a href="#education">education</a>
        <a href="#projects">projects</a>
        <a href="#contact">
          contact
        </a>
        <a href="/public/AkankshaMishra_Resume.pdf" target="_blank" rel="noreferrer">resume</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-top">
        <div className="hero-text">
          <p className="eyebrow">backend · distributed systems</p>
          <h1>
            Akanksha
            <br />
            Mishra
          </h1>
          <p className="hero-sub">
            Software engineer who designs and scales high-throughput distributed backend systems — event-driven pipelines, microservice architectures, membership platforms, and services that hold up during peak sale traffic. Previously SDE-1 at Flipkart.
          </p>
          <div className="hero-actions">
            <a href="/public/AkankshaMishra_Resume.pdf" download="Akanksha_Mishra_Resume.pdf" className="btn-resume">
              ↓ Download Resume
            </a>
            <a href="/public/AkankshaMishra_Resume.pdf" target="_blank" rel="noreferrer" className="btn-resume-ghost">
              View in browser ↗
            </a>
          </div>
        </div>

        <div className="hero-photo-wrap">
          <div className="photo-ring">
            {/* Put your photo at portfolio/public/profile.jpg */}
            <img
              src="/mypic.jpeg"
              alt="Akanksha Mishra"
              className="hero-photo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.classList.add("photo-fallback");
              }}
            />
          </div>
        </div>
      </div>

      <Sparkline />

      <dl className="stats" aria-label="Key production metrics">
        <Stat label="users served" target={450} suffix="M+" />
        <Stat label="service peak · BBD" target={11} suffix="k QPS" />
        <Stat label="write scale-up" target={3600} suffix="x" />
        <Stat label="GMV impact" target={3500} prefix="₹" suffix=" Cr" />
      </dl>
    </section>
  );
}

/* ---- Experience data ---- */
const EXPERIENCE = [
  {
    id: "flipkart",
    company: "Flipkart",
    logo: "https://images.seeklogo.com/logo-png/31/1/flipkart-logo-png_seeklogo-318406.png",
    role: "Software Development Engineer — I",
    location: "Bangalore, India",
    dates: "Jul 2024 — Apr 2026",
    summary:
      "Owned high-scale loyalty & benefits systems serving 450M+ users.",
    points: [
      <>
        Led end-to-end design of a real-time <strong>Benefits Engine</strong> —
        a single source of truth for user benefits, replacing a 24-hour batch
        delay with event-driven computation (Varadhi pub/sub) for millions of
        users; scaled to <strong>110x reads / 3600x writes</strong> with a
        circuit-breaker-protected enrichment pipeline.
      </>,
      <>
        Led the <strong>Plus Rehash migration</strong> to tiered membership
        (Silver / Gold / Silver Trial) with a backward-compatible dual-ID
        design across 10+ downstream services — driving{" "}
        <strong>₹3500 Cr GMV uplift</strong>, 30–50k daily activations at 90%+
        conversion, and +7.5% monthly spend.
      </>,
      <>
        Scaled the LOA service to <strong>11k peak QPS</strong> (+50% YoY)
        through Big Billion Days with zero downtime — owning NFRs, capacity
        planning, and thread tuning that cut API latency by{" "}
        <strong>40%</strong>; added rate limiting, degradation playbooks, and a
        full cross-region failover drill.
      </>,
      <>
        Resolved a <strong>P0 impacting 635k orders</strong>: fixed
        reconciliation bugs, executed large-scale recovery (−96% user
        escalations), and eliminated infinite retries with a custom exception
        framework (−60% Coin Manager API failures).
      </>,
      <>
        Raised unit-test coverage from 60% to <strong>80%+</strong> on the User
        Manager service using Cursor and GitHub Copilot, improving dev
        productivity by 15%.
      </>,
    ],
    tech: [
      "Java",
      "Spring Boot",
      "Microservices",
      "Kafka / Varadhi",
      "Kubernetes",
      "MySQL",
      "Hystrix",
      "Prometheus",
      "Grafana",
    ],
  },
  {
    id: "microsoft",
    company: "Microsoft",
    logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
    role: "Software Engineer Intern",
    location: "Hyderabad, India",
    dates: "Jul 2023 — Aug 2023",
    summary:
      "Extended an auto-remediation platform for network devices on Azure.",
    points: [
      <>
        Extended an auto-troubleshooting and remediation platform for network
        devices with an end-to-end backend execution pathway for non-incident
        request sources (beyond ICM), enabling command and workflow execution
        across new entry points.
      </>,
      <>
        Validated scalability with a proof-of-concept load test simulating{" "}
        <strong>200k+ concurrent requests</strong>.
      </>,
    ],
    tech: [
      "C#",
      "ASP.NET",
      "Azure Functions",
      "Azure Service Bus",
      "SQL Server",
      "REST APIs",
    ],
  },
];

function ExperienceCard({ item, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <article className={`xp-card ${open ? "open" : ""}`}>
      <button
        className="xp-head"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`xp-body-${item.id}`}
      >
        <span className="xp-logo-wrap">
          <img
            src={item.logo}
            alt=""
            className="xp-logo"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.replaceWith(
                Object.assign(document.createElement("span"), {
                  className: "xp-logo-fallback",
                  textContent: item.company[0],
                })
              );
            }}
          />
        </span>
        <span className="xp-title">
          <span className="xp-role">{item.role}</span>
          <span className="xp-meta">
            {item.company} · {item.location}
          </span>
        </span>
        <span className="xp-right">
          <span className="xp-dates">{item.dates}</span>
          <span className="xp-chevron" aria-hidden="true">
            ▾
          </span>
        </span>
      </button>

      {!open && <p className="xp-summary">{item.summary}</p>}

      <div id={`xp-body-${item.id}`} className="xp-body" hidden={!open}>
        <ul className="role-points">
          {item.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <div className="chips">
          {item.tech.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function Experience() {
  return (
    <section id="experience" className="section reveal">
      <h2 className="section-tag">[ experience ]</h2>
      <div className="xp-list">
        {EXPERIENCE.map((item, i) => (
          <ExperienceCard key={item.id} item={item} defaultOpen={i === 0} />
        ))}
      </div>
      <p className="xp-hint">click a role to expand ↕</p>
    </section>
  );
}

/* ---- Skills ---- */
const SKILLS = [
  {
    label: "languages",
    icon: "{ }",
    items: ["C++", "Java", "Python", "C#", "SQL"],
  },
  {
    label: "backend & distributed systems",
    icon: "⇄",
    items: [
      "Spring Boot",
      "Microservices",
      "REST APIs",
      "Event-Driven Architecture",
      "Kafka / Varadhi",
      "Pub/Sub",
      "Quartz",
      "Circuit Breakers",
    ],
  },
  {
    label: "data & infrastructure",
    icon: "▤",
    items: ["MySQL", "MongoDB", "Kubernetes", "Azure"],
  },
  {
    label: "design & observability",
    icon: "◉",
    items: [
      "System Design (LLD, NFRs, Scaling)",
      "Prometheus",
      "Grafana",
      "Git",
      "CI/CD",
    ],
  },
];

function Skills() {
  return (
    <section id="skills" className="section reveal">
      <h2 className="section-tag">[ skills ]</h2>
      <div className="skills-grid">
        {SKILLS.map((g) => (
          <div className="skill-card" key={g.label}>
            <div className="skill-card-head">
              <span className="skill-icon" aria-hidden="true">
                {g.icon}
              </span>
              <p className="skill-label">{g.label}</p>
            </div>
            <div className="chips">
              {g.items.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="section reveal">
      <h2 className="section-tag">[ education ]</h2>
      <div className="edu">
        <div className="edu-left">
          <span className="xp-logo-wrap">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUA4imiQCEBC1eJmwB-Rtt5zInqpIazo6cfiV-fq52AQ&s=10" alt="" className="xp-logo" />
          </span>
          <div>
            <h3>KIET Group of Institutions, Delhi-NCR</h3>
            <p className="role-org">B.Tech, Computer Science</p>
            <p className="role-org">CGPA 8.6</p>
          </div>
        </div>
        <p className="role-dates">2020 — 2024</p>
      </div>
    </section>
  );
}

function Recognition() {
  return (
    <section id="recognition" className="section reveal">
      <h2 className="section-tag">[ recognition & awards ]</h2>
      <ul className="awards">
        <li>
          <span>
            <span className="award-name">Instant Karma Award, Flipkart</span> — For
            driving the Loyalty Plus Revamp launch
          </span>
          <span className="award-date">Apr 2025</span>
        </li>
        <li>
          <span>
            <span className="award-name">Winner, Innotech 2K22, KIET</span> —
            Institute-level technical fest
          </span>
          <span className="award-date">May 2022</span>
        </li>
        <li>
          <span>
            <span className="award-name">
              Semi-Finalist, Accenture Innovation Challenge Hackathon
            </span>
          </span>
          <span className="award-date">Aug 2021</span>
        </li>
      </ul>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section reveal">
      <h2 className="section-tag">[ projects ]</h2>
      <div className="project-card">
        <div className="project-head">
          <h3>
            <a
              href="https://github.com/Akanksha0401/engage2k22"
              target="_blank"
              rel="noreferrer"
            >
              Facial-Recognition Attendance Tracker ↗
            </a>
          </h3>
          <p className="role-dates">May 2022</p>
        </div>
        <p className="project-desc">
          Web app for online student attendance via facial recognition —
          integrated face-api.js for detection and tracking, with Firebase for
          student records.
        </p>
        <div className="chips">
          {["React", "Node.js", "SASS", "Firebase", "face-api.js"].map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="contact reveal">
      <h2 className="section-tag">[ contact ]</h2>
      <p className="contact-line">
        Open to SDE roles in backend & distributed systems.
      </p>
      <a className="contact-email" href={LINKS.email}>
        <img
          src="https://commons.wikimedia.org/wiki/Special:FilePath/Gmail_icon_(2020).svg"
          alt=""
          className="email-icon"
        />
        akankshawork369@gmail.com
      </a>
      <div className="contact-links">
        <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
          <img
            src="https://commons.wikimedia.org/wiki/Special:FilePath/LinkedIn_icon.svg"
            alt=""
            className="link-icon"
          />
          LinkedIn ↗
        </a>
        <a href={LINKS.github} target="_blank" rel="noreferrer">
          <img
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Octicons-mark-github.svg"
            alt=""
            className="link-icon github-icon"
          />
          GitHub ↗
        </a>
        <a href={LINKS.leetcode} target="_blank" rel="noreferrer">
          <img
            src="https://commons.wikimedia.org/wiki/Special:FilePath/LeetCode_Logo_1.png"
            alt=""
            className="link-icon"
          />
          LeetCode ↗
        </a>
      </div>
      <p className="colophon">Akanksha Mishra · {new Date().getFullYear()}</p>
    </footer>
  );
}

export default function App() {
  /* Scroll-triggered reveals (disabled automatically for reduced motion) */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const els = document.querySelectorAll(".reveal");
    if (reduce.matches) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Education />
        <Recognition />
        <Projects />
      </main>
      <Contact />
    </>
  );
}
