import React, { useEffect, useRef } from 'react';
import './Portfolio.css';

const PROJECTS = [
  {
    icon: 'ri-shopping-cart-2-line',
    tags: ['React', 'Node.js', 'MongoDB'],
    title: 'E-Commerce Platform',
    desc: 'A full-featured online store with real-time inventory, Stripe payments, and a custom admin dashboard.',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    icon: 'ri-dashboard-3-line',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL'],
    title: 'SaaS Analytics Dashboard',
    desc: 'Real-time analytics platform with live charts, team workspaces, and role-based access control.',
    featured: true,
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    icon: 'ri-chat-3-line',
    tags: ['React', 'Socket.io', 'Redis'],
    title: 'Real-Time Chat App',
    desc: 'Scalable messaging platform with WebSocket support, file sharing, and end-to-end encryption.',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    icon: 'ri-robot-2-line',
    tags: ['Python', 'FastAPI', 'OpenAI'],
    title: 'AI Content Generator',
    desc: 'AI-powered writing assistant using GPT integration with custom fine-tuning and prompt engineering.',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    icon: 'ri-map-pin-line',
    tags: ['Vue.js', 'Mapbox', 'Express'],
    title: 'Location Tracker',
    desc: 'Interactive geo-tracking app with custom map overlays and real-time location updates.',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    icon: 'ri-calendar-check-line',
    tags: ['Next.js', 'Prisma', 'Tailwind'],
    title: 'Task Management App',
    desc: 'Productivity platform with drag-and-drop boards, team collaboration, and deadline tracking.',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
  },
];

export default function Portfolio() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section portfolio-section" id="portfolio" ref={sectionRef}>
      <div className="container">

        <div className="section-header animate-on-scroll">
          <span className="section-tag">My Work</span>
          <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
        </div>

        <div className="portfolio-grid">
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              className={`project-card glass-card animate-on-scroll${p.featured ? ' featured' : ''}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {p.featured && <div className="project-badge">Featured</div>}

              <div className="project-visual">
                <div className="project-img-placeholder">
                  <i className={p.icon} />
                </div>
                <div className="project-overlay">
                  <a href={p.liveUrl} className="project-link" aria-label="View live" target="_blank" rel="noreferrer">
                    <i className="ri-external-link-line" />
                  </a>
                  <a href={p.githubUrl} className="project-link" aria-label="GitHub" target="_blank" rel="noreferrer">
                    <i className="ri-github-fill" />
                  </a>
                </div>
              </div>

              <div className="project-info">
                <div className="project-tags">
                  {p.tags.map((t) => <span className="project-tag" key={t}>{t}</span>)}
                </div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="portfolio-cta animate-on-scroll">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-ghost">
            View All Projects on GitHub <i className="ri-github-fill" />
          </a>
        </div>

      </div>
    </section>
  );
}
