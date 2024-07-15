import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../styles/style.css';

const Register = () => {
  const [lightMode, setLightMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [image, setImage] = useState(null);
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

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.onerror = error => {
      console.log("Error: ", error);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      setError('Passwords do not match');
      return;
    }

    axios.post('http://localhost:5036/signupres', { email, password, cpassword, image })
      .then((result) => {
        console.log(result);
        setSuccess(result.data.message);
        setError('');
        router.push('/Login');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="register-body">
      <div className={`container ${lightMode ? 'light-mode' : ''} mx-auto p-4`}>
        <div className="header flex justify-between items-center p-4">
          <div className="header-title">
            <h1 className="text-3xl font-bold">TO DO APP</h1>
            <p className="text-sm">Stop Procrastinating, Start Organizing</p>
          </div>
          <div className="user-icon flex items-center">

            <img src="photo.png" alt="Profile" className="ml-2 w-10 h-10 rounded-full" />
          </div>
        </div>
        <hr className="hr-line my-2" />
        <div className="login text-center mb-4">
          <p className="text-white text-3xl">Register</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form flex flex-col items-center space-y-4">
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full max-w-xs h-10 px-2 rounded-lg bg-gray-800 text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full max-w-xs h-10 px-2 rounded-lg bg-gray-800 text-white"
          />
          <input
            type="password"
            name="cpassword"
            placeholder="Confirm Password"
            value={cpassword}
            onChange={(e) => setCpassword(e.target.value)}
            required
            className="w-full max-w-xs h-10 px-2 rounded-lg bg-gray-800 text-white"
          />
          <label htmlFor="profileImage" className="file-input-label w-full max-w-xs h-10 px-4 bg-white text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300 cursor-pointer flex items-center justify-center">
            Choose Profile Image
            <input
              id="profileImage"
              accept="image/*"
              type="file"
              onChange={handlePictureChange}
              style={{ display: 'none' }}
            />
          </label>
          {image && <img width={100} height={100} src={image} alt="Preview" className="my-2" />}

          <p className="text-white">
            Already have an account?{' '}
            <a href="/Login" className="text-blue-400">Login</a>
          </p>
          <input
            type="submit"
            value="Register"
            className="w-full max-w-xs h-10 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
