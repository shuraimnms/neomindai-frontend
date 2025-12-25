import React from 'react';

export default function TopHeader({ title, onPreview, onSave, onPublish, onOpenSettings, loading }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Saving...</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onPreview}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Preview
          </button>

          <button
            onClick={onOpenSettings}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Settings
          </button>

          <button
            onClick={onSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            onClick={onPublish}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>
    </header>
  );
}
