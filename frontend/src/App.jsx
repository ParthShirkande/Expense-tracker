import { useState } from 'react'
import './App.css'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Toaster } from 'react-hot-toast' 

import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Home from './pages/Dashboard/Home'
import Expense from './pages/Dashboard/Expense'
import Income from './pages/Dashboard/Income'
import UserProvider from './context/UserContext'
import { useLocation } from 'react-router-dom'

const App = () => {

  return (
    <UserProvider>
      <div>
        <Toaster position='top-right' reverseOrder={false} />
        <Router>
          <Routes>
            <Route path='/' element={<Root />} />
            {/* Remove direct access to /login and /signup */}
            {/* <Route path='/login' element={<Login />} /> */}
            <Route path='/signup' element={<Signup />} />
            <Route path='/dashboard' element={<Home />} />
            <Route path='/income' element={<Income />} />
            <Route path='/expense' element={<Expense />} />
            {/* Catch-all route to redirect any unknown path to root */}
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  )
}

export default App

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token")
  const location = useLocation()

  if (!isAuthenticated && location.pathname === '/signup') {
    return <Signup />
  }
  return isAuthenticated ? (
    <Navigate to='/dashboard' />
  ) : (
    <Login /> // Show Login component at root if not authenticated
  )
}
