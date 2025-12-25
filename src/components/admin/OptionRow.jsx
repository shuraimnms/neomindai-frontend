import React from 'react';

export default function OptionRow({ option, type = 'radio' }) {
  return (
    <div className="flex items-center gap-3 p-2 border rounded">
      <input type={type === 'checkbox' ? 'checkbox' : 'radio'} name="option" />
      <input className="flex-1 p-2 border rounded" defaultValue={option.text} placeholder="Option text" />
      <button className="text-sm text-gray-500">Attach</button>
    </div>
  );
}
