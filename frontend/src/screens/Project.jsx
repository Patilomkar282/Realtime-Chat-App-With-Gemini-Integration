import React,{useState,useEffect,useContext,useRef} from 'react'
import axios from '../config/axios';
import { useNavigate,useLocation } from 'react-router-dom';
import { initializeSocket,receiveMessage,sendMessage } from '../config/socket';
import { UserContext } from '../context/user.context.jsx'
import Markdown from 'markdown-to-jsx'
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // VS Code-like dark theme
import "prismjs/components/prism-javascript";


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}

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
        const [ messages, setMessages ] = useState([])
        const[fileTree,setfileTree]=useState({})

        const[currentFile, setCurrentFile]=useState(null);
        const[openfiles,setOpenFiles]=useState([]);

    
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
          setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ]) // Update messages state
        setMessage("")
        setMessage("")

    }
function WriteAiMessage(message) {
  let messageObject;

  if (typeof message === 'object') {
    messageObject = message;
  } else {
    try {
      messageObject = JSON.parse(message);
    } catch {
      messageObject = { text: String(message) };
    }
  }

  // If the message contains a functions array, display each function's details
  if (Array.isArray(messageObject.functions)) {
    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2 space-y-4">
        {messageObject.functions.map((fn, idx) => (
          <div key={idx} className="space-y-2">
            {fn.functionName && (
              <div className="font-bold text-blue-300">{fn.functionName}</div>
            )}
            {fn.description && (
              <div className="text-sm text-gray-300">{fn.description}</div>
            )}
            {fn.code && (
              <pre className="bg-black text-green-300 p-2 rounded overflow-x-auto text-xs">
                <code>{fn.code}</code>
              </pre>
            )}
            {fn.example && (
              <div className="text-xs text-gray-400">
                <span className="font-semibold">Example:</span> {fn.example}
              </div>
            )}
            {fn.returnType && (
              <div className="text-xs text-gray-400">
                <span className="font-semibold">Returns:</span> {fn.returnType}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default rendering for other AI messages
  return (
    <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2 space-y-2">
      {/* Show description if available */}
      {messageObject.description && (
        <p className="text-sm text-gray-300">{messageObject.description}</p>
      )}

      {/* Show code with syntax highlighting */}
      {messageObject.code && (
        <pre className="bg-black text-green-300 p-2 rounded overflow-x-auto text-xs">
          <code>{messageObject.code}</code>
        </pre>
      )}

      {/* Show compilation steps */}
      {messageObject.compilationSteps && Array.isArray(messageObject.compilationSteps) && (
        <ul className="list-disc pl-5 text-sm text-gray-400">
          {messageObject.compilationSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      )}

      {/* Fallback: render markdown text */}
      {messageObject.text && (
        <Markdown
          children={messageObject.text}
          options={{
            overrides: { code: SyntaxHighlightedCode },
          }}
        />
      )}
    </div>
  );
}




  useEffect(() => {
    console.log("this is the project is",project._id);
  
  initializeSocket(project._id);
  receiveMessage('projectMessage', data => {
  let message = data.message;

  try {
    // Parse only if it’s a string and looks like JSON
    if (typeof message === 'string' && message.trim().startsWith('{')) {
      message = JSON.parse(message);
    }
  } catch (e) {
    console.warn('Invalid JSON, keeping as plain text:', message);
  }

  console.log(message);

  if (message && typeof message === 'object' && message.fileTree) {
    setfileTree(message.fileTree);
  }

  setMessages(prev => [...prev, { ...data, message }]);
});



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


  }, [])

 
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
                <div
                        ref={messageBox}
                        className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                                <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                                <div className='text-sm'>
                                    {msg.sender._id === 'ai' ?
                                        WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
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

        <section className="right bg-red-50 flex-grow h-full flex">
          <div className="explorer h-full max-w-65 min-w-52 py-2  bg-slate-400">
            <div className="file-tree w-full space-y-2">
                {
                  Object.keys(fileTree).map((file, index) => {
                    return (
                      <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles((prev) => [...new Set([...prev, file])]);
                                        
                                    }}
                                    className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full">
                                    <p
                                        className='font-semibold text-lg'
                                    >{file}</p>
                                </button>
                    );
                  })
                }

            </div>
          </div>
          {currentFile && (
  <div className="code-editor flex flex-col flex-grow h-full">
    <div className="top flex ">
      {openfiles.map((file, index) => (
        <button
          key={index}
          onClick={() => setCurrentFile(file)}
          className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
          <p className='font-semibold text-lg'>{file}</p>
        </button>
      ))}
    </div>
    <div className="bottom flex flex-grow bg-[#1e1e1e] rounded-b-lg shadow-inner border-t border-slate-800 overflow-hidden">
      {fileTree[currentFile] && (
        <div className="flex w-full h-full">
          {/* Line Numbers */}
          <div className="bg-[#23272e] text-[#6a9955] text-xs py-4 px-2 select-none font-mono min-w-8 text-right">
            {Array.from(
              {
                length:
                  (
                    typeof fileTree[currentFile].file.contents === 'string'
                      ? fileTree[currentFile].file.contents
                      : JSON.stringify(fileTree[currentFile].file.contents, null, 2)
                  ).split('\n').length,
              },
              (_, i) => (
                <div key={i} className="h-5 leading-5">{i + 1}</div>
              )
            )}
          </div>
          {/* Code Editor with Syntax Highlighting */}
          <div className="flex-grow h-full overflow-auto">
            <Editor
              value={
                typeof fileTree[currentFile].file.contents === 'string'
                  ? fileTree[currentFile].file.contents
                  : JSON.stringify(fileTree[currentFile].file.contents, null, 2)
              }
              onValueChange={code => {
                setfileTree({
                  ...fileTree,
                  [currentFile]: {
                    file: {
                      ...fileTree[currentFile].file,
                      contents: code,
                    },
                  },
                });
              }}
              highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
              padding={16}
              className="font-mono text-sm outline-none min-h-full bg-transparent text-[#d4d4d4]"
              style={{
                background: "transparent",
                minHeight: "100%",
                width: "100%",
                color: "#d4d4d4",
                fontFamily: "Fira Mono, Menlo, Monaco, 'Courier New', monospace"
              }}
              textareaId="codeArea"
              textareaClassName="w-full h-full"
              preClassName="!bg-transparent"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        </div>
      )}
    </div>
  </div>
)}
          






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
