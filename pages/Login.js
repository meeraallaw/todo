import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import '../styles/style.css'; // Ensure styles.css has Tailwind directives

const Login = () => {
  const [lightMode, setLightMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [lightMode]);

  const toggleLightMode = () => {
    setLightMode(!lightMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5036/loginres', { email, password });
      if (response.status === 200) {
        // Store user image, token, and ID in local storage
        localStorage.setItem('userImage', response.data.image);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId); // Add userId to response on the server side if needed
        
        // Redirect to ToDoApp page
        router.push('/ToDoApp');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <div className={`container mx-auto p-4 ${lightMode ? 'light-mode' : ''}`}>
      <div className="header flex flex-col sm:flex-row justify-between items-center p-4">
        <div className="header-title text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold">TO DO APP</h1>
          <p className="text-xs sm:text-sm">Stop Procrastinating, Start Organizing</p>
        </div>
        <div className="user-icon flex items-center">
          <img src="/photo.png" alt="Profile" className="ml-2 w-8 sm:w-10 h-8 sm:h-10 rounded-full" />
        </div>
      </div>
      <hr className="hr-line my-2" />
      <div className="login text-center mb-4">
        <p className="text-white text-2xl sm:text-3xl">Login</p>
      </div>
      <form onSubmit={handleSubmit} className="login-form flex flex-col items-center w-full">
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full max-w-xs sm:max-w-sm h-10 px-2 rounded-lg bg-gray-800 text-white mb-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full max-w-xs sm:max-w-sm h-10 px-2 rounded-lg bg-gray-800 text-white mb-2"
          required
        />
        <p className="text-white">
          Don't have an account yet? <span className="underline-word"><a href="Register" className="text-blue-400">Signup</a></span>
        </p>
        <input
          type="submit"
          value="Login"
          className="w-40 h-10 px-4 mt-2 rounded-lg bg-white text-gray-800 hover:bg-gray-300 cursor-pointer"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
