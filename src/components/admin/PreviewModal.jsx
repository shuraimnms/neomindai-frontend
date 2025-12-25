import React from 'react';
import { FaTimes, FaEye, FaCalendarAlt, FaClock, FaFileAlt, FaCheckCircle, FaCircle } from 'react-icons/fa';

export default function PreviewModal({ open, onClose, assignment }) {
  if (!open) return null;

  const renderQuestionPreview = (question, index) => {
    const renderOptions = () => {
      if (!['mcq_single', 'mcq_multiple'].includes(question.type)) return null;

      return (
        <div className="space-y-3">
          {question.options?.map((option, optIndex) => (
            <div key={option.id} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors duration-300">
              <input
                type={question.type === 'mcq_single' ? 'radio' : 'checkbox'}
                name={`q${question.id}`}
                disabled
                className="w-5 h-5 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
              />
              <span className="text-gray-300 hover:text-white transition-colors duration-300">{option.text || `Option ${optIndex + 1}`}</span>
            </div>
          ))}
        </div>
      );
    };

    const renderTrueFalse = () => {
      if (question.type !== 'true_false') return null;

      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors duration-300">
            <input type="radio" name={`tf${question.id}`} disabled className="w-5 h-5 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2" />
            <span className="text-gray-300 hover:text-white transition-colors duration-300">True</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors duration-300">
            <input type="radio" name={`tf${question.id}`} disabled className="w-5 h-5 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2" />
            <span className="text-gray-300 hover:text-white transition-colors duration-300">False</span>
          </div>
        </div>
      );
    };

    const renderTextInput = () => {
      if (!['short_answer', 'long_answer'].includes(question.type)) return null;

      return (
        <div className="mt-3">
          <textarea
            className="w-full p-3 border rounded resize-none"
            rows={question.type === 'short_answer' ? 2 : 4}
            placeholder="Student answer will appear here..."
            disabled
          />
        </div>
      );
    };

    const renderFileUpload = () => {
      if (question.type !== 'file_upload') return null;

      return (
        <div className="mt-4">
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center bg-slate-800/30 hover:bg-slate-700/30 transition-colors duration-300">
            <div className="text-gray-400">
              <FaFileAlt className="text-3xl mx-auto mb-2 text-slate-500" />
              <p className="font-medium mb-1">File upload area</p>
              {question.allowed_file_types && (
                <div className="text-xs text-gray-500 mt-2">
                  Allowed: {question.allowed_file_types.join(', ')}
                  {question.max_file_size && ` (Max: ${question.max_file_size}MB)`}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div key={question.id} className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <FaCircle className="text-white text-sm" />
            </div>
            <h3 className="text-xl font-bold text-white">Question {index + 1}</h3>
          </div>
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-xl font-medium text-sm">
            {question.marks} mark{question.marks !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold text-white mb-2">{question.title || `Question ${index + 1} title`}</p>
          {question.description && (
            <p className="text-gray-300 text-sm leading-relaxed">{question.description}</p>
          )}
        </div>

        {renderOptions()}
        {renderTrueFalse()}
        {renderTextInput()}
        {renderFileUpload()}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="absolute inset-4 glass-card rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-600/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
              <FaEye className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Assignment Preview</h2>
              <p className="text-gray-400 text-sm">Review your assignment before publishing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Assignment Header */}
            <div className="glass-card rounded-2xl p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-3">
                    {assignment.title || 'Assignment Title'}
                  </h1>
                  {assignment.description && (
                    <p className="text-gray-300 text-lg leading-relaxed">{assignment.description}</p>
                  )}
                </div>
                <div className="ml-6 flex flex-col space-y-3">
                  {assignment.due_date && (
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-xl">
                      <FaCalendarAlt className="text-white" />
                      <span className="text-white font-medium text-sm">
                        Due: {new Date(assignment.due_date).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-xl">
                    <FaClock className="text-white" />
                    <span className="text-white font-medium text-sm">
                      {assignment.questions?.length || 0} Questions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {assignment.questions?.map((question, index) =>
                renderQuestionPreview(question, index)
              )}

              {(!assignment.questions || assignment.questions.length === 0) && (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <FaFileAlt className="text-6xl text-gray-500 mx-auto mb-4" />
                  <p className="text-xl text-gray-400 font-medium mb-2">No questions added yet</p>
                  <p className="text-gray-500">Add questions to see the preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-600/50 p-8 bg-slate-900/50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-700/50 text-gray-300 rounded-xl hover:bg-slate-600/50 hover:text-white transition-all duration-300 border border-slate-600/50"
            >
              <FaTimes className="text-sm" />
              <span>Close Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
