
import { useState } from 'react';
import { UploadCloud, FileText, Sparkles, CheckCircle,
  Target, AlertCircle } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const skillBank = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'HTML',
  'CSS', 'Java', 'C++', 'SQL', 'Git', 'GitHub', 'Excel',
  'Figma', 'Design', 'Node.js', 'Flask', 'Django',
  'MongoDB', 'Docker', 'AWS', 'Machine Learning',
  'Data Analysis', 'Communication', 'Leadership',
  'Power BI', 'Tableau', 'Linux', 'REST API'
];

export default function ResumeAnalyzer({
  jobs, setProfile, notify
}) {
  const [fileName, setFileName] = useState('');
  const [text, setText] = useState('');
  const [skills, setSkills] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function readResume(file) {
    if (!file) return;
    setError('');
    setText('');
    setSkills([]);

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Please choose a PDF smaller than 10 MB.');
      return;
    }

    setBusy(true);
    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      let extracted = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        extracted += content.items.map(
          item => item.str || ''
        ).join(' ') + '\n';
      }

      if (!extracted.trim()) {
        throw new Error('No readable text found. Use a text-based PDF instead of a scanned image.');
      }

      const lower = extracted.toLowerCase();

      const detected = skillBank.filter(skill => {
        const escaped = skill.toLowerCase()
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(
          `(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, 'i'
        ).test(lower);
      });

      setText(extracted);
      setSkills(detected);
      notify('Résumé analysed successfully!');
    } catch (err) {
      setError(err.message || 'Unable to read this PDF.');
    } finally {
      setBusy(false);
    }
  }

  const matches = jobs.map(job => {
    const missing = job.skills.filter(s =>
      !skills.some(found => found.toLowerCase() === s.toLowerCase())
    );

    return {
      ...job,
      missing,
      score: Math.round(
        (job.skills.length - missing.length) /
        job.skills.length * 100
      )
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <>
      <div className="page-heading">
        <h1>Smart résumé analyser</h1>
        <p>Understand your strengths and discover your skill gaps.</p>
      </div>

      <div className="upgrade-banner">
        <div>
          <Sparkles size={30}/>
          <h2>Unlock your career potential.</h2>
          <p>Turn your résumé into actionable career insights.</p>
        </div>
      </div>

      <label className="upload-zone"
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          if (!busy) readResume(e.dataTransfer.files[0]);
        }}>
        <UploadCloud size={48}/>
        <h2>{busy ? 'Analysing your résumé...' : 'Upload your résumé'}</h2>
        <p>Drag and drop or click to browse</p>
        <span className="primary">Choose PDF file</span>
        <small>PDF documents only · Maximum 10 MB</small>
        <input type="file" accept=".pdf"
          disabled={busy}
          onChange={e => readResume(e.target.files[0])}/>
      </label>

      {error && (
        <div className="error-message">
          <AlertCircle size={20}/>{error}
        </div>
      )}

      {text && <>
        <div className="section-heading">
          <div>
            <h2>Analysis results</h2>
            <p>{fileName}</p>
          </div>
        </div>

        <div className="stats-grid">
          {[
            [Sparkles, skills.length, 'Detected skills'],
            [Target, `${matches[0]?.score || 0}%`, 'Best job match'],
            [FileText, text.trim().split(/\s+/).length, 'Words extracted']
          ].map(([Icon, value, label]) => (
            <div className="stat-card" key={label}>
              <div className="stat-icon"><Icon/></div>
              <div><h2>{value}</h2><p>{label}</p></div>
            </div>
          ))}
        </div>

        <div className="analysis-panel">
          <h2>Detected skills</h2>
          <div className="tags large-tags">
            {skills.map(skill => (
              <span key={skill}>
                <CheckCircle size={14}/>{skill}
              </span>
            ))}
          </div>

          {!skills.length && (
            <p>No supported skill keywords were detected.</p>
          )}

          <button className="primary"
            disabled={!skills.length}
            onClick={() => {
              setProfile(old => ({
                ...old,
                skills: [...new Set([
                  ...old.skills.split(',').map(s => s.trim()).filter(Boolean),
                  ...skills
                ])].join(', ')
              }));
              notify('Detected skills added to your profile!');
            }}>
            Add skills to my profile
          </button>
        </div>

        <div className="section-heading">
          <div>
            <h2>Personalized career recommendations</h2>
            <p>Based on skills detected in your résumé.</p>
          </div>
        </div>

        <div className="job-grid">
          {matches.slice(0, 3).map(job => (
            <article className="job-card" key={job.id}>
              <div className="company-logo"
                style={{background: job.color}}>{job.logo}</div>
              <h3>{job.title}</h3>
              <p className="muted">{job.company}</p>
              <div className="match-row" style={{marginTop: 20}}>
                <span>Skill compatibility</span>
                <strong>{job.score}%</strong>
              </div>
              <div className="progress">
                <div style={{width: `${job.score}%`}}/>
              </div>
              <h4 style={{marginTop: 20}}>Skills to improve</h4>
              <div className="tags">
                {job.missing.length
                  ? job.missing.map(s => <span key={s}>{s}</span>)
                  : <span>All required skills detected!</span>}
              </div>
            </article>
          ))}
        </div>

        <details className="analysis-panel">
          <summary>View extracted résumé text</summary>
          <pre className="resume-text">{text}</pre>
        </details>
      </>}

      <p className="privacy-note">
        Your résumé is processed locally in your browser.
        Skill matching uses keyword detection, not an AI model
        or a professional ATS assessment.
      </p>
    </>
  );
}
