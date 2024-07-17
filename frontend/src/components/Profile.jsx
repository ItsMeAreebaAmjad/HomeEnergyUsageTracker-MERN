import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false); // State to manage edit mode
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: null, // To store the selected file
  });
  const [imagePreview, setImagePreview] = useState(null); // State to store image preview URL
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/'); // Redirect to login if user data is not available
    } else {
      setUser(userData);
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profileImage: userData.profileImage, // Update formData with current profile image
      });
      setImagePreview(userData.profileImage ? `http://localhost:8081/uploads/${userData.profileImage}` : null);
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });

    // Display image preview
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      const formDataToUpdate = new FormData();
      formDataToUpdate.append('firstName', formData.firstName);
      formDataToUpdate.append('lastName', formData.lastName);
      formDataToUpdate.append('email', formData.email);
      
      // Check if new profileImage is selected
      if (formData.profileImage) {
        formDataToUpdate.append('profileImage', formData.profileImage);
      }

      const res = await axios.put(`http://localhost:8081/profile/${user.email}`, formDataToUpdate);
      console.log('Update response:', res.data);
      // Ideally, update localStorage or state with updated user data after successful update

      // Exit edit mode
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle remove profile picture
  const handleRemoveProfilePicture = async () => {
    try {
      const res = await axios.put(`http://localhost:8081/profile/remove/${user.email}`);
      console.log('Remove profile picture response:', res.data);

      // Update state and local storage with default profile image
      setImagePreview(null);
      setFormData({ ...formData, profileImage: null });
      localStorage.setItem('user', JSON.stringify({ ...user, profileImage: null }));
    } catch (error) {
      console.error('Error removing profile picture:', error);
    }
  };

  // Handle edit button click
  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        {user ? (
          <div className="text-center">
            <div className="relative mb-4">
              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className={`w-32 h-32 rounded-full object-cover mx-auto mb-4 ${editMode ? 'cursor-pointer' : ''}`}
                  onClick={() => setEditMode(true)}
                />
              ) : (
                <div
                  className={`w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 ${editMode ? 'cursor-pointer' : ''}`}
                  onClick={() => setEditMode(true)}
                ></div>
              )}
            </div>
            {editMode && imagePreview && (
              <button
                onClick={handleRemoveProfilePicture}
                className="block mx-auto mb-4 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                Remove Profile Picture
              </button>
            )}
            <h2 className="text-3xl font-bold mb-2">Welcome {user.firstName} {user.lastName}</h2>
            <p className="text-gray-600 mb-8">Here is your profile information</p>
            
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                readOnly={!editMode}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                readOnly={!editMode}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">Email:</label>
              <input
                type="text"
                value={formData.email}
                readOnly
                className="w-full p-2 border rounded bg-gray-200"
              />
            </div>

            {editMode ? (
              <button
                onClick={handleSaveChanges}
                className="mt-8 w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="mt-8 w-full bg-gray-500 text-white p-3 rounded hover:bg-gray-600"
              >
                Edit Profile
              </button>
            )}

            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-500 text-white p-3 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
