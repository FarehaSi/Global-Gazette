import React, { useState } from 'react'
import Form from '../components/Login/Form';
import NavBar from '../components/NavBar';
import AuthLayout from '../layouts/Layout';

const Login = () => {
  return (
    <div>
        <AuthLayout>
          <Form />
        </AuthLayout>
    </div>
  )
}

export default Login