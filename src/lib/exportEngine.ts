import { PortfolioData } from '../context/BuilderContext';

export interface ExportOptions {
  includeShapes?: boolean;
  includeAnimations?: boolean;
  minify?: boolean;
}

// Helper to convert hex to RGB
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

export function generateExportCode(data: PortfolioData, options?: ExportOptions): string {
  const { user, settings, projects, skills, experience, collegeProjects, services, websiteType } = data;
  const isDark = settings.theme === 'dark';
  const layout = settings.layout || 'modern';
  const visible = settings.visibleSections || {};

  const includeShapes = options?.includeShapes !== false;
  const includeAnimations = options?.includeAnimations !== false;
  const minify = options?.minify === true;

  const accentRgb = hexToRgb(settings.accentColor);
  const cardClass = layout === 'brutalist' ? 'brutalist-card' : layout === 'minimal' ? 'minimal-card' : 'glass-card';

  const sectionOrder = settings.sectionOrder || ['hero', 'projects', 'skills', 'experience', 'services', 'contact', 'stats', 'team', 'pricing', 'education', 'about'];

  let sectionsHtml = '';

  sectionOrder.forEach(id => {
    if ((visible as any)[id] === false) return;

    if (id === 'hero') {
      const variant = settings.heroVariant || 'centered';
      if (websiteType === 'app') {
        sectionsHtml += `
<section class="hero app-hero">
  <div class="container">
    <h1 class="gradient-heading">${user.name || 'Your App Name'}</h1>
    <p class="tagline">${user.tagline || 'Your catchy tagline'}</p>
    <p class="bio">${user.bio || 'The best solution for your needs.'}</p>
    <div class="cta-group">
      <a href="#features" class="btn">Get Started</a>
      <a href="#pricing" class="btn btn-outline">View Pricing</a>
    </div>
  </div>
</section>`;
      } else if (variant === 'split') {
        sectionsHtml += `
<section class="hero hero-split">
  <div class="container split-container">
    <div class="hero-content">
      <h2 class="role">${user.role || 'Professional Title'}</h2>
      <h1 class="split-name">${user.name || 'Your Name'}</h1>
      <p class="bio">${user.bio || 'Tell your story here...'}</p>
      <div class="cta-group">
        <a href="#projects" class="btn">Explore Projects</a>
      </div>
    </div>
    <div class="hero-image-wrapper">
      ${user.avatar ? `<img src="${user.avatar}" class="split-avatar" alt="${user.name}">` : `<div class="avatar-placeholder"></div>`}
    </div>
  </div>
</section>`;
      } else if (variant === 'minimal') {
        sectionsHtml += `
<section class="hero hero-minimal">
  <div class="container">
    <span class="label">${user.role || 'YOUR ROLE'}</span>
    <h1 class="gradient-heading minimal-name">${user.name || 'YOUR NAME'}</h1>
    <p class="minimal-bio">${user.bio || 'Tell your story here...'}</p>
    <div class="minimal-divider"></div>
    <div class="minimal-links">
      <a href="#projects">Selected Work &rarr;</a>
      <a href="#contact">Contact &rarr;</a>
    </div>
  </div>
</section>`;
      } else {
        sectionsHtml += `
<section class="hero hero-centered">
  <div class="container">
    ${user.avatar ? `<img src="${user.avatar}" class="avatar" alt="${user.name}">` : ''}
    <p class="label">${user.role || 'YOUR ROLE'}</p>
    <h1 class="gradient-heading">${user.name || 'Your Name'}</h1>
    <p class="bio">${user.bio || 'Tell your story here...'}</p>
    <div class="cta-group">
      <a href="#projects" class="btn">View My Work</a>
      <a href="#contact" class="btn btn-outline">Get in Touch</a>
    </div>
  </div>
</section>`;
      }
    }

    if (id === 'projects' && (projects?.length || collegeProjects?.length)) {
      const items = websiteType === 'college' ? collegeProjects : projects;
      sectionsHtml += `
<section id="projects" class="projects">
  <div class="container">
    <h2>${websiteType === 'college' ? 'Academic Projects' : 'Featured Projects'}</h2>
    <div class="grid">
      ${(items || []).map(p => `
      <div class="card ${cardClass} project-card">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="tags">${(p as any).tags?.map((t: string) => `<span class="tag">${t}</span>`).join('') || ''}</div>
      </div>
      `).join('')}
    </div>
  </div>
</section>`;
    }

    if (id === 'skills' && skills?.length) {
      const variant = settings.skillsVariant || 'tags';
      let skillsHtml = '';
      if (variant === 'bars') {
        skillsHtml = `<div class="skills-bars">${skills.map(s => `<div class="skill-bar-item"><div class="skill-info"><span>${s.name}</span><span>${s.level}%</span></div><div class="skill-bar"><div class="skill-progress ${includeAnimations ? 'animate-bar' : ''}" style="--target-width: ${s.level}%${!includeAnimations ? '; width: ' + s.level + '%' : ''}"></div></div></div>`).join('')}</div>`;
      } else if (variant === 'grid') {
        skillsHtml = `<div class="skills-grid">${skills.map(s => `<div class="card ${cardClass} skill-card"><div class="skill-letter">${s.name.charAt(0)}</div><div class="skill-name">${s.name}</div><div class="skill-mini-bar"><div style="width: ${s.level}%"></div></div></div>`).join('')}</div>`;
      } else {
        skillsHtml = `<div class="skills-tags">${skills.map(s => `<span class="skill-tag">${s.name}</span>`).join('')}</div>`;
      }
      sectionsHtml += `<section id="skills" class="skills"><div class="container"><h2>Skills & Expertise</h2>${skillsHtml}</div></section>`;
    }

    if (id === 'experience' && experience?.length) {
      sectionsHtml += `
<section id="experience" class="experience">
  <div class="container">
    <h2>Experience</h2>
    <div class="timeline">
      ${experience.map(e => `<div class="card ${cardClass} timeline-item"><div class="time">${e.period}</div><div class="content"><h3>${e.title}</h3><h4>${e.company}</h4><p>${e.description}</p></div></div>`).join('')}
    </div>
  </div>
</section>`;
    }

    if (id === 'services' && services?.length) {
      sectionsHtml += `
<section id="services" class="services">
  <div class="container">
    <h2>Our Services</h2>
    <div class="grid">
      ${services.map(s => `<div class="card ${cardClass} service-card"><div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.desc}</p></div>`).join('')}
    </div>
  </div>
</section>`;
    }

    if (id === 'contact') {
      sectionsHtml += `
<section id="contact" class="contact">
  <div class="container text-center">
    <h2>Get In Touch</h2>
    <div class="card ${cardClass}" style="max-width: 600px; margin: 0 auto; padding: 4rem 2rem;">
      <p style="margin-bottom: 2rem; font-size: 1.1rem;">Interested in working together? Let's talk!</p>
      <div class="contact-links">
        ${user.email ? `<a href="mailto:${user.email}" class="btn">${user.email}</a>` : ''}
        ${user.location ? `<p class="location" style="margin-top: 1.5rem; color: var(--text-muted);">📍 ${user.location}</p>` : ''}
      </div>
    </div>
  </div>
</section>`;
    }
  });

  const siteTitle = `${user.name || 'My Website'} | FlowSite`;
  const siteDesc = (user.bio || user.tagline || 'Created with FlowSite website builder.').replace(/"/g, '&quot;');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${siteTitle}</title>
<meta name="description" content="${siteDesc}">

<!-- SEO & Social Meta -->
<meta property="og:title" content="${siteTitle}">
<meta property="og:description" content="${siteDesc}">
<meta property="og:type" content="website">
${user.avatar ? `<meta property="og:image" content="${user.avatar}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${siteTitle}">
<meta name="twitter:description" content="${siteDesc}">

<!-- Structured Data (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${websiteType === 'business' || websiteType === 'app' ? 'Organization' : 'Person'}",
  "name": "${user.name}",
  "jobTitle": "${user.role}",
  "description": "${siteDesc}",
  "image": "${user.avatar || ''}"
}
</script>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --accent: ${settings.accentColor};
    --accent-rgb: ${accentRgb};
    --bg: ${isDark ? '#0F172A' : '#FAFBFC'};
    --surface: ${isDark ? '#1E293B' : '#FFFFFF'};
    --text: ${isDark ? '#FFFFFF' : '#0F172A'};
    --text-muted: ${isDark ? '#94A3B8' : '#64748B'};
    --radius: ${layout === 'brutalist' ? '0px' : '24px'};
    --border: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; }
  .container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
  .text-center { text-align: center; }
  section { padding: 8rem 0; position: relative; z-index: 10; ${includeAnimations ? 'opacity: 0;' : ''} }
  h1 { font-size: 4rem; font-weight: 800; margin-bottom: 1rem; }
  h2 { font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; text-align: center; }
  
  .gradient-heading {
    background: linear-gradient(135deg, var(--accent), var(--text));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero { min-height: 90vh; display: flex; align-items: center; justify-content: center; position: relative; }
  
  /* Centered Variant */
  .hero-centered { text-align: center; background: radial-gradient(circle at center, rgba(var(--accent-rgb), 0.05), transparent 70%); }
  
  /* Split Variant */
  .hero-split .split-container { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; text-align: right; }
  .hero-split .hero-content { display: flex; flex-direction: column; gap: 1.5rem; }
  .hero-split .split-name { font-size: 5rem; line-height: 0.9; }
  .hero-split .hero-image-wrapper { aspect-ratio: 4/5; border-radius: 2rem; overflow: hidden; background: rgba(var(--accent-rgb), 0.05); }
  .hero-split .split-avatar { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); transition: 0.5s; }
  .hero-split .split-avatar:hover { filter: grayscale(0); }
  
  /* Minimal Variant */
  .hero-minimal { text-align: left; }
  .hero-minimal .minimal-name { font-size: clamp(3rem, 8vw, 7rem); line-height: 0.85; margin: 1rem 0; text-transform: uppercase; }
  .hero-minimal .minimal-bio { font-size: 1.5rem; border-left: 4px solid var(--accent); padding-left: 2rem; max-width: 800px; }
  .hero-minimal .minimal-divider { height: 1px; background: var(--border); margin: 3rem 0; }
  .hero-minimal .minimal-links { display: flex; gap: 3rem; }
  .hero-minimal .minimal-links a { text-decoration: none; color: var(--text); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; transition: 0.3s; }
  .hero-minimal .minimal-links a:hover { color: var(--accent); }

  .avatar { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid var(--accent); margin: 0 auto 2rem; display: block; }
  .label { color: var(--accent); font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; }
  .role { color: var(--accent); font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 600; }
  .bio { max-width: 600px; margin: 0 auto 2rem; font-size: 1.2rem; color: var(--text-muted); }
  
  .cta-group { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
  .hero-split .cta-group { justify-content: flex-end; }
  
  .btn { display: inline-block; padding: 1rem 2.5rem; background: var(--accent); color: white; text-decoration: none; border-radius: 100px; font-weight: 600; transition: 0.3s; border: 2px solid var(--accent); }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(var(--accent-rgb), 0.4); }
  .btn-outline { background: transparent; color: var(--accent); }
  
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
  
  /* Card Themes */
  .card { transition: 0.3s; }
  
  .glass-card {
    background: rgba(var(--accent-rgb), 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(var(--accent-rgb), 0.15);
    border-radius: var(--radius);
    padding: 2.5rem;
  }
  .glass-card:hover { border-color: var(--accent); transform: translateY(-5px); background: rgba(var(--accent-rgb), 0.07); }

  .brutalist-card {
    background: var(--surface);
    border: 3px solid var(--text);
    border-radius: 0;
    box-shadow: 8px 8px 0 var(--text);
    padding: 2.5rem;
  }
  .brutalist-card:hover { transform: translate(-4px, -4px); box-shadow: 12px 12px 0 var(--text); }

  .minimal-card {
    background: transparent;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
    padding: 2rem 0;
  }
  .minimal-card:hover { border-bottom-color: var(--accent); }

  .tag { display: inline-block; font-size: 0.8rem; padding: 0.3rem 0.8rem; background: rgba(var(--accent-rgb), 0.1); color: var(--accent); border-radius: 6px; margin: 0.5rem 0.5rem 0 0; }
  
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
  .skill-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 600; }
  .skill-bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
  .skill-progress { height: 100%; background: var(--accent); }
  
  .timeline { position: relative; max-width: 800px; margin: 0 auto; }
  .timeline-item { margin-bottom: 2rem; }
  .time { font-weight: 700; color: var(--accent); margin-bottom: 0.5rem; display: block; }
  
  /* Skills Variants */
  .skills-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
  .skill-tag { padding: 0.75rem 1.5rem; background: var(--surface); border: 2px solid rgba(var(--accent-rgb), 0.2); border-radius: 12px; font-weight: 700; transition: 0.3s; }
  .skill-tag:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 5px 15px rgba(var(--accent-rgb), 0.1); }

  .skills-bars { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem 4rem; }
  .skill-bar-item { margin-bottom: 1rem; }
  .skill-progress { height: 100%; background: linear-gradient(90deg, var(--accent), rgba(var(--accent-rgb), 0.6)); border-radius: 4px; ${includeAnimations ? 'width: 0;' : ''} }
  ${includeAnimations ? `
  .animate-bar.fade-in-up { animation: growBar 1s ease-out forwards 0.3s; }
  @keyframes growBar { from { width: 0; } to { width: var(--target-width); } }
  ` : ''}

  .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
  .skill-card { text-align: center; padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  .skill-letter { width: 60px; height: 60px; background: rgba(var(--accent-rgb), 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; color: var(--accent); transition: 0.3s; }
  .skill-card:hover .skill-letter { background: var(--accent); color: white; transform: scale(1.1); }
  .skill-name { font-weight: 700; }
  .skill-mini-bar { width: 40px; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .skill-mini-bar div { height: 100%; background: var(--accent); }

  /* Animations */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-12px) rotate(2deg); }
    66%       { transform: translateY(-6px) rotate(-1deg); }
  }

  ${includeAnimations ? `
  .fade-in-up { animation: fadeInUp 0.6s ease forwards; }
  .section-animate { animation-delay: calc(var(--i, 0) * 0.15s); }
  ` : ''}

  ${includeShapes ? `
  .bg-shape { position: fixed; z-index: 1; background: var(--accent); opacity: 0.08; filter: blur(40px); pointer-events: none; animation: float 10s infinite ease-in-out; }
  .shape-1 { width: 400px; height: 400px; top: -100px; left: -100px; border-radius: 45% 55% 70% 30% / 30% 40% 60% 70%; animation-duration: 12s; }
  .shape-2 { width: 300px; height: 300px; bottom: 10%; right: -50px; border-radius: 70% 30% 30% 70% / 60% 40% 60% 40%; animation-duration: 15s; }
  ` : ''}

  @media (max-width: 768px) { 
    h1 { font-size: 2.5rem; } 
    section { padding: 5rem 0; } 
    .hero { min-height: 70vh; }
    .hero-split .split-container { grid-template-columns: 1fr; text-align: center; gap: 2rem; }
    .hero-split .hero-image-wrapper { order: -1; aspect-ratio: 1; width: 200px; margin: 0 auto; }
    .hero-split .cta-group { justify-content: center; }
    .hero-minimal .minimal-bio { font-size: 1.2rem; }
    .brutalist-card { box-shadow: 4px 4px 0 var(--text); }
    .brutalist-card:hover { box-shadow: 6px 6px 0 var(--text); }
  }
</style>
</head>
<body>
${includeShapes ? `
<div class="bg-shape shape-1"></div>
<div class="bg-shape shape-2"></div>
` : ''}
${sectionsHtml}

${includeAnimations ? `
<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.setProperty('--i', i % 5);
        e.target.classList.add('fade-in-up');
        e.target.classList.add('section-animate');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('section').forEach(s => observer.observe(s));
</script>
` : ''}
</body>
</html>`;

  if (minify) {
    return html
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .replace(/<!--.*?-->/g, '');
  }

  return html;
}