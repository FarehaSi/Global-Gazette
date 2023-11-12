import React from 'react'
import AuthLayout from '../../layouts/Layout'
import Navigation from '../../components/Profile/Navigation'
import Create from '../../components/Profile/Categories/Create'
import List from '../../components/Profile/Categories/List'

const Categories = () => {
  return (
    <AuthLayout>
        <Navigation />
        <div className="container py-5">
            <div className="row">
                <div className="col-md-4">
                    <Create />
                </div>
                <div className="col-md-8">
                    <List />
                </div>
            </div>
        </div>

        
    </AuthLayout>
  )
}

export default Categories