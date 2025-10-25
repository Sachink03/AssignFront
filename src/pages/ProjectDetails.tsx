import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";
import Api from '../Api';

type Task = {
  _id?: string;
  title: string;
  status: 'Todo' | 'In-Progress' | 'Done';
  completed?: boolean;
  projectId?: string;
};

const emptyTask: Task = { title: '', status: 'Todo' };

const ProjectDetails = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editableTasks, setEditableTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/tasks/${projectId}`);
      const fetchedTasks = response.data.tasks || [];
     const projectData = {
        id: projectId,
        name: `Demo Project :${fetchedTasks[0].title}`,
        description: 'This is a dummy project used for frontend testing.',
      };
      // Ensure exactly 3 editable tasks (existing or new placeholders)
      const paddedTasks = [...fetchedTasks];
      while (paddedTasks.length < 3) {
        paddedTasks.push({ ...emptyTask });
      }

      setProject(projectData);
      setEditableTasks(paddedTasks.slice(0, 3));
    } catch (error) {
      console.error('Error fetching project/tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index: number, field: 'title' | 'status', value: string) => {
    const updated = [...editableTasks];
    updated[index] = {
      ...updated[index],
      [field]: field === 'status' ? (value as Task['status']) : value,
    };
    setEditableTasks(updated);
  };

  const handleSave = async (index: number) => {
    const task = editableTasks[index];
    if (!task.title.trim()) {
      alert('Task title cannot be empty.');
      return;
    }

    try {
      if (task._id) {
        // Update existing task
        await Api.put(`/task/${task._id}`, {
          title: task.title,
          status: task.status,
        });;
      } else {
        // Create new task
        const response = await Api.post('/task', {
          title: task.title,
          status: task.status,
          projectId: projectId,
        });
        // Update with the new _id after creation
        const newTasks = [...editableTasks];
        newTasks[index] = response.data.task;
        setEditableTasks(newTasks);
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save task.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!project) return <div className="text-center py-10 text-red-500">Project not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/dashboard" className="text-black-500 hover:bold">
                 ← Back
              </Link>
      <h1 className="text-3xl font-bold mb-1">{project.name}</h1>
      {/* <p className="text-gray-700 mb-6">{project.description}</p> */}

      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      <ul className="space-y-2 mb-6">
        {editableTasks.map((task, index) => (
          <li
            key={task._id || index}
            className="bg-white p-3 rounded shadow flex flex-col sm:flex-row justify-between gap-2"
          >
            <input
              type="text"
              placeholder="Enter task title"
              value={task.title}
              onChange={(e) => handleInputChange(index, 'title', e.target.value)}
              className="flex-1 border p-1 rounded"
            />
            <select
              value={task.status}
              onChange={(e) => handleInputChange(index, 'status', e.target.value)}
              className="border p-1 rounded"
            >
              <option value="Todo">Todo</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Done">Done</option>
            </select>
            <button
              onClick={() => handleSave(index)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              {task._id ? 'Update' : 'Add'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetails;
