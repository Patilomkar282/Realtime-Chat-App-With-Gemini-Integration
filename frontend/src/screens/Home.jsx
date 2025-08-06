import React, { useContext, useState,useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios  from '../config/axios';
import {useNavigate} from 'react-router-dom';



const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    if (projectName.trim()) {
      console.log('Creating project:', projectName);
    
      axios.post('/project/create', { name: projectName })
        .then((res) => {
          console.log('Project created successfully:', res.data);
          
        })
        .catch((err) => {
          console.error('Error creating project:', err.response ? err.response.data : err.message);
        });
      setProjectName('');
      setIsModalOpen(false);
    }
  }

  useEffect(() => {
    axios.get('/project/all').then((res) => { 
     setProjects(res.data.projects);
    }
    ).catch((err) => {
      console.error('Error fetching projects:', err.response ? err.response.data : err.message);
    });


  }  , [user]);


  return (
    <main className="p-4 min-h-screen bg-gray-900 text-white">
      <div className="projects flex flex-row gap-4">
        <button
          className="project p-4 border border-slate-300 rounded-md hover:bg-slate-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          New Project
          <i className="ri-add-large-line text-xl ml-4"></i>
        </button>

        {
          projects.map((project) => (
            
            
            <div key={project._id} 
                onClick={() => {
                  
                  navigate('/project', { state: { project } });
                }}

            className="project flex flex-col gap-2 min-w-3 cursor-pointer p-4 border border-slate-300 rounded-md hover:bg-slate-700 transition mb-4 hover:bg-slate-600">
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <div className='flex flex-row gap-5'>
              <i className="ri-user-line"></i>
              <h2 className="text-lg text-gray-400">Members: {project.users.length}</h2>
              </div>
            </div>
          ))
        }   
      
      </div>



      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-white text-2xl font-semibold mb-4 text-center">Create New Project</h2>
            <form onSubmit={createProject} className="space-y-4">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition duration-300"
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
