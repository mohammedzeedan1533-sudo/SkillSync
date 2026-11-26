
import { useState, useEffect } from 'react';
import {
  GraduationCap, LayoutDashboard, Briefcase, Bookmark,
  FileText, User, Search, MapPin, Clock, ArrowRight,
  Sparkles, CheckCircle, Moon, Sun, Menu, TrendingUp,
  Building2, IndianRupee, X
} from 'lucide-react';
import './App.css';

const jobs = [
  { id: 1, company: 'Google', logo: 'G', color: '#4285F4', title: 'Software Developer Intern', location: 'Bengaluru', type: 'Hybrid', stipend: 35000, skills: ['Python', 'JavaScript', 'Git'], duration: '6 months' },
  { id: 2, company: 'Microsoft', logo: 'M', color: '#00a4ef', title: 'Frontend Developer Intern', location: 'Hyderabad', type: 'Remote', stipend: 30000, skills: ['React', 'JavaScript', 'CSS'], duration: '3 months' },
  { id: 3, company: 'Infosys', logo: 'I', color: '#007cc3', title: 'Data Analyst Intern', location: 'Mysuru', type: 'On-site', stipend: 18000, skills: ['Python', 'SQL', 'Excel'], duration: '6 months' },
  { id: 4, company: 'Swiggy', logo: 'S', color: '#fc8019', title: 'UI/UX Design Intern', location: 'Bengaluru', type: 'Hybrid', stipend: 25000, skills: ['Figma', 'CSS', 'Design'], duration: '3 months' },
  { id: 5, company: 'Razorpay', logo: 'R', color: '#536dfe', title: 'Backend Developer Intern', location: 'Bengaluru', type: 'Remote', stipend: 40000, skills: ['Python', 'SQL', 'Git'], duration: '6 months' },
  { id: 6, company: 'Adobe', logo: 'A', color: '#ed2224', title: 'Full Stack Developer Intern', location: 'Noida', type: 'Hybrid', stipend: 45000, skills: ['React', 'Python', 'JavaScript'], duration: '6 months' }
];

function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

const navigation = [
  ['Home', GraduationCap],
  ['Dashboard', LayoutDashboard],
  ['Explore Internships', Briefcase],
  ['Saved Internships', Bookmark],
  ['Applications', FileText],
  ['My Profile', User]
];

export default function App() {
  const [page, setPage] = useState('Home');
  const [dark, setDark] = useStored('ss-dark', false);
  const [saved, setSaved] = useStored('ss-saved', []);
  const [applied, setApplied] = useStored('ss-applied', []);
  const [profile, setProfile] = useStored('ss-profile', {
    name: 'Student',
    email: '',
    college: '',
    skills: 'Python, JavaScript, Git'
  });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [selected, setSelected] = useState(null);

  const notify = (message) => setToast(message);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  function navigate(next) {
    setPage(next);
    setMenu(false);
    setQuery('');
    setFilter('All');
    window.scrollTo(0, 0);
  }

  function match(job) {
    const skills = profile.skills.toLowerCase()
      .split(',').map(s => s.trim());
    return Math.round(job.skills.filter(
      s => skills.includes(s.toLowerCase())
    ).length / job.skills.length * 100);
  }

  function toggleSave(id) {
    const exists = saved.includes(id);
    setSaved(old => exists
      ? old.filter(x => x !== id)
      : [...old, id]);
    notify(exists ? 'Internship removed' : 'Internship saved!');
  }

  function apply(id) {
    if (applied.includes(id)) return;
    setApplied(old => [...old, id]);
    setSelected(null);
    notify('Demo application submitted successfully!');
  }

  const filtered = jobs.filter(job =>
    `${job.title} ${job.company} ${job.location} ${job.skills.join(' ')}`
      .toLowerCase().includes(query.toLowerCase()) &&
    (filter === 'All' || job.type === filter)
  );

  function JobCard({ job }) {
    return (
      <article className="job-card">
        <div className="job-top">
          <div className="company-logo"
            style={{ background: job.color }}>
            {job.logo}
          </div>
          <button className={`icon-btn ${saved.includes(job.id) ? 'active-save' : ''}`}
            aria-label="Save internship"
            onClick={() => toggleSave(job.id)}>
            <Bookmark size={20}
              fill={saved.includes(job.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        <span className="muted">{job.company}</span>
        <h3>{job.title}</h3>
        <div className="job-meta">
          <span><MapPin size={15}/>{job.location}</span>
          <span><Clock size={15}/>{job.duration}</span>
        </div>
        <div className="tags">
          {job.skills.map(s => <span key={s}>{s}</span>)}
        </div>
        <div className="match-row">
          <span><Sparkles size={15}/> Skill match</span>
          <strong>{match(job)}%</strong>
        </div>
        <div className="progress">
          <div style={{ width: `${match(job)}%` }}/>
        </div>
        <div className="job-bottom">
          <div>
            <strong>₹{job.stipend.toLocaleString('en-IN')}</strong>
            <small> / month</small>
          </div>
          <button className="primary small"
            onClick={() => setSelected(job)}>
            {applied.includes(job.id) ? 'Applied' : 'View details'}
          </button>
        </div>
      </article>
    );
  }

  function JobGrid({ items }) {
    return items.length ? (
      <div className="job-grid">
        {items.map(job => <JobCard key={job.id} job={job}/>)}
      </div>
    ) : (
      <div className="empty">
        <Briefcase size={42}/>
        <h3>Nothing here yet</h3>
        <p>Explore opportunities to get started.</p>
        <button className="primary"
          onClick={() => navigate('Explore Internships')}>
          Explore internships
        </button>
      </div>
    );
  }

  return (
    <div className={`app ${dark ? 'dark' : ''}`}>
      <aside className={`sidebar ${menu ? 'open' : ''}`}>
        <div className="brand" onClick={() => navigate('Home')}>
          <div className="brand-icon"><GraduationCap/></div>
          <div>Skill<span>Sync</span>
            <small>YOUR FUTURE STARTS HERE</small>
          </div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navigation.map(([name, Icon]) => (
            <button key={name}
              className={page === name ? 'nav-active' : ''}
              onClick={() => navigate(name)}>
              <Icon size={19}/>{name}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="career-box">
            <Sparkles size={23}/>
            <h4>Build your future</h4>
            <p>Discover opportunities that match your potential.</p>
            <button onClick={() => navigate('My Profile')}>
              Update profile <ArrowRight size={15}/>
            </button>
          </div>
          <small>SkillSync · SIH Project Prototype</small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu"
            onClick={() => setMenu(!menu)} aria-label="Menu">
            <Menu/>
          </button>
          <div className="breadcrumb">Workspace / <b>{page}</b></div>
          <div className="header-actions">
            <button className="icon-btn" aria-label="Toggle theme"
              onClick={() => setDark(!dark)}>
              {dark ? <Sun size={21}/> : <Moon size={21}/>}
            </button>
            <button className="avatar"
              onClick={() => navigate('My Profile')}>
              {profile.name.charAt(0).toUpperCase() || 'S'}
            </button>
          </div>
        </header>

        <div className="content">
          {page === 'Home' && <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow">
                  <Sparkles size={15}/> THE FUTURE OF CAREERS
                </div>
                <h1>Your skills.<br/>Your ambition.<br/>
                  <span>Your next opportunity.</span>
                </h1>
                <p>Bridge the gap between education and industry.
                  Discover internships that match your skills
                  and accelerate your career.</p>
                <div className="hero-buttons">
                  <button className="primary"
                    onClick={() => navigate('Explore Internships')}>
                    Explore opportunities <ArrowRight size={18}/>
                  </button>
                  <button className="secondary"
                    onClick={() => navigate('Dashboard')}>
                    My dashboard
                  </button>
                </div>
              </div>
              <div className="hero-art">
                <div className="orbit orbit-one"/>
                <div className="orbit orbit-two"/>
                <div className="hero-center"><GraduationCap size={76}/></div>
                <div className="floating float-one">
                  <TrendingUp/> Career growth
                </div>
                <div className="floating float-two">
                  <CheckCircle/> Smart matching
                </div>
                <div className="floating float-three">
                  <Briefcase/> Find your dream role
                </div>
              </div>
            </section>
            <div className="stats-grid">
              {[
                [Briefcase, jobs.length, 'Demo opportunities'],
                [Building2, 6, 'Sample companies'],
                [Bookmark, saved.length, 'Saved internships'],
                [CheckCircle, applied.length, 'Applications']
              ].map(([Icon, value, label]) => (
                <div className="stat-card" key={label}>
                  <div className="stat-icon"><Icon size={23}/></div>
                  <div><h2>{value}</h2><p>{label}</p></div>
                </div>
              ))}
            </div>
            <div className="section-heading">
              <div><h2>Featured opportunities</h2>
                <p>Discover your next career move.</p></div>
              <button className="text-btn"
                onClick={() => navigate('Explore Internships')}>
                View all <ArrowRight size={17}/>
              </button>
            </div>
            <JobGrid items={jobs.slice(0, 3)}/>
          </>}

          {page === 'Dashboard' && <>
            <div className="page-heading">
              <h1>Welcome back, {profile.name}!</h1>
              <p>Here's your career journey at a glance.</p>
            </div>
            <div className="stats-grid">
              {[
                [Briefcase, jobs.length, 'Opportunities'],
                [Bookmark, saved.length, 'Saved'],
                [FileText, applied.length, 'Applications'],
                [Sparkles, `${Math.max(...jobs.map(match))}%`, 'Best skill match']
              ].map(([Icon, value, label]) => (
                <div className="stat-card" key={label}>
                  <div className="stat-icon"><Icon/></div>
                  <div><h2>{value}</h2><p>{label}</p></div>
                </div>
              ))}
            </div>
            <div className="section-heading">
              <div><h2>Recommended for you</h2>
                <p>Based on the skills in your profile.</p></div>
            </div>
            <JobGrid items={[...jobs].sort((a,b) => match(b)-match(a)).slice(0,3)}/>
          </>}

          {page === 'Explore Internships' && <>
            <div className="page-heading">
              <h1>Explore internships</h1>
              <p>Find the right opportunity for your skills.</p>
            </div>
            <div className="search-bar">
              <Search size={21}/>
              <input placeholder="Search roles, companies or skills..."
                value={query} onChange={e => setQuery(e.target.value)}/>
              <select value={filter}
                onChange={e => setFilter(e.target.value)}>
                {['All','Remote','Hybrid','On-site'].map(f =>
                  <option key={f}>{f}</option>)}
              </select>
            </div>
            <p className="results">{filtered.length} opportunities found</p>
            <JobGrid items={filtered}/>
          </>}

          {page === 'Saved Internships' && <>
            <div className="page-heading">
              <h1>Saved internships</h1>
              <p>Keep your favourite opportunities in one place.</p>
            </div>
            <JobGrid items={jobs.filter(j => saved.includes(j.id))}/>
          </>}

          {page === 'Applications' && <>
            <div className="page-heading">
              <h1>My applications</h1>
              <p>Track your internship applications.</p>
            </div>
            {!applied.length ? <JobGrid items={[]}/> :
              <div className="application-list">
                {jobs.filter(j => applied.includes(j.id)).map(j =>
                  <div className="application-row" key={j.id}>
                    <div className="company-logo"
                      style={{background:j.color}}>{j.logo}</div>
                    <div><h3>{j.title}</h3><p>{j.company}</p></div>
                    <span className="status">Submitted</span>
                    <button className="secondary small"
                      onClick={() => {
                        setApplied(old => old.filter(id => id !== j.id));
                        notify('Application withdrawn');
                      }}>Withdraw</button>
                  </div>
                )}
              </div>}
          </>}

          {page === 'My Profile' && <>
            <div className="page-heading">
              <h1>My profile</h1>
              <p>Update your details to improve your skill matches.</p>
            </div>
            <form className="profile-form" onSubmit={e => {
              e.preventDefault();
              notify('Profile saved successfully!');
            }}>
              <div className="profile-avatar">
                {profile.name.charAt(0).toUpperCase() || 'S'}
              </div>
              {[
                ['name','Full name'],
                ['email','Email address'],
                ['college','College / University'],
                ['skills','Skills (separated by commas)']
              ].map(([key,label]) => (
                <label key={key}>{label}
                  <input type={key === 'email' ? 'email' : 'text'}
                    value={profile[key]}
                    onChange={e => setProfile(old => ({
                      ...old, [key]:e.target.value
                    }))}/>
                </label>
              ))}
              <button className="primary">Save profile</button>
            </form>
          </>}

          <footer>© 2026 SkillSync · Connecting talent with opportunity · Demo data</footer>
        </div>
      </main>

      {selected && <div className="modal-backdrop"
        onClick={() => setSelected(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="icon-btn close"
            onClick={() => setSelected(null)} aria-label="Close">
            <X/>
          </button>
          <div className="company-logo"
            style={{background:selected.color}}>{selected.logo}</div>
          <h2>{selected.title}</h2>
          <p>{selected.company} · {selected.location}</p>
          <div className="detail-row"><IndianRupee/>
            ₹{selected.stipend.toLocaleString('en-IN')} / month
          </div>
          <div className="detail-row"><Clock/>{selected.duration}</div>
          <div className="detail-row"><Briefcase/>{selected.type}</div>
          <h3>Required skills</h3>
          <div className="tags">{selected.skills.map(s =>
            <span key={s}>{s}</span>)}</div>
          <p>Your skill compatibility: <b>{match(selected)}%</b></p>
          <p className="muted">This is a demonstration listing, not a live vacancy.</p>
          <button className="primary"
            disabled={applied.includes(selected.id)}
            onClick={() => apply(selected.id)}>
            {applied.includes(selected.id) ? 'Already applied' : 'Apply now'}
          </button>
        </div>
      </div>}

      {toast && <div className="toast"><CheckCircle size={21}/>{toast}</div>}
    </div>
  );
}
