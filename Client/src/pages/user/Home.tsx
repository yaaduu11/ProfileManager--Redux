import { useEffect, useState,useRef  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import addImage from '../../assets/addImage.jpg';


interface User {
  name: string;
  email: string;
  phone: string;
  imageURL?: string;
}

const API_URL = "http://localhost:3000";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  const [editMode, setEditMode] = useState<boolean>(false); 
  const [editedName, setEditedName] = useState<string>(''); 
  const [editedEmail, setEditedEmail] = useState<string>('')
  const [editedPhone, setEditedPhone] = useState<string>('');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getUserData`, { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data); 
        } else {
          navigate('/signIn')
        }
      } catch (error) {
        navigate('/signIn')
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`${API_URL}/uploadImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            setUser((prevUser) => (prevUser ? { ...prevUser, imageURL: response.data.imageURL } : null));
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Error uploading image');
        }
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleLogout = () => {
    axios.post(`${API_URL}/signOut`,{}, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          navigate('/signIn');
        } else {
          console.error('Logout was not successful:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };
  
  const handleEditInfo = () => {
    setEditMode(true); 
    if (user) {
      setEditedName(user.name); 
      setEditedEmail(user.email);
      setEditedPhone(user.phone);
    }
  };

  const handleSubmitInfo = async () => {
    try {
      const response = await axios.patch(`${API_URL}/updateUserData`, {
        name: editedName,
        email: editedEmail,
        phone: editedPhone,
      }, { withCredentials: true });

      if (response.status === 200) {
        setUser((prevUser) => (prevUser ? { ...prevUser, name: editedName, email: editedEmail, phone: editedPhone } : null));
        setEditMode(false); 
      } else {
        setError('Failed to update user data');
      }
    } catch (error) {
      setError('Failed to update user data');
    }
  };

  if (loading) {
    return <p className="text-white">Loading...</p>;  
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; 
  }

  if (!user) {
    return <p className="text-white">No user data available.</p>; 
  }
  // console.log(user.imageURL)
  // console.log(`${API_URL}/uploads/${user.imageURL}`);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-gray-100 md:text-4xl">Welcome, {user.name} !</h1>

      <div className="relative mb-6">
        <img
          src={user.imageURL == "empty" ? addImage : `${API_URL}/uploads/${user.imageURL}`}
          alt="User Profile"
          onClick={handleImageClick}
          className="object-cover w-32 h-32 border-4 border-gray-700 rounded-full shadow-lg cursor-pointer md:w-40 md:h-40" 
        />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden" 
          accept="image/*" 
        />
      </div>
      <p className="text-xs mt-[-14px] text-gray-400">Tap your profile to change your photo.</p>
      
      <div className="mt-6 mb-8 text-center">
        {editMode ? (
          <>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="px-4 py-2 mb-4 mr-2 text-gray-900 bg-white rounded-md"
              placeholder="Name"
            />
            <input
              type="text"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="px-4 py-2 mb-4 text-gray-900 bg-white rounded-md"
              placeholder="Email"
            />
            <input
              type="text"
              value={editedPhone}
              onChange={(e) => setEditedPhone(e.target.value)}
              className="px-4 py-2 mb-4 ml-2 text-gray-900 bg-white rounded-md"
              placeholder="Phone"
            />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-300">{user.name}</h2>
            <p className="mt-2 text-gray-400">{user.email}</p>
            <p className="mt-2 text-gray-400">{user.phone}</p>
          </>
        )}
      </div>

      {editMode ? (
        <button
          onClick={handleSubmitInfo}
          className="px-4 py-2 text-white transition bg-green-600 rounded-md hover:bg-green-500"
        >
          Submit
        </button>
      ) : (
        <button
          onClick={handleEditInfo}
          className="px-4 py-2 text-gray-300 transition bg-gray-800 rounded-md hover:bg-gray-700"
        >
          Edit Info
        </button>
      )}

      <button onClick={handleLogout} className="absolute px-4 py-2 text-white transition bg-black border border-white rounded-lg top-6 right-6 hover:bg-gray-800">
        Logout
      </button>
    </div>
  );
};

export default Home;
