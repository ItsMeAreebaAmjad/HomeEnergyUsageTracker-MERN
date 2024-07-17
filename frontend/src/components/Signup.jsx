import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa';
import axios from 'axios';

const Signup = () => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    image: null, // for storing the selected image file
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setValues({ ...values, image: files[0] });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('image', values.image);

    try {
      const response = await axios.post('http://localhost:8081/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Account created successfully!');
      setErrorMessage('');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/'); // Redirect to login page after 3 seconds
      }, 3000); // hide message after 3 seconds
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data.Error) {
        setErrorMessage(error.response.data.Error);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
      setSuccessMessage('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl relative">
        {successMessage && (
          <div className="absolute top-0 left-0 w-full bg-green-500 text-white text-center py-2 rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center py-2 rounded">
            {errorMessage}
          </div>
        )}
        <h2 className="text-2xl mb-4">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block mb-2">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2">Upload Image</label>
            <label className="flex items-center justify-center w-full px-4 py-6 border rounded-lg cursor-pointer">
              <FaCamera className="mr-2" />
              <span>Select an Image</span>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Signup</button>
        </form>
        <div className="mt-4 text-center">
          <p>Already have an account? <Link to="/" className="text-blue-500">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;