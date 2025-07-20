import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Api from '../Api';
import ProjectFormModal from './components/ProjectForm'; 

const Dashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4; 
  const fetchProjects = async (page = 1, query = '') => {
    const res = await Api.get('/fetchProjects', {
    params: {
      page,
      limit,
      search: query
    }
  });
    setProjects(res.data.projects);
    setTotalPages(res.data.totalPages);
  };

  const handleDelete = async (id: string) => {
    await Api.delete(`/delete/${id}`);
    fetchProjects();
  };

  useEffect(() => {
  fetchProjects(currentPage, search);
}, [currentPage, search]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Projects</h1>
            <p className="text-sm text-gray-500 mt-1">
              You have <span className="font-medium">{projects.length}</span> active projects.
            </p>
            <input
  type="text"
  placeholder="Search by title..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // reset to first page when searching
  }}
  className="mb-4 px-3 py-2 border rounded w-full sm:w-1/3"
/>

          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.isArray(projects) && projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6 group"
            >
              <Link
                to={`/projects/${project._id}`}
                className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition"
              >
                {project.title}
              </Link>
              <p className="text-gray-600 text-sm mt-2">{project.description}</p>
              <p className="text-sm text-gray-500 capitalize mt-1">Status: {project.status}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setEditingProject(project)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(project._id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {(showModal || editingProject) && (
  <ProjectFormModal
    onClose={() => {
      setShowModal(false);
      setEditingProject(null);
    }}
    onSave={fetchProjects}
    project={editingProject} // Pass the project for editing (null when adding)
  />
)}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
  <button
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Prev
  </button>
  <span className="px-3 py-1">{currentPage} / {totalPages}</span>
  <button
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

    </div>
  );
};

export default Dashboard;
