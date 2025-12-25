import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import SettingsDrawer from './SettingsDrawer';
import PreviewModal from './PreviewModal';
import { FaPlus, FaCog, FaEye, FaSave, FaRocket, FaCalendarAlt, FaUsers, FaClipboardList, FaFileAlt, FaPen, FaUpload } from 'react-icons/fa';

const sampleQuestion = (id) => ({
  id,
  title: '',
  description: '',
  type: 'mcq_single',
  options: [{ id: 'o1', text: '' }, { id: 'o2', text: '' }],
  marks: 1,
  correct_answer: null,
  allowed_file_types: null,
  max_file_size: null
});

export default function AssignmentBuilder({ initialData, students, onSubmit, loading, isEdit }) {
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'draft',
    questions: [sampleQuestion('q1')],
    recipients: []
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAssignment({
        title: initialData.title || '',
        description: initialData.description || '',
        due_date: initialData.due_date || '',
        status: initialData.status || 'draft',
        questions: initialData.questions?.length > 0 ? initialData.questions : [sampleQuestion('q1')],
        recipients: initialData.recipients || []
      });
    }
  }, [initialData]);

  function addQuestion(type = 'mcq_single') {
    const id = `q${Date.now()}`;
    setAssignment(prev => ({
      ...prev,
      questions: [...prev.questions, { ...sampleQuestion(id), type }]
    }));
  }

  function duplicateQuestion(idx) {
    setAssignment(prev => {
      const copy = [...prev.questions];
      const base = copy[idx];
      const dup = { ...JSON.parse(JSON.stringify(base)), id: `q${Date.now()}` };
      copy.splice(idx + 1, 0, dup);
      return { ...prev, questions: copy };
    });
  }

  function removeQuestion(idx) {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  }

  function updateQuestion(idx, updatedQuestion) {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === idx ? updatedQuestion : q)
    }));
  }

  function handleSave() {
    // Validate assignment data
    if (!assignment.title.trim()) {
      alert('Please enter assignment title');
      return;
    }

    if (!assignment.due_date) {
      alert('Please set a due date');
      return;
    }

    if (assignment.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Validate questions
    for (let i = 0; i < assignment.questions.length; i++) {
      const q = assignment.questions[i];
      if (!q.title.trim()) {
        alert(`Please enter title for question ${i + 1}`);
        return;
      }

      if (['mcq_single', 'mcq_multiple'].includes(q.type)) {
        if (!q.options || q.options.length < 2) {
          alert(`Question ${i + 1} must have at least 2 options`);
          return;
        }
        if (!q.correct_answer || q.correct_answer.length === 0) {
          alert(`Please select correct answer for question ${i + 1}`);
          return;
        }
      } else if (q.type === 'true_false') {
        if (q.correct_answer === null) {
          alert(`Please select correct answer for question ${i + 1}`);
          return;
        }
      }
    }

    onSubmit(assignment);
  }

  function handlePublish() {
    setAssignment(prev => ({ ...prev, status: 'published' }));
    handleSave();
  }

  return (
    <div className="space-y-8">
      {/* Action Buttons Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 glass-card rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl">
            <FaClipboardList className="text-xl text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEdit ? 'Edit Assignment' : 'Create Assignment'}
            </h2>
            <p className="text-gray-400 text-sm">Build engaging assignments for your students</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <FaEye className="relative z-10 text-lg" />
            <span className="relative z-10 font-medium">Preview</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl hover:shadow-xl hover:shadow-slate-500/25 hover:scale-105 transition-all duration-300 overflow-hidden border border-slate-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <FaCog className="relative z-10 text-lg group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative z-10 font-medium">Settings</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            <FaSave />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            <FaRocket />
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* Assignment Settings */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <FaCog className="text-xl text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Assignment Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
              <FaCalendarAlt className="text-primary-400" />
              <span>Due Date</span>
            </label>
            <input
              type="datetime-local"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
              value={assignment.due_date}
              onChange={(e) => setAssignment(prev => ({ ...prev, due_date: e.target.value }))}
              placeholder="dd-mm-yyyy --:--"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
              <FaUsers className="text-primary-400" />
              <span>Recipients</span>
            </label>
            <select
              multiple
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 h-32"
              value={assignment.recipients}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setAssignment(prev => ({ ...prev, recipients: selected }));
              }}
            >
              {students.map(student => (
                <option key={student.id} value={student.id} className="bg-slate-800 text-white">
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Hold Ctrl/Cmd to select multiple students
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-3">
          <input
            type="checkbox"
            id="status"
            checked={assignment.status === 'published'}
            onChange={(e) => setAssignment(prev => ({ ...prev, status: e.target.checked ? 'published' : 'draft' }))}
            className="w-4 h-4 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
          />
          <label htmlFor="status" className="text-sm text-gray-300 cursor-pointer">
            Publish assignment immediately
          </label>
        </div>
      </div>

      {/* Assignment Basics */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            <FaFileAlt className="text-xl text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Assignment Basics</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Assignment title
            </label>
            <input
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
              placeholder="Enter assignment title"
              value={assignment.title}
              onChange={(e) => setAssignment(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Description (optional)
            </label>
            <textarea
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-none"
              rows={4}
              placeholder="Enter assignment description"
              value={assignment.description}
              onChange={(e) => setAssignment(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <FaClipboardList className="text-xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Questions</h3>
              <p className="text-gray-400 text-sm">({assignment.questions.length}) questions added</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addQuestion('mcq_single')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FaPlus className="text-sm" />
              <span>MCQ</span>
            </button>

            <button
              onClick={() => addQuestion('short_answer')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FaPen className="text-sm" />
              <span>Short Answer</span>
            </button>

            <button
              onClick={() => addQuestion('long_answer')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FaFileAlt className="text-sm" />
              <span>Long Answer</span>
            </button>

            <button
              onClick={() => addQuestion('file_upload')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FaUpload className="text-sm" />
              <span>File Upload</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {assignment.questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              index={idx}
              question={q}
              onDuplicate={() => duplicateQuestion(idx)}
              onDelete={() => removeQuestion(idx)}
              onUpdate={(updated) => updateQuestion(idx, updated)}
            />
          ))}
        </div>

        {assignment.questions.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-800/30 rounded-2xl inline-block mb-4">
              <FaClipboardList className="text-4xl text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-300 mb-2">No questions yet</h4>
            <p className="text-gray-400">Add your first question to get started</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => addQuestion('mcq_single')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-primary-500/25 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        title="Add Question"
      >
        <FaPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <SettingsDrawer open={showSettings} onClose={() => setShowSettings(false)} />
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} assignment={assignment} />
    </div>
  );
}
