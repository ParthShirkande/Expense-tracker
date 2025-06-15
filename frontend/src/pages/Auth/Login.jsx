import React, { useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import Input from '../../components/Inputs/Input';
import { passwordCheck, validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';
import { motion } from 'framer-motion';

const Login = () => {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);

  const {updateUser} = useContext(UserContext)

  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault()

    if(!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if(!passwordCheck(password)) {
      setError("Password should be at least 8 characters and include uppercase, lowercase, a number, and a special symbol.");
      return;
    }
    setError("");

    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,password
      })
      const {token,user}=response.data

      if(token){
        localStorage.setItem('token', token);
        updateUser(user)
        navigate('/dashboard');
      }
      else {
        setError("Login failed. Please check your credentials.");
      }
    }
    catch(err) {
      console.error("Login error:", err);
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  }

  return (
   <AuthLayout>
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'
  >
    <h3 className='text-2xl font-bold text-gray-900 mb-2'>Welcome Back 👋</h3>
    <p className='text-sm text-slate-600 mb-6'>Please enter your credentials to log in.</p>

    <form onSubmit={handleLogin} className='space-y-4'>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email Address"
        placeholder="john@example.com"
        type="text"
      />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
        placeholder="Min 8 characters"
        type="password"
      />
      {error && <p className='text-red-500 text-xs'>{error}</p>}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type='submit'
        className='btn-primary w-full transition-all duration-300'
      >
        LOGIN
      </motion.button>

      <p className='text-sm text-center mt-3'>
        Don’t have an account?{" "}
        <Link className='font-medium text-primary underline' to="/signup">
          Sign Up
        </Link>
      </p>
    </form>
  </motion.div>
</AuthLayout>

  )
}

export default Login
