import React, { useState, useEffect } from 'react';
import { FaCopy, FaTrash, FaPlus, FaCheck, FaFileAlt, FaPen, FaList, FaUpload, FaStar } from 'react-icons/fa';

export default function QuestionCard({ question, index, onDuplicate, onDelete, onUpdate }) {
  const [localQuestion, setLocalQuestion] = useState(question);

  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const updateQuestion = (updates) => {
    const newQuestion = { ...localQuestion, ...updates };
    setLocalQuestion(newQuestion);
    onUpdate(newQuestion);
  };

  const addOption = () => {
    const newOptions = [...localQuestion.options, { id: `o${Date.now()}`, text: '' }];
    updateQuestion({ options: newOptions });
  };

  const updateOption = (optionIndex, text) => {
    const newOptions = localQuestion.options.map((opt, i) =>
      i === optionIndex ? { ...opt, text } : opt
    );
    updateQuestion({ options: newOptions });
  };

  const removeOption = (optionIndex) => {
    if (localQuestion.options.length <= 2) return; // Keep at least 2 options
    const newOptions = localQuestion.options.filter((_, i) => i !== optionIndex);
    updateQuestion({ options: newOptions });
  };

  const renderOptions = () => {
    if (!['mcq_single', 'mcq_multiple'].includes(localQuestion.type)) return null;

    return (
      <div className="options-section mt-4">
        <label className="block text-sm font-medium mb-2">Options:</label>
        {localQuestion.options.map((option, optIndex) => (
          <div key={option.id} className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              name={`correct-${localQuestion.id}`}
              className="w-4 h-4"
              checked={localQuestion.correct_answer?.includes(option.id)}
              onChange={() => updateQuestion({
                correct_answer: localQuestion.type === 'mcq_single' ? [option.id] : [option.id]
              })}
            />
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              placeholder={`Option ${optIndex + 1}`}
              value={option.text}
              onChange={(e) => updateOption(optIndex, e.target.value)}
            />
            {localQuestion.options.length > 2 && (
              <button
                onClick={() => removeOption(optIndex)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addOption}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          + Add Option
        </button>
      </div>
    );
  };

  const renderTrueFalse = () => {
    if (localQuestion.type !== 'true_false') return null;

    return (
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Correct Answer:</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name={`tf-${localQuestion.id}`}
              value="true"
              checked={localQuestion.correct_answer === true}
              onChange={() => updateQuestion({ correct_answer: true })}
              className="mr-2"
            />
            True
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={`tf-${localQuestion.id}`}
              value="false"
              checked={localQuestion.correct_answer === false}
              onChange={() => updateQuestion({ correct_answer: false })}
              className="mr-2"
            />
            False
          </label>
        </div>
      </div>
    );
  };

  const renderFileUpload = () => {
    if (localQuestion.type !== 'file_upload') return null;

    return (
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">File Upload Settings:</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1">Allowed Types:</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-sm"
              placeholder="pdf,doc,docx,txt"
              value={localQuestion.allowed_file_types?.join(',') || ''}
              onChange={(e) => updateQuestion({
                allowed_file_types: e.target.value.split(',').map(t => t.trim())
              })}
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Max Size (MB):</label>
            <input
              type="number"
              className="w-full p-2 border rounded text-sm"
              placeholder="10"
              value={localQuestion.max_file_size || ''}
              onChange={(e) => updateQuestion({ max_file_size: parseInt(e.target.value) || null })}
            />
          </div>
        </div>
      </div>
    );
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'mcq_single':
      case 'mcq_multiple':
        return <FaList className="text-blue-400" />;
      case 'true_false':
        return <FaCheck className="text-green-400" />;
      case 'short_answer':
        return <FaPen className="text-purple-400" />;
      case 'long_answer':
        return <FaFileAlt className="text-orange-400" />;
      case 'file_upload':
        return <FaUpload className="text-pink-400" />;
      default:
        return <FaList className="text-gray-400" />;
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'mcq_single':
        return 'MCQ (Single Choice)';
      case 'mcq_multiple':
        return 'MCQ (Multiple Choice)';
      case 'true_false':
        return 'True / False';
      case 'short_answer':
        return 'Short Answer';
      case 'long_answer':
        return 'Long Answer';
      case 'file_upload':
        return 'File Upload';
      default:
        return type;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 border border-slate-600/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl">
            <span className="text-white font-bold text-lg">Q{index + 1}</span>
          </div>
          <div className="flex items-center space-x-2">
            {getQuestionTypeIcon(localQuestion.type)}
            <span className="text-sm text-gray-400 font-medium">
              {getQuestionTypeLabel(localQuestion.type)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onDuplicate}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
            title="Duplicate Question"
          >
            <FaCopy className="text-sm" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            title="Delete Question"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>

      {/* Question Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Question Title
        </label>
        <input
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
          placeholder={`Enter question ${index + 1} title`}
          value={localQuestion.title}
          onChange={(e) => updateQuestion({ title: e.target.value })}
        />
      </div>

      {/* Question Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Question Type
        </label>
        <select
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
          value={localQuestion.type}
          onChange={(e) => updateQuestion({ type: e.target.value })}
        >
          <option value="mcq_single" className="bg-slate-800 text-white">MCQ (Single Choice)</option>
          <option value="mcq_multiple" className="bg-slate-800 text-white">MCQ (Multiple Choice)</option>
          <option value="true_false" className="bg-slate-800 text-white">True / False</option>
          <option value="short_answer" className="bg-slate-800 text-white">Short Answer</option>
          <option value="long_answer" className="bg-slate-800 text-white">Long Answer</option>
          <option value="file_upload" className="bg-slate-800 text-white">File Upload</option>
        </select>
      </div>

      {/* Options for MCQ */}
      {['mcq_single', 'mcq_multiple'].includes(localQuestion.type) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-300">Options</label>
            <button
              onClick={addOption}
              className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm"
            >
              <FaPlus className="text-xs" />
              <span>Add Option</span>
            </button>
          </div>

          <div className="space-y-3">
            {localQuestion.options.map((option, optIndex) => (
              <div key={option.id} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`correct-${localQuestion.id}`}
                  className="w-4 h-4 text-primary-600 bg-slate-800 border-slate-600 focus:ring-primary-500 focus:ring-2"
                  checked={localQuestion.correct_answer?.includes(option.id)}
                  onChange={() => updateQuestion({
                    correct_answer: localQuestion.type === 'mcq_single' ? [option.id] : [option.id]
                  })}
                />
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder={`Option ${optIndex + 1}`}
                  value={option.text}
                  onChange={(e) => updateOption(optIndex, e.target.value)}
                />
                {localQuestion.options.length > 2 && (
                  <button
                    onClick={() => removeOption(optIndex)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    title="Remove Option"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* True/False Options */}
      {localQuestion.type === 'true_false' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Correct Answer
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={`tf-${localQuestion.id}`}
                value="true"
                checked={localQuestion.correct_answer === true}
                onChange={() => updateQuestion({ correct_answer: true })}
                className="w-4 h-4 text-primary-600 bg-slate-800 border-slate-600 focus:ring-primary-500 focus:ring-2"
              />
              <span className="text-white">True</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={`tf-${localQuestion.id}`}
                value="false"
                checked={localQuestion.correct_answer === false}
                onChange={() => updateQuestion({ correct_answer: false })}
                className="w-4 h-4 text-primary-600 bg-slate-800 border-slate-600 focus:ring-primary-500 focus:ring-2"
              />
              <span className="text-white">False</span>
            </label>
          </div>
        </div>
      )}

      {/* File Upload Settings */}
      {localQuestion.type === 'file_upload' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-4">
            File Upload Settings
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Allowed File Types</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 text-sm"
                placeholder="pdf,doc,docx,txt"
                value={localQuestion.allowed_file_types?.join(',') || ''}
                onChange={(e) => updateQuestion({
                  allowed_file_types: e.target.value.split(',').map(t => t.trim())
                })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Max File Size (MB)</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 text-sm"
                placeholder="10"
                value={localQuestion.max_file_size || ''}
                onChange={(e) => updateQuestion({ max_file_size: parseInt(e.target.value) || null })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-600/50">
        <div className="flex items-center space-x-3">
          <FaStar className="text-yellow-400 text-sm" />
          <span className="text-sm text-gray-400">Marks:</span>
          <input
            type="number"
            className="w-16 px-2 py-1 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-center focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
            value={localQuestion.marks}
            onChange={(e) => updateQuestion({ marks: parseInt(e.target.value) || 1 })}
            min="1"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>Type:</span>
          <span className="text-primary-400 font-medium">
            {localQuestion.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
