import React, { useEffect, useRef, useState } from 'react';
import './Skills.css';

const SKILL_CATEGORIES = [
  {
    icon: 'ri-layout-masonry-line',
    title: 'Frontend',
    skills: [
      { name: 'React / Next.js',    pct: 92 },
      { name: 'TypeScript',          pct: 85 },
      { name: 'HTML / CSS / SASS',   pct: 95 },
      { name: 'Tailwind CSS',        pct: 90 },
    ],
  },
  {
    icon: 'ri-server-line',
    title: 'Backend',
    skills: [
      { name: 'Node.js / Express', pct: 88 },
      { name: 'Python / Django',   pct: 78 },
      { name: 'REST APIs / GraphQL', pct: 85 },
      { name: 'PostgreSQL / MongoDB', pct: 82 },
    ],
  },
  {
    icon: 'ri-tools-line',
    title: 'Tools & DevOps',
    skills: [
      { name: 'Git / GitHub',  pct: 93 },
      { name: 'Docker',        pct: 75 },
      { name: 'CI/CD / Vercel', pct: 80 },
      { name: 'Figma / UI Design', pct: 70 },
    ],
  },
];

const TECH_STACK = [
  { icon: 'ri-reactjs-line',      label: 'React' },
  { icon: 'ri-nodejs-line',       label: 'Node' },
  { icon: null, text: 'TS',       label: 'TypeScript' },
  { icon: 'ri-code-s-slash-line', label: 'Python' },
  { icon: 'ri-instance-line',     label: 'Docker' },
  { icon: 'ri-git-branch-line',   label: 'Git' },
  { icon: 'ri-database-2-line',   label: 'SQL' },
  { icon: 'ri-cloud-line',        label: 'Cloud' },
];

export default function Skills() {
  const sectionRef   = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            setAnimated(true);
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 120);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <section className="section skills-section" id="skills" ref={sectionRef}>
      <div className="container">

        <div className="section-header animate-on-scroll">
          <span className="section-tag">What I Work With</span>
          <h2 className="section-title">My <span className="gradient-text">Skills</span></h2>
        </div>

        <div className="skills-grid">
          {SKILL_CATEGORIES.map((cat, ci) => (
            <div className="skill-category glass-card animate-on-scroll" key={cat.title} style={{ transitionDelay: `${ci * 0.1}s` }}>
              <div className="skill-cat-header">
                <div className="skill-cat-icon"><i className={cat.icon} /></div>
                <h3>{cat.title}</h3>
              </div>
              <div className="skill-items">
                {cat.skills.map((s) => (
                  <div className="skill-item" key={s.name}>
                    <div className="skill-info">
                      <span>{s.name}</span>
                      <span>{s.pct}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className={`skill-fill${animated ? ' animated' : ''}`}
                        style={{ '--w': `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="tech-stack animate-on-scroll">
          <p className="tech-stack-label">Technologies I Use Daily</p>
          <div className="tech-icons">
            {TECH_STACK.map((t) => (
              <div className="tech-icon" key={t.label} title={t.label}>
                {t.icon
                  ? <i className={t.icon} />
                  : <span className="tech-text-icon">{t.text}</span>
                }
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
