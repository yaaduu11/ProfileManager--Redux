import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

type AdminType  = {
  isAdmin : boolean
}

const API_URL = "http://localhost:3000"; 

const SignIn = ({isAdmin} : AdminType) => {
  const navigate = useNavigate();
    
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value, 
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = isAdmin ? `${API_URL}/admin/adminSignIn` : `${API_URL}/signIn`; 
      
      const response = await axios.post(url, credentials, { withCredentials: true });

      if (response.status === 200) {
        alert('Login successful');
        navigate(isAdmin ? '/dashboard' : '/');
      }
    } catch (error) {
      console.error(error); 
      alert('Login failed, please check your credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white bg-gray-900">
      <h1 className="mb-8 text-3xl font-bold text-gray-100 md:text-4xl">{isAdmin ? "Admin Sign In" : "Sign In"}</h1>

      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 text-gray-300 placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 text-gray-300 placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button className="px-6 py-2 text-gray-300 transition bg-gray-800 rounded-md hover:bg-gray-700" type="submit">
          Sign In
        </button>
      </form>

      {!isAdmin && (
        <p className="mt-6 text-gray-400">
          If you do not have an account,{' '}
          <span className="font-bold cursor-pointer" onClick={() => navigate('/signup')}>
            Sign Up
          </span>.
        </p>
      )}
    </div>
  );
};

export default SignIn;