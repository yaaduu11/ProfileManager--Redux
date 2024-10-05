import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const API_URL = "http://localhost:3000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]); 
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/getUsers`);
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  
  const handleDelete = async (userId: string) => {
    // console.log('Delete user with ID:', userId);
    try {
      const response = await axios.delete(`${API_URL}/admin/deleteUser/${userId}`);
      if (response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
        // console.log('User deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  const handleEdit = (userId: string) => {
    navigate(`/edit/${userId}`);
  };  
  
  const AdminLogout = () => {
    navigate('/admin')
  }
  
  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8 text-white bg-gray-900">
      <h1 className="mt-12 mb-8 text-3xl font-bold text-gray-100 md:text-4xl">
        Welcome Admin
      </h1>

      <div className="w-full max-w-4xl p-6 mt-6 bg-gray-800 rounded-lg shadow-lg">
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-gray-300">No.</th> 
              <th className="px-4 py-2 text-gray-300">Name</th>
              <th className="px-4 py-2 text-gray-300">Email</th>
              <th className="px-4 py-2 text-gray-300">Phone</th>
              <th className="px-4 py-2 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr className="border-t border-gray-700" key={user._id}>
                <td className="px-4 py-2 text-gray-400">{index + 1}</td> 
                <td className="px-4 py-2 text-gray-400">{user.name}</td>
                <td className="px-4 py-2 text-gray-400">{user.email}</td>
                <td className="px-4 py-2 text-gray-400">{user.phone}</td>
                <td className="px-4 py-2">
                  
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="px-4 py-1 mr-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-500">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="px-4 py-1 mr-2 text-white transition bg-red-600 rounded-md hover:bg-red-500">
                    Delete
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={AdminLogout} className="absolute px-4 py-2 text-white transition bg-black border border-white rounded-lg top-6 right-6 hover:bg-gray-800">
        Logout
      </button>
    </div>
  );
};
  
export default AdminDashboard;