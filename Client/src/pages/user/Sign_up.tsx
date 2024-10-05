import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import { setUser } from '../../redux/store';

const API_URL = "http://localhost:3000";

const Sign_up: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUserState] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  
  const dispatch = useDispatch(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/insertUser`, user);
      alert('User created successfully');
      console.log(response);
      
      dispatch(setUser(user));
      
      navigate('/signin');
    } catch (error) {
      console.error(error);
      alert('This email is already used.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserState(prevState => ({ ...prevState, [id]: value }));
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white bg-gray-900">
        <h1 className="mb-8 text-3xl font-bold text-gray-100 md:text-4xl">Sign Up</h1>

        <form className="w-full max-w-sm mb-6" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 text-gray-300 placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Enter your name"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 text-gray-300 placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Enter your email"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-300">Phone</label>
            <input
              type="tel"
              id="phone"
              className="w-full px-4 py-2 text-gray-300 placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Enter your phone number"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 text-gray-300 placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Enter your password"
              required
              onChange={handleChange}
            />
          </div>

          <button className="px-6 py-2 text-gray-300 transition bg-gray-800 rounded-md hover:bg-gray-700">
            Sign Up
          </button>
        </form>
        <p className="text-gray-400">If you already have an account, <span className="font-bold cursor-pointer" onClick={() => navigate('/signin')}>Sign In</span>.</p>
      </div>
    </div>
  );
}

export default Sign_up;