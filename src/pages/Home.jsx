import React from 'react'
import Hero from '../components/home/Hero'
import Articles from '../components/articles/Articles'
import NavBar from '../components/NavBar'
import AuthLayout from '../layouts/Layout'

const Home = () => {
  return (
    <div>
        <AuthLayout>
          <Hero />
          <Articles />
        </AuthLayout>
        
    </div>
  )
}

export default Home