import React, { useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import Input from '../../components/Inputs/Input';
import { passwordCheck, validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';
import { motion } from 'framer-motion';


const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName,setFullName]=useState("")
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);

  const {updateUser} = useContext(UserContext)

  const navigate = useNavigate();

  const handleSignup = async(e) => {
    e.preventDefault()

    if(!fullName){
      setError("Please enter your full name");
      return;
    }
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
      let profileImageUrl = "";
      

      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic)
        console.log("Image upload response:", imgUploadRes);
        profileImageUrl=imgUploadRes.imageUrl || "";
      }
      const response =await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,email,password,profileImageUrl
      })
      const {token,user}=response.data

      if(token){
        localStorage.setItem('token', token);
        updateUser(user);
        navigate("/dashboard")
    }
  }
  catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }
      else{ 
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
    className='lg:w-[100%] mt-10 md:mt-10 flex flex-col justify-center'
  >
    <h3 className='text-2xl font-bold text-gray-900 mb-2'>Create an Account 🎉</h3>
    <p className='text-sm text-slate-600 mb-6'>
      Join us today by entering your details below.
    </p>

    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

    <form onSubmit={handleSignup} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          label="Full Name"
          placeholder="John Doe"
          type="text"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
          placeholder="abc@example.com"
          type="text"
        />
        <div className='col-span-2'>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />
        </div>
      </div>

      {error && <p className='text-red-500 text-xs'>{error}</p>}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type='submit'
        className='btn-primary w-full transition-all duration-300'
      >
        SIGN UP
      </motion.button>

      <p className='text-sm text-center mt-3'>
        Already have an account?{" "}
        <Link className='font-medium text-primary underline' to="/">
          Login
        </Link>
      </p>
    </form>
  </motion.div>
</AuthLayout>

  )
}

export default Signup
