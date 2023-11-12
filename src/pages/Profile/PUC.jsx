import React from 'react'
import AuthLayout from '../../layouts/Layout'
import PublicUserProfile from '../../components/Profile/PublicUserProfile'

const PUC = () => {
  return (
    <AuthLayout>
        <PublicUserProfile />
    </AuthLayout>
  )
}

export default PUC