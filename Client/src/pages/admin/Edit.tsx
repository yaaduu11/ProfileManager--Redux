import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:3000";

const Edit = () => {
    
    const { userId } = useParams(); // Get user ID from URL
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/getUser/${userId}`);
            if (response.data.success) {
            setUserData(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
        const response = await axios.patch(`${API_URL}/admin/edit/${userId}`, userData);
        if (response.data.success) {
            navigate('/dashboard'); 
        }
        } catch (error) {
        console.error('Error updating user:', error);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white bg-gray-900">
          <h1 className="mb-8 text-3xl font-bold text-gray-100 md:text-4xl">Edit Details</h1>
    
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={userData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-300 placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                placeholder="Enter your name"
                required
              />
            </div>
    
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-300 placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                placeholder="Enter your email"
                required
              />
            </div>
    
            <div className="mb-8">
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-300">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={userData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-300 placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                placeholder="Enter your phone number"
                required
              />
            </div>
    
            <div className="flex justify-center">
              <button className="px-6 py-2 text-gray-300 transition bg-green-700 rounded-md hover:bg-green-800" type="submit">
                Edit
              </button>
            </div>
          </form>
        </div>
      );
};

export default Edit
