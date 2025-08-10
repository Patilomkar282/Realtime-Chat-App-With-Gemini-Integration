import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    if (projectName.trim()) {
      axios.post('/project/create', { name: projectName })
        .then((res) => {
          setProjects(prev => [...prev, res.data.project]);
        })
        .catch((err) => {
          // Optionally show error
        });
      setProjectName('');
      setIsModalOpen(false);
    }
  }

  useEffect(() => {
    axios.get('/project/all').then((res) => {
      setProjects(res.data.projects);
    }).catch((err) => {
      // Optionally show error
    });
  }, [user]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-700">Your Projects</h1>
          <button
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-line text-xl"></i>
            New Project
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate('/project', { state: { project } })}
              className="cursor-pointer bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition group border border-blue-100"
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-2 group-hover:text-blue-800 transition">{project.name}</h2>
              <div className="flex items-center gap-2 text-blue-500">
                <i className="ri-user-line"></i>
                <span className="text-base">Members: {project.users.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in flex flex-col items-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-blue-700 text-2xl font-bold mb-6 text-center">Create New Project</h2>
            <form onSubmit={createProject} className="space-y-6 w-full">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
                className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition duration-300"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;