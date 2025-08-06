import React,{useState,useEffect,useContext} from 'react'
import axios from '../config/axios';
import { useNavigate,useLocation } from 'react-router-dom';
import { initializeSocket,receiveMessage,sendMessage } from '../config/socket';
import { UserContext } from '../context/user.context.jsx'

const Project = () => {
        const location = useLocation();
       const {user} = useContext(UserContext);
        const [isSidePanelOp,setisSidePanelOp] = useState(false);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedUserId, setSelectedUserId] = useState([]);
        const[users,setUsers] = useState([]);
        const[message,setMessage]=useState("");
        const [project, setProject] = useState(location.state.project || {}); // Initialize with an empty object if no project is passed
        const messageBox = React.useRef();
    
const handleUserSelect = (id) => {
        const newSet = new Set(selectedUserId);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        console.log('Selected User IDs:', Array.from(newSet));
        setSelectedUserId(Array.from(newSet));
      
};
function addCollaborators() {

        axios.put("/project/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })

    }
  const send = () => {
   

        sendMessage('projectMessage', {
            message,
            sender: user
        })
        appendOutgoingMessage(message);
        // setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ]) // Update messages state
        setMessage("")

    }

  useEffect(() => {

    initializeSocket(project._id);
    receiveMessage('projectMessage',data =>{
      console.log(data);
      appendIncomingMessage(data);
  
    })


    axios.get(`/project/get-project/${location.state.project._id}`).then((res) => {
      console.log('Project fetched successfully:', res.data.project);
        setProject(res.data.project);

     
    }).catch((err) => {
      console.error('Error fetching project:', err.response ? err.response.data : err.message); 
    });

    axios.get('/user/all').then((res) => {
      
      setUsers(res.data.users);
    //   console.log('Users fetched successfully:', res.data.users);
    }).catch((err) => {
      console.error('Error fetching users:', err.response ? err.response.data : err.message);
    });


  }, []);


  function appendIncomingMessage(messageObject){
   const messageBox = document.querySelector('.message-box')
   console.log(messageObject.sender.email);

    const message = document.createElement('div')
    message.classList.add('message','max-w-56','flex', 'flex-col','p-2','bg-slate-200')
    message.innerHTML=`
    <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
    <p class='text-sm'>${messageObject.message}</p>
    `
    messageBox.appendChild(message);
    scrollToBottom();


  }

  function appendOutgoingMessage(message){
    const messageBox = document.querySelector('.message-box')
  

    const newmessage = document.createElement('div')
    newmessage.classList.add('ml-auto','max-w-56','flex', 'flex-col','p-2','bg-slate-200')
    newmessage.innerHTML=`
    <small class='opacity-65 text-xs'>${user.email}</small>
    <p class='text-sm'>${message}</p>
    `
    messageBox.appendChild(newmessage);
        scrollToBottom();

  }
  function scrollToBottom (){
    messageBox.current.scrollTop=messageBox.current.scrollHeight;
  }

  return (
    <main className='h-screen w-screen flex'>
        <section className='left relative flex flex-col h-full min-w-96 bg-slate-300'>
            <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100'>
                <button
            className='p-2 flex gap-2'
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-fill ml-1"></i>
            <h1>Add collaborators</h1>
          </button>
                
                <button className='p-2'
                onClick={() => setisSidePanelOp(!isSidePanelOp)}>
                <i className="ri-group-fill"></i>
                </button>
            </header>
            <div className="conversation-area py-14 flex-grow flex flex-col h-full relative ">
                <div ref={messageBox} className="message-box flex-grow flex flex-col overflow-auto gap-1 p-2 "
                 style={{ maxHeight: 'calc(100vh - 50px)' }}>
                </div>
                <div className="inputField w-full flex absolute bottom-0">
                    <input 
                      type="text" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder='Type your message here...'
                      className='w-full border-none outline-none p-2 px-4 rounded-md' 
                    />
                       <button 
                          onClick={send}
                          className='p-4 bg-blue-500 text-white'>
                          <i className="ri-send-plane-fill"></i>
                        </button>
                     
                </div>
            </div>

            <div className={`sidePanel w-full flex flex-col gap-2 h-full bg-slate-50 absolute  transition-all ${isSidePanelOp?'translate-x-0':'-translate-x-full'} top-0 `}>
                <header className='flex justify-between items-center p-2 px-3 bg-slate-100'>
                    <h1>Collaborators</h1>
                    <button className='p-2' onClick={() => setisSidePanelOp(false)}>
                        <i className="ri-close-fill"></i>
                    </button>

                </header>
                 
                <div className="users flex flex-col gap-2 p-2 m-2">
                  {
                    project.users && project.users.map((user) => {
                        return (
                        <div className="user flex gap-2 items-center rounded-lg hover:bg-slate-400 cursor-pointer p-2">
                          <div className='aspect-square rounded-full h-fit w-fit flex items-center justify-center p-5 text-white bg-slate-800'>
                            <i className="ri-user-3-line absolute"></i>
                          </div>
                          <h1 className='font-semibold text-lg '>{user.email}</h1>
                        </div>
                      );

                     })
                }
                </div>
            </div>
        </section>

         {/* Modal for users list */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Select a User</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  <i className="ri-close-fill text-2xl"></i>
                </button>
              </div>
              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {users.map(user => (
                  <button
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border hover:bg-blue-100  transition ${
                      selectedUserId.indexOf(user._id)!=-1 ? 'bg-blue-200 border-blue-500' : ''
                    }`}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="rounded-full bg-slate-800 text-white flex items-center justify-center w-10 h-10">
                      <i className="ri-user-3-line"></i>
                    </div>
                    <div className="flex flex-col text-left">
                      {/* <span className="font-semibold">{user.name}</span> */}
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </button>
                ))}
              </div>
               {/* {selectedUserId && (
                <div className="mt-2 text-sm text-green-600">
                  Selected User ID: {selectedUserId}
                </div>
              )} */}

              <div className="sticky bottom-0 left-0 w-full bg-white pt-4">
              <button
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                onClick={() => {addCollaborators(),setIsModalOpen(false);}}
              >
                Add Collaborators
              </button>
            </div>
            </div>
          </div>
        )}

        {/* ...existing code... */}
       



    </main>
  )
}

export default Project
