import React from 'react';
import Card from '../../assets/images/Card.png';
import { LuTrendingUpDown } from 'react-icons/lu';
import {motion} from 'framer-motion'

const AuthLayout = ({ children }) => {

  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
   <motion.h2
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-text-shimmer"
    >
      Expense Tracker
    </motion.h2>

        {children}
      </div>

      <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10" />
        <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5" />
        <div className='grid grid-cols-1 z-20'>
          <StatsInfoCard
          icon={<LuTrendingUpDown/>}
          label="Track your Income & Expenses"
          value="430000"
          color="bg-primary"
          />
        </div>
        <img
          src={Card}
          alt="Card"
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15"

        />
      </div>
    </div>
  );
};  

export default AuthLayout;



const StatsInfoCard=({icon,label,value,color})=>{ 
  return <div className='flex gap-6 bg-white p-4 rounded-xl items-center shadow-md shadow-purple-400/10 border border-grey-200/50 z-10'>
    <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
      {icon}
    </div>
    <div>
      <h6 className='text-xs text-gray-500 mb-1'>{label}</h6>
      <span className='text-[20px] &#x20B9'>₹{value}</span>
    </div>
  </div>
}