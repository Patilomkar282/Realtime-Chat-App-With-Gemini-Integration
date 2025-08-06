import { motion } from 'framer-motion';
import { Link,useNavigate } from 'react-router-dom';
import React ,{useState,useContext}from 'react';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    function submitHandler(e) {
        e.preventDefault();
        axios.post('/user/register', { email, password })
            .then((res) => {
                console.log('Registration successful:', res.data);
                localStorage.setItem('token', res.data.token); // Store token in localStorage
                console.log("isolated 1")
                console.log(res.data.user)
                console.log("isolated 1")
                setUser(res.data.user); // Set user in context
                navigate('/');  // Redirect to login after successful registration
            })
            .catch((err) => {
                console.error('Registration failed:', err.response ? err.response.data : err.message);
            });
    }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
            onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
            onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition duration-300"
          >
            Register Now
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">
          All ready have account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
