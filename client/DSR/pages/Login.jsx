import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import PasswordInput from '../components/PasswordInput';
import { validateEmail, validatePassword } from '../utils/helper';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); //to disable button after one click

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Please enter a valid password.");
      return;
    }

    setError("");
    setIsLoggingIn(true); // Set loading state to true

    try {
      // console.log('Starting login process');

      // Send login request
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // console.log('Login successful, fetching user data');

      // Fetch the user data
      const userResponse = await axiosInstance.get("/get-user", {
        headers: {
          'Authorization': `Bearer ${response.data.accessToken}`
        }
      });

      const user = userResponse.data.user;
      const userRole = user.role.trim().toLowerCase(); // Normalize the role
      // console.log('User Role:', userRole);
      // console.log('isAdminLogin:', isAdminLogin);

      // Check if the user is an admin and if admin login is checked
      if (isAdminLogin) {
        if (userRole === 'admin') {
          // console.log('Admin login successful. Navigating to /home');
          localStorage.setItem("token", response.data.accessToken);
          setTimeout(() => {
            navigate("/home");
          }, 0);
        } else {
          // console.log('Admin login failed: User is not an admin');
          alert("Access denied. Admin login required.");
        }
      } else {
        // For regular users, navigate to the DSR dashboard
        // console.log('User login successful. Navigating to /dsr');
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dsr");
      }
    } catch (error) {
      // console.error("Login failed:", error.response?.data?.message || error.message);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoggingIn(false); // Set loading state to false
    }
  };

  return (
    <div className='min-h-screen min-w-screen flex flex-col bg-slate-50 bg-cover bg-center'
      style={{ backgroundImage: `url('/../src/assets/ClgBg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        width: 'full'
      }}
    >
      <div className='flex-grow flex items-center justify-center select-none'>
        <div className='w-120 border rounded-lg bg-white border-slate-200 px-7 pb-10 m-6 mb-20 pt-4'>
          <form onSubmit={handleLogin} className='select-none'>
            <div className='flex items-center justify-center px-6 py-2 drop-shadow shrink-0 mt-0 mb-5'>
              <div className='w-[130px]'>
                <img src='/../src/assets/Logo1.png' className='object-left ' alt="Logo" />
              </div>
            </div>

            <input
              type='text'
              placeholder='Email'
              className='w-full text-sm text-black bg-transparent border-[1.5px] px-5 py-3 rounded mb-7 outline-none border-slate-200 placeholder-slate-400 select-none'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="adminLogin"
                checked={isAdminLogin}
                onChange={() => {
                  setIsAdminLogin(!isAdminLogin);
                }}
                className="mr-2 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="adminLogin" className="text-sm">Admin Login</label>
            </div>

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button 
              type='submit' 
              className={`w-full text-sm bg-blue-500 text-white p-2 rounded my-1 hover:bg-blue-600 ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} 
              disabled={isLoggingIn} // Disable button while logging in
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
