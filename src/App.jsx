
import { useState, useEffect } from 'react';
import {
  GraduationCap, LayoutDashboard, Briefcase, Bookmark,
  FileText, User, Search, MapPin, Clock, ArrowRight,
  Sparkles, CheckCircle, Moon, Sun, Menu, TrendingUp,
  Building2, IndianRupee, X
} from 'lucide-react';

import Recruiter from './Recruiter';
import ResumeAnalyzer from './ResumeAnalyzer';
import './App.css';

const initialJobs = [
  {
    id: 1,
    company: 'Google',
    logo: 'G',
    color: '#4285F4',
    title: 'Software Developer Intern',
    location: 'Bengaluru',
    type: 'Hybrid',
    stipend: 35000,
    skills: ['Python', 'JavaScript', 'Git'],
    duration: '6 months'
  },
  {
    id: 2,
    company: 'Microsoft',
    logo: 'M',
    color: '#00a4ef',
    title: 'Frontend Developer Intern',
    location: 'Hyderabad',
    type: 'Remote',
    stipend: 30000,
    skills: ['React', 'JavaScript', 'CSS'],
    duration: '3 months'
  },
  {
    id: 3,
    company: 'Infosys',
    logo: 'I',
    color: '#007cc3',
    title: 'Data Analyst Intern',
    location: 'Mysuru',
    type: 'On-site',
    stipend: 18000,
    skills: ['Python', 'SQL', 'Excel'],
    duration: '6 months'
  },
  {
    id: 4,
    company: 'Swiggy',
    logo: 'S',
    color: '#fc8019',
    title: 'UI/UX Design Intern',
    location: 'Bengaluru',
    type: 'Hybrid',
    stipend: 25000,
    skills: ['Figma', 'CSS', 'Design'],
    duration: '3 months'
  },
  {
    id: 5,
    company: 'Razorpay',
    logo: 'R',
    color: '#536dfe',
    title: 'Backend Developer Intern',
    location: 'Bengaluru',
    type: 'Remote',
    stipend: 40000,
    skills: ['Python', 'SQL', 'Git'],
    duration: '6 months'
  },
  {
    id: 6,
    company: 'Adobe',
    logo: 'A',
    color: '#ed2224',
    title: 'Full Stack Developer Intern',
    location: 'Noida',
    type: 'Hybrid',
    stipend: 45000,
    skills: ['React', 'Python', 'JavaScript'],
    duration: '6 months'
  }
];

const navigation = [
  ['Home', GraduationCap],
  ['Dashboard', LayoutDashboard],
  ['Explore Internships', Briefcase],
  ['Saved Internships', Bookmark],
  ['Applications', FileText],
  ['My Profile', User],
  ['Résumé Analyzer', Sparkles],
  ['Recruiter Portal', Building2]
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
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  }, [key, value]);

  return [value, setValue];
}

function calculateMatch(job, profile) {
  const skills = (profile.skills || '')
    .toLowerCase()
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!job.skills?.length) return 0;

  return Math.round(
    job.skills.filter(
      s => skills.includes(s.toLowerCase())
    ).length / job.skills.length * 100
  );
}

function JobCard({
  job, profile, saved, applied, toggleSave, setSelected
}) {
  const score = calculateMatch(job, profile);

  return (
    <article className="job-card">
      <div className="job-top">
        <div
          className="company-logo"
          style={{ background: job.color }}
        >
          {job.logo}
        </div>

        <button
          className={`icon-btn ${
            saved.includes(job.id) ? 'active-save' : ''
          }`}
          aria-label="Save internship"
          aria-pressed={saved.includes(job.id)}
          onClick={() => toggleSave(job.id)}
        >
          <Bookmark
            size={20}
            fill={
              saved.includes(job.id)
                ? 'currentColor'
                : 'none'
            }
          />
        </button>
      </div>

      <span className="muted">{job.company}</span>
      <h3>{job.title}</h3>

      <div className="job-meta">
        <span>
          <MapPin size={15}/>
          {job.location}
        </span>

        <span>
          <Clock size={15}/>
          {job.duration}
        </span>

        <span>
          <Briefcase size={15}/>
          {job.type}
        </span>
      </div>

      <div className="tags">
        {job.skills.map((skill, index) => (
          <span key={`${skill}-${index}`}>{skill}</span>
        ))}
      </div>

      <div className="match-row">
        <span>
          <Sparkles size={15}/>
          Skill match
        </span>
        <strong>{score}%</strong>
      </div>

      <div className="progress">
        <div style={{ width: `${score}%` }}/>
      </div>

      <div className="job-bottom">
        <div>
          <strong>
            ₹{job.stipend.toLocaleString('en-IN')}
          </strong>
          <small> / month</small>
        </div>

        <button
          className="primary small"
          onClick={() => setSelected(job)}
        >
          {applied.includes(job.id)
            ? 'Applied'
            : 'View details'}
        </button>
      </div>
    </article>
  );
}

function JobGrid({
  items, profile, saved, applied,
  toggleSave, setSelected, navigate
}) {
  if (!items.length) {
    return (
      <div className="empty">
        <Briefcase size={42}/>
        <h3>Nothing here yet</h3>
        <p>Explore opportunities to get started.</p>

        <button
          className="primary"
          onClick={() => navigate('Explore Internships')}
        >
          Explore internships
        </button>
      </div>
    );
  }

  return (
    <div className="job-grid">
      {items.map(job => (
        <JobCard
          key={job.id}
          job={job}
          profile={profile}
          saved={saved}
          applied={applied}
          toggleSave={toggleSave}
          setSelected={setSelected}
        />
      ))}
    </div>
  );
}

function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map(([Icon, value, label]) => (
        <div className="stat-card" key={label}>
          <div className="stat-icon">
            <Icon size={23}/>
          </div>

          <div>
            <h2>{value}</h2>
            <p>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('Home');

  const [jobs, setJobs] = useStored(
    'ss-jobs', initialJobs
  );

  const [statuses, setStatuses] = useStored(
    'ss-statuses', {}
  );

  const [dark, setDark] = useStored(
    'ss-dark', false
  );

  const [saved, setSaved] = useStored(
    'ss-saved', []
  );

  const [applied, setApplied] = useStored(
    'ss-applied', []
  );

  const [profile, setProfile] = useStored(
    'ss-profile',
    {
      name: 'Student',
      email: '',
      college: '',
      skills: 'Python, JavaScript, Git'
    }
  );

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Recommended');
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [selected, setSelected] = useState(null);

  const notify = message => setToast(message);

  useEffect(() => {
    document.title = `${page} | SkillSync`;
  }, [page]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(
      () => setToast(''), 3000
    );

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setSelected(null);
        setMenu(false);
      }
    }

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener(
        'keydown', handleEscape
      );
    };
  }, []);

  function navigate(next) {
    setPage(next);
    setMenu(false);
    setQuery('');
    setFilter('All');
    setSort('Recommended');
    setSelected(null);
    window.scrollTo(0, 0);
  }

  function match(job) {
    return calculateMatch(job, profile);
  }

  const activeSaved = saved.filter(
    id => jobs.some(job => job.id === id)
  );

  const activeApplied = applied.filter(
    id => jobs.some(job => job.id === id)
  );

  function toggleSave(id) {
    const exists = saved.includes(id);

    setSaved(old =>
      exists
        ? old.filter(x => x !== id)
        : [...old, id]
    );

    notify(
      exists
        ? 'Internship removed'
        : 'Internship saved!'
    );
  }

  function apply(id) {
    if (applied.includes(id)) return;

    setApplied(old => [...old, id]);

    setStatuses(old => ({
      ...old,
      [id]: 'Submitted'
    }));

    setSelected(null);
    notify('Demo application submitted successfully!');
  }

  function withdraw(id) {
    if (!window.confirm(
      'Are you sure you want to withdraw this application?'
    )) return;

    setApplied(old =>
      old.filter(item => item !== id)
    );

    setStatuses(old => {
      const updated = { ...old };
      delete updated[id];
      return updated;
    });

    notify('Application withdrawn');
  }

  function updateJobs(update) {
    setJobs(update);
  }

  const filtered = jobs.filter(job =>
    `${job.title} ${job.company} ${job.location} ${job.skills.join(' ')}`
      .toLowerCase()
      .includes(query.toLowerCase()) &&
    (filter === 'All' || job.type === filter)
  );

  const sortedJobs = [...filtered].sort((a, b) => {
    if (sort === 'Highest stipend') {
      return b.stipend - a.stipend;
    }

    if (sort === 'Newest first') {
      return b.id - a.id;
    }

    return match(b) - match(a);
  });

  const recommended = [...jobs]
    .sort((a, b) => match(b) - match(a))
    .slice(0, 3);

  const gridProps = {
    profile,
    saved: activeSaved,
    applied: activeApplied,
    toggleSave,
    setSelected,
    navigate
  };

  const companyCount = new Set(
    jobs.map(job => job.company.toLowerCase())
  ).size;

  const bestMatch = jobs.length
    ? Math.max(...jobs.map(match))
    : 0;

  const profileSkills = (profile.skills || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div className={`app ${dark ? 'dark' : ''}`}>

      {/* SIDEBAR */}

      <aside className={`sidebar ${menu ? 'open' : ''}`}>

        <div
          className="brand"
          onClick={() => navigate('Home')}
        >
          <div className="brand-icon">
            <GraduationCap/>
          </div>

          <div>
            Skill<span>Sync</span>
            <small>YOUR FUTURE STARTS HERE</small>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          {navigation.map(([name, Icon]) => (
            <button
              key={name}
              className={
                page === name ? 'nav-active' : ''
              }
              onClick={() => navigate(name)}
            >
              <Icon size={19}/>
              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="career-box">
            <Sparkles size={23}/>

            <h4>Build your future</h4>

            <p>
              Discover opportunities that match
              your potential.
            </p>

            <button
              onClick={() => navigate('My Profile')}
            >
              Update profile
              <ArrowRight size={15}/>
            </button>
          </div>

          <small>
            SkillSync · SIH Project Prototype
          </small>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}

      <main className="main">

        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-label="Menu"
          >
            <Menu/>
          </button>

          <div className="breadcrumb">
            Workspace / <b>{page}</b>
          </div>

          <div className="header-actions">
            <button
              className="icon-btn"
              aria-label="Toggle theme"
              onClick={() => setDark(!dark)}
            >
              {dark
                ? <Sun size={21}/>
                : <Moon size={21}/>}
            </button>

            <button
              className="avatar"
              aria-label="My profile"
              onClick={() => navigate('My Profile')}
            >
              {profile.name.charAt(0).toUpperCase() || 'S'}
            </button>
          </div>
        </header>

        <div className="content">

          {/* HOME PAGE */}

          {page === 'Home' && (
            <>
              <section className="hero">
                <div className="hero-copy">

                  <div className="eyebrow">
                    <Sparkles size={15}/>
                    THE FUTURE OF CAREERS
                  </div>

                  <h1>
                    Your skills.<br/>
                    Your ambition.<br/>
                    <span>Your next opportunity.</span>
                  </h1>

                  <p>
                    Bridge the gap between education
                    and industry. Discover internships
                    that match your skills and
                    accelerate your career.
                  </p>

                  <div className="hero-buttons">
                    <button
                      className="primary"
                      onClick={() =>
                        navigate('Explore Internships')
                      }
                    >
                      Explore opportunities
                      <ArrowRight size={18}/>
                    </button>

                    <button
                      className="secondary"
                      onClick={() =>
                        navigate('Dashboard')
                      }
                    >
                      My dashboard
                    </button>
                  </div>
                </div>

                <div className="hero-art">
                  <div className="orbit orbit-one"/>
                  <div className="orbit orbit-two"/>

                  <div className="hero-center">
                    <GraduationCap size={76}/>
                  </div>

                  <div className="floating float-one">
                    <TrendingUp/>
                    Career growth
                  </div>

                  <div className="floating float-two">
                    <CheckCircle/>
                    Smart matching
                  </div>

                  <div className="floating float-three">
                    <Briefcase/>
                    Find your dream role
                  </div>
                </div>
              </section>

              <StatsGrid stats={[
                [Briefcase, jobs.length, 'Demo opportunities'],
                [Building2, companyCount, 'Sample companies'],
                [Bookmark, activeSaved.length, 'Saved internships'],
                [CheckCircle, activeApplied.length, 'Applications']
              ]}/>

              <div className="section-heading">
                <div>
                  <h2>Featured opportunities</h2>
                  <p>Discover your next career move.</p>
                </div>

                <button
                  className="text-btn"
                  onClick={() =>
                    navigate('Explore Internships')
                  }
                >
                  View all
                  <ArrowRight size={17}/>
                </button>
              </div>

              <JobGrid
                items={jobs.slice(0, 3)}
                {...gridProps}
              />

              <div className="section-heading">
                <div>
                  <h2>Accelerate your career</h2>
                  <p>Powerful tools for students and recruiters.</p>
                </div>
              </div>

              <div className="job-grid">

                <article className="job-card">
                  <div className="stat-icon">
                    <Sparkles size={24}/>
                  </div>

                  <h3>Smart résumé analyser</h3>

                  <p className="muted">
                    Upload your résumé, discover your
                    skills and find matching opportunities.
                  </p>

                  <button
                    className="primary"
                    style={{ marginTop: 20 }}
                    onClick={() =>
                      navigate('Résumé Analyzer')
                    }
                  >
                    Analyse résumé
                    <ArrowRight size={16}/>
                  </button>
                </article>

                <article className="job-card">
                  <div className="stat-icon">
                    <Building2 size={24}/>
                  </div>

                  <h3>Recruiter workspace</h3>

                  <p className="muted">
                    Publish internships and manage
                    your candidate pipeline.
                  </p>

                  <button
                    className="primary"
                    style={{ marginTop: 20 }}
                    onClick={() =>
                      navigate('Recruiter Portal')
                    }
                  >
                    Recruiter portal
                    <ArrowRight size={16}/>
                  </button>
                </article>

                <article className="job-card">
                  <div className="stat-icon">
                    <TrendingUp size={24}/>
                  </div>

                  <h3>Personalized recommendations</h3>

                  <p className="muted">
                    Discover opportunities based on
                    your unique skill set.
                  </p>

                  <button
                    className="primary"
                    style={{ marginTop: 20 }}
                    onClick={() =>
                      navigate('Dashboard')
                    }
                  >
                    View recommendations
                    <ArrowRight size={16}/>
                  </button>
                </article>
              </div>
            </>
          )}

          {/* STUDENT DASHBOARD */}

          {page === 'Dashboard' && (
            <>
              <div className="page-heading">
                <h1>
                  Welcome back, {profile.name || 'Student'}!
                </h1>

                <p>
                  Here's your career journey at a glance.
                </p>
              </div>

              <StatsGrid stats={[
                [Briefcase, jobs.length, 'Opportunities'],
                [Bookmark, activeSaved.length, 'Saved'],
                [FileText, activeApplied.length, 'Applications'],
                [Sparkles, `${bestMatch}%`, 'Best skill match']
              ]}/>

              <div className="upgrade-banner">
                <div>
                  <Sparkles size={28}/>

                  <h2>Make your skills work for you.</h2>

                  <p>
                    Analyse your résumé to discover
                    relevant opportunities and skill gaps.
                  </p>
                </div>

                <button
                  className="primary"
                  onClick={() =>
                    navigate('Résumé Analyzer')
                  }
                >
                  Analyse my résumé
                  <ArrowRight size={17}/>
                </button>
              </div>

              <div className="analysis-panel">
                <div className="section-heading"
                  style={{ marginTop: 0 }}>
                  <div>
                    <h2>Your skills</h2>
                    <p>
                      {profileSkills.length} skills
                      added to your profile
                    </p>
                  </div>

                  <button
                    className="text-btn"
                    onClick={() => navigate('My Profile')}
                  >
                    Edit skills
                  </button>
                </div>

                <div className="tags large-tags">
                  {profileSkills.map((skill, index) => (
                    <span key={`${skill}-${index}`}>
                      <CheckCircle size={14}/>
                      {skill}
                    </span>
                  ))}
                </div>

                {!profileSkills.length && (
                  <p className="muted">
                    Add skills to receive better recommendations.
                  </p>
                )}
              </div>

              <div className="analysis-panel">
                <h2>Application overview</h2>

                {[
                  'Submitted',
                  'Under review',
                  'Shortlisted',
                  'Interview',
                  'Accepted',
                  'Rejected'
                ].map(status => {
                  const count = activeApplied.filter(
                    id => (statuses[id] || 'Submitted') === status
                  ).length;

                  const percent = activeApplied.length
                    ? count / activeApplied.length * 100
                    : 0;

                  return (
                    <div key={status}
                      style={{ marginTop: 18 }}>
                      <div className="match-row"
                        style={{ color: 'var(--text)' }}>
                        <span>{status}</span>
                        <strong>{count}</strong>
                      </div>

                      <div className="progress">
                        <div style={{
                          width: `${percent}%`,
                          background: status === 'Rejected'
                            ? '#ef4444'
                            : status === 'Accepted'
                            ? '#16a34a'
                            : '#6655e7'
                        }}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="section-heading">
                <div>
                  <h2>Recommended for you</h2>
                  <p>
                    Based on the skills in your profile.
                  </p>
                </div>
              </div>

              <JobGrid
                items={recommended}
                {...gridProps}
              />
            </>
          )}

          {/* INTERNSHIP EXPLORER */}

          {page === 'Explore Internships' && (
            <>
              <div className="page-heading">
                <h1>Explore internships</h1>

                <p>
                  Find the right opportunity for your skills.
                </p>
              </div>

              <div className="search-bar"
                style={{ flexWrap: 'wrap' }}>
                <Search size={21}/>

                <input
                  placeholder="Search roles, companies or skills..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

                <select
                  aria-label="Work arrangement"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                >
                  {['All', 'Remote', 'Hybrid', 'On-site']
                    .map(option => (
                      <option key={option}>
                        {option}
                      </option>
                    ))}
                </select>

                <select
                  aria-label="Sort internships"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                >
                  {[
                    'Recommended',
                    'Highest stipend',
                    'Newest first'
                  ].map(option => (
                    <option key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <p className="results">
                {sortedJobs.length} opportunities found
              </p>

              {sortedJobs.length ? (
                <JobGrid
                  items={sortedJobs}
                  {...gridProps}
                />
              ) : (
                <div className="empty">
                  <Search size={40}/>

                  <h3>No matching internships</h3>

                  <p>Try a different search or filter.</p>

                  <button
                    className="primary"
                    onClick={() => {
                      setQuery('');
                      setFilter('All');
                      setSort('Recommended');
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* SAVED INTERNSHIPS */}

          {page === 'Saved Internships' && (
            <>
              <div className="page-heading">
                <h1>Saved internships</h1>

                <p>
                  Keep your favourite opportunities
                  in one place.
                </p>
              </div>

              <JobGrid
                items={jobs.filter(job =>
                  activeSaved.includes(job.id)
                )}
                {...gridProps}
              />
            </>
          )}

          {/* APPLICATION TRACKER */}

          {page === 'Applications' && (
            <>
              <div className="page-heading">
                <h1>My applications</h1>

                <p>
                  Track and manage your internship applications.
                </p>
              </div>

              <StatsGrid stats={[
                [FileText, activeApplied.length, 'Total applications'],
                [
                  Clock,
                  activeApplied.filter(id =>
                    ['Submitted', 'Under review'].includes(
                      statuses[id] || 'Submitted'
                    )
                  ).length,
                  'Pending review'
                ],
                [
                  TrendingUp,
                  activeApplied.filter(id =>
                    ['Shortlisted', 'Interview'].includes(
                      statuses[id]
                    )
                  ).length,
                  'In progress'
                ],
                [
                  CheckCircle,
                  activeApplied.filter(id =>
                    statuses[id] === 'Accepted'
                  ).length,
                  'Accepted'
                ]
              ]}/>

              {!activeApplied.length ? (
                <JobGrid items={[]} {...gridProps}/>
              ) : (
                <div className="application-list">

                  {jobs.filter(job =>
                    activeApplied.includes(job.id)
                  ).map(job => (
                    <div
                      className="application-row"
                      key={job.id}
                    >
                      <div
                        className="company-logo"
                        style={{ background: job.color }}
                      >
                        {job.logo}
                      </div>

                      <div>
                        <h3>{job.title}</h3>
                        <p>
                          {job.company} · {job.location}
                        </p>
                      </div>

                      <span
                        className="status"
                        style={
                          statuses[job.id] === 'Rejected'
                            ? {
                                background: '#fee2e2',
                                color: '#b91c1c'
                              }
                            : statuses[job.id] === 'Interview'
                            ? {
                                background: '#e0e7ff',
                                color: '#4338ca'
                              }
                            : undefined
                        }
                      >
                        {statuses[job.id] || 'Submitted'}
                      </span>

                      <button
                        className="secondary small"
                        onClick={() => withdraw(job.id)}
                      >
                        Withdraw
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STUDENT PROFILE */}

          {page === 'My Profile' && (
            <>
              <div className="page-heading">
                <h1>My profile</h1>

                <p>
                  Update your details to improve
                  your skill matches.
                </p>
              </div>

              <form
                className="profile-form"
                onSubmit={e => {
                  e.preventDefault();
                  notify('Profile saved successfully!');
                }}
              >
                <div className="profile-avatar">
                  {profile.name.charAt(0).toUpperCase() || 'S'}
                </div>

                {[
                  ['name', 'Full name'],
                  ['email', 'Email address'],
                  ['college', 'College / University'],
                  ['skills', 'Skills (separated by commas)']
                ].map(([key, label]) => (
                  <label key={key}>
                    {label}

                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      value={profile[key] || ''}
                      required={key === 'name'}
                      onChange={e =>
                        setProfile(old => ({
                          ...old,
                          [key]: e.target.value
                        }))
                      }
                    />
                  </label>
                ))}

                <button className="primary">
                  Save profile
                </button>

                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    navigate('Résumé Analyzer')
                  }
                >
                  <Sparkles size={17}/>
                  Import skills from résumé
                </button>
              </form>
            </>
          )}

          {/* RECRUITER PORTAL */}

          {page === 'Recruiter Portal' && (
            <Recruiter
              jobs={jobs}
              setJobs={updateJobs}
              applied={activeApplied}
              profile={profile}
              statuses={statuses}
              setStatuses={setStatuses}
              notify={notify}
            />
          )}

          {/* RESUME ANALYSER */}

          {page === 'Résumé Analyzer' && (
            <ResumeAnalyzer
              jobs={jobs}
              setProfile={setProfile}
              notify={notify}
            />
          )}

          <footer>
            © 2026 SkillSync · Connecting talent
            with opportunity · Demo data
          </footer>

        </div>
      </main>

      {/* INTERNSHIP DETAILS MODAL */}

      {selected && (
        <div
          className="modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Internship details"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="icon-btn close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X/>
            </button>

            <div
              className="company-logo"
              style={{ background: selected.color }}
            >
              {selected.logo}
            </div>

            <h2>{selected.title}</h2>

            <p>
              {selected.company} · {selected.location}
            </p>

            <div className="detail-row">
              <IndianRupee/>
              {selected.stipend.toLocaleString('en-IN')} / month
            </div>

            <div className="detail-row">
              <Clock/>
              {selected.duration}
            </div>

            <div className="detail-row">
              <Briefcase/>
              {selected.type}
            </div>

            <h3>Required skills</h3>

            <div className="tags">
              {selected.skills.map((skill, index) => (
                <span key={`${skill}-${index}`}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="match-row">
              <span>
                <Sparkles size={16}/>
                Your skill compatibility
              </span>

              <strong>{match(selected)}%</strong>
            </div>

            <div className="progress">
              <div style={{
                width: `${match(selected)}%`
              }}/>
            </div>

            <h3>Skills to improve</h3>

            <div className="tags">
              {selected.skills.filter(skill =>
                !profileSkills.some(existing =>
                  existing.toLowerCase() === skill.toLowerCase()
                )
              ).map((skill, index) => (
                <span key={`${skill}-${index}`}>
                  {skill}
                </span>
              ))}

              {match(selected) === 100 && (
                <span>All required skills matched!</span>
              )}
            </div>

            <p className="muted">
              This is a demonstration listing,
              not a verified live vacancy.
            </p>

            <button
              className="primary"
              disabled={activeApplied.includes(selected.id)}
              onClick={() => apply(selected.id)}
            >
              {activeApplied.includes(selected.id)
                ? 'Already applied'
                : 'Apply now'}
            </button>

            <button
              className="secondary"
              onClick={() => toggleSave(selected.id)}
            >
              <Bookmark size={17}/>

              {activeSaved.includes(selected.id)
                ? 'Remove from saved'
                : 'Save internship'}
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}

      {toast && (
        <div className="toast" role="status">
          <CheckCircle size={21}/>
          {toast}
        </div>
      )}

    </div>
  );
}
