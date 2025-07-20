import React, { useState } from 'react';
import Api from '../../Api';

type ProjectFormModalProps = {
  onClose: () => void;
  onSave?: () => void; // Refresh project list after saving'
  project?: any;
};

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ onClose, onSave, project }) => {
const [name, setName] = useState(project?.title || '');
const [description, setDescription] = useState(project?.description || '');
const [status, setStatus] = useState(project?.status || 'pending');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (project && project._id) {
      await Api.put(`/editTask/${project._id}`, {
        title: name,
        description:description,
        status,
      });
    } else {
      await Api.post('/addProject', {
        title: name,
        description: description,
        status,
      });
    }

    if (onSave) onSave();
    onClose();
  } catch (err: any) {
    console.error(err.response?.data?.message || err.message);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-bold text-xl">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
