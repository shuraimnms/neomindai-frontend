import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import SettingsPanel from './SettingsPanel';
import PreviewModal from './PreviewModal';
import '../../styles/assignment-builder.css';

export default function AssignmentForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    // scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const addQuestion = () => {
    const q = { id: `q_${Date.now()}`, type: 'mcq_single', title: '', description: '', marks: 1, options: [{ id: `o_${Date.now()}`, text: '' }, { id: `o2_${Date.now()}`, text: '' }] };
    setQuestions(prev => [...prev, q]);
  };

  return (
    <div className="ab-page">
      <header className="ab-header">
        <div className="ab-title">Create Assignment</div>
        <div className="ab-actions">
          <button className="btn btn-outline" onClick={() => setPreviewOpen(true)}>Preview</button>
          <button className="btn btn-muted">Save Draft</button>
          <button className="btn btn-primary">Publish Assignment</button>
        </div>
      </header>

      <div className="ab-layout">
        <aside className="ab-sidebar">{/* Admin nav placeholder */}</aside>

        <main className="ab-main">
          <section className="card meta-card">
            <label className="field-label">Assignment Title</label>
            <input className="input large" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter assignment title" />

            <label className="field-label">Description</label>
            <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" />
          </section>

          <section className="card questions-card">
            <div className="card-header">
              <h3>Questions</h3>
              <div className="total-marks">Total: 0</div>
            </div>

            <div className="question-list">
              {questions.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </div>

            <div className="floating-add">
              <button className="fab" onClick={addQuestion}>+ Add Question</button>
            </div>
          </section>
        </main>

        <aside className="ab-right">
          <SettingsPanel />
        </aside>
      </div>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} questions={questions} title={title} />
    </div>
  );
}
