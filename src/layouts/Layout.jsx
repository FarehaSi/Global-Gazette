import React from 'react'
import Navigation from '../components/Profile/Navigation'
import Navbar from '../components/NavBar'
import Footer from '../components/Footer'

const AuthLayout = ({ children }) => {
  return (
    <div>
        <Navbar />
        <div className=''>
            {children}
        </div>
        <Footer />
    </div>
  )
}

export default AuthLayout