import React from 'react';

export default function SettingsPanel() {
  return (
    <div className="settings-panel card">
      <h4>Assignment Settings</h4>
      <label className="field-label">Start date & time</label>
      <input type="datetime-local" className="input" />

      <label className="field-label">Due date & time</label>
      <input type="datetime-local" className="input" />

      <label className="field-label">Time limit (minutes)</label>
      <input type="number" className="input" min="0" placeholder="Optional" />

      <label className="field-label">Attempt limit</label>
      <select className="input small">
        <option value="1">1</option>
        <option value="multiple">Multiple</option>
      </select>

      <label className="field-label">Late submission</label>
      <select className="input small">
        <option value="allow">Allow</option>
        <option value="disallow">Disallow</option>
      </select>

      <label className="field-label">Shuffle</label>
      <div className="toggles">
        <label><input type="checkbox" /> Shuffle questions</label>
        <label><input type="checkbox" /> Shuffle options</label>
      </div>
    </div>
  );
}
