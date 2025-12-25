import React, { useState } from 'react';
import { FaTimes, FaClock, FaRedo, FaRandom, FaList, FaEye, FaShieldAlt, FaCalendarCheck, FaBell, FaSave, FaTimes as FaCancel } from 'react-icons/fa';

export default function SettingsDrawer({ open, onClose }) {
  const [settings, setSettings] = useState({
    timeLimit: '',
    maxAttempts: 1,
    shuffleQuestions: false,
    shuffleOptions: false,
    showResults: false,
    plagiarismCheck: false,
    lateSubmission: false,
    notifications: true
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="absolute right-0 top-0 h-full w-96 glass-card rounded-l-3xl shadow-2xl transform transition-all duration-500 ease-out translate-x-0">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-600/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
              <FaTimes className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Assignment Settings</h2>
              <p className="text-gray-400 text-sm">Configure your assignment preferences</p>
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
          <div className="space-y-8">
            {/* Time Limit */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaClock className="text-blue-400 text-lg" />
                <label className="text-lg font-semibold text-white">Time Limit (minutes)</label>
              </div>
              <input
                type="number"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="No limit"
                value={settings.timeLimit}
                onChange={(e) => setSettings(prev => ({ ...prev, timeLimit: e.target.value }))}
                min="1"
              />
              <p className="text-xs text-gray-400 mt-2">Leave empty for no time limit</p>
            </div>

            {/* Max Attempts */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaRedo className="text-green-400 text-lg" />
                <label className="text-lg font-semibold text-white">Maximum Attempts</label>
              </div>
              <select
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                value={settings.maxAttempts}
                onChange={(e) => setSettings(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
              >
                <option value={1} className="bg-slate-800 text-white">1 attempt</option>
                <option value={2} className="bg-slate-800 text-white">2 attempts</option>
                <option value={3} className="bg-slate-800 text-white">3 attempts</option>
                <option value={5} className="bg-slate-800 text-white">5 attempts</option>
                <option value={10} className="bg-slate-800 text-white">10 attempts</option>
                <option value={-1} className="bg-slate-800 text-white">Unlimited attempts</option>
              </select>
            </div>

            {/* Question Settings */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <FaList className="text-purple-400 text-lg" />
                <h3 className="text-lg font-semibold text-white">Question Settings</h3>
              </div>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.shuffleQuestions}
                    onChange={(e) => setSettings(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
                    className="w-5 h-5 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Shuffle question order</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.shuffleOptions}
                    onChange={(e) => setSettings(prev => ({ ...prev, shuffleOptions: e.target.checked }))}
                    className="w-5 h-5 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Shuffle answer options</span>
                </label>
              </div>
            </div>

            {/* Results & Feedback */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <FaEye className="text-cyan-400 text-lg" />
                <h3 className="text-lg font-semibold text-white">Results & Feedback</h3>
              </div>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.showResults}
                    onChange={(e) => setSettings(prev => ({ ...prev, showResults: e.target.checked }))}
                    className="w-5 h-5 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Show results immediately after submission</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.plagiarismCheck}
                    onChange={(e) => setSettings(prev => ({ ...prev, plagiarismCheck: e.target.checked }))}
                    className="w-5 h-5 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Enable plagiarism detection</span>
                </label>
              </div>
            </div>

            {/* Submission Settings */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <FaBell className="text-yellow-400 text-lg" />
                <h3 className="text-lg font-semibold text-white">Submission Settings</h3>
              </div>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.lateSubmission}
                    onChange={(e) => setSettings(prev => ({ ...prev, lateSubmission: e.target.checked }))}
                    className="w-5 h-5 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Allow late submissions</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                    className="w-5 h-5 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Send email notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-600/50 p-8 bg-slate-900/50">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-700/50 text-gray-300 rounded-xl hover:bg-slate-600/50 hover:text-white transition-all duration-300 border border-slate-600/50"
            >
              <FaCancel className="text-sm" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-xl hover:shadow-xl hover:shadow-primary-500/25 hover:scale-105 transition-all duration-300"
            >
              <FaSave className="text-sm" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
