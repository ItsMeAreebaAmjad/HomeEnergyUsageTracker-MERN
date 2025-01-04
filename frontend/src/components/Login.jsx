import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/login', formData);
      const { message, user } = response.data;

      // Store user data in localStorage for authentication
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to profile page upon successful login
      navigate('/home');
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        setError(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error:', error.message);
      }
    }
  };

  // Redirect to forgot password page
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-700">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <p>
            <Link to="/forgot-password" className="text-blue-500 hover:underline ml-[250px]" onClick={handleForgotPassword}>
              Forgot Password?
            </Link>
          </p>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-2">
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-between items-center">
          
          <p>
            Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
