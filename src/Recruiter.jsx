
import { useState } from 'react';
import { Building2, Plus, Users, Briefcase, Trash2 } from 'lucide-react';

const initialForm = {
  company: '',
  title: '',
  location: '',
  type: 'Remote',
  stipend: '',
  duration: '3 months',
  skills: ''
};

export default function Recruiter({
  jobs, setJobs, applied, profile, statuses, setStatuses, notify
}) {
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);

  const posted = jobs.filter(j => j.custom);

  function publish(e) {
    e.preventDefault();

    const job = {
      ...form,
      id: Date.now(),
      logo: form.company.trim().charAt(0).toUpperCase(),
      color: '#6655e7',
      stipend: Number(form.stipend),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      custom: true
    };

    if (!job.skills.length) {
      notify('Please enter at least one skill.');
      return;
    }

    setJobs(old => [...old, job]);
    setForm(initialForm);
    setShowForm(false);
    notify('Internship published successfully!');
  }

  return (
    <>
      <div className="page-heading">
        <h1>Recruiter workspace</h1>
        <p>Discover talent and manage your hiring pipeline.</p>
      </div>

      <div className="upgrade-banner">
        <div>
          <Building2 size={30}/>
          <h2>Find your next great hire.</h2>
          <p>Connect with talented students and future professionals.</p>
        </div>
        <button className="primary"
          onClick={() => setShowForm(!showForm)}>
          <Plus size={18}/>
          {showForm ? 'Close form' : 'Post internship'}
        </button>
      </div>

      <div className="stats-grid">
        {[
          [Briefcase, posted.length, 'Your listings'],
          [Users, applied.length, 'Demo applications'],
          [Users, applied.filter(id => statuses[id] === 'Shortlisted').length, 'Shortlisted'],
          [Building2, jobs.length, 'Total opportunities']
        ].map(([Icon, value, label]) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon"><Icon size={22}/></div>
            <div><h2>{value}</h2><p>{label}</p></div>
          </div>
        ))}
      </div>

      {showForm && (
        <form className="profile-form wide-form" onSubmit={publish}>
          <h2>Create an internship</h2>
          <div className="form-grid">
            {[
              ['company', 'Company name'],
              ['title', 'Internship title'],
              ['location', 'Location'],
              ['stipend', 'Monthly stipend (₹)'],
              ['duration', 'Duration'],
              ['skills', 'Required skills (comma separated)']
            ].map(([key, label]) => (
              <label key={key}>{label}
                <input required
                  type={key === 'stipend' ? 'number' : 'text'}
                  min={key === 'stipend' ? 0 : undefined}
                  value={form[key]}
                  onChange={e => setForm(old => ({
                    ...old, [key]: e.target.value
                  }))}/>
              </label>
            ))}
            <label>Work arrangement
              <select value={form.type}
                onChange={e => setForm(old => ({
                  ...old, type: e.target.value
                }))}>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </label>
          </div>
          <button className="primary">Publish internship</button>
        </form>
      )}

      <div className="section-heading">
        <div>
          <h2>Your internship listings</h2>
          <p>Manage your published opportunities.</p>
        </div>
      </div>

      <div className="application-list">
        {!posted.length && (
          <div className="empty">
            <Briefcase size={35}/>
            <h3>No internships posted yet</h3>
            <button className="primary"
              onClick={() => setShowForm(true)}>
              Create your first listing
            </button>
          </div>
        )}

        {posted.map(job => (
          <div className="application-row" key={job.id}>
            <div className="company-logo"
              style={{background: job.color}}>{job.logo}</div>
            <div>
              <h3>{job.title}</h3>
              <p>{job.company} · {job.location}</p>
            </div>
            <span className="status">Published</span>
            <button className="icon-btn"
              aria-label="Delete listing"
              onClick={() => {
                if (applied.includes(job.id)) {
                  notify('Cannot delete a listing with applications.');
                  return;
                }
                if (window.confirm('Delete this internship?')) {
                  setJobs(old => old.filter(j => j.id !== job.id));
                  notify('Listing deleted');
                }
              }}>
              <Trash2 size={19}/>
            </button>
          </div>
        ))}
      </div>

      <div className="section-heading">
        <div>
          <h2>Applicant management</h2>
          <p>Review candidates and update their application status.</p>
        </div>
      </div>

      <div className="application-list">
        {!applied.length && (
          <div className="empty">
            <Users size={35}/>
            <h3>No applications yet</h3>
            <p>Submitted applications will appear here.</p>
          </div>
        )}

        {jobs.filter(j => applied.includes(j.id)).map(job => (
          <div className="application-row" key={job.id}>
            <div className="avatar">
              {profile.name.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h3>{profile.name}</h3>
              <p>{job.title} · {profile.college || 'Student'}</p>
              <p>{profile.skills}</p>
            </div>
            <select className="status-select"
              value={statuses[job.id] || 'Submitted'}
              onChange={e => {
                const status = e.target.value;
                setStatuses(old => ({
                  ...old, [job.id]: status
                }));
                notify('Application status updated');
              }}>
              {['Submitted', 'Under review', 'Shortlisted',
                'Interview', 'Accepted', 'Rejected'].map(s =>
                <option key={s}>{s}</option>
              )}
            </select>
          </div>
        ))}
      </div>
    </>
  );
}
