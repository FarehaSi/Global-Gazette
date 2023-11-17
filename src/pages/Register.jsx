import React, { useState } from 'react'
import Guest from '../layouts/GuestLayout'
import Form from '../components/register/Form';
import AuthLayout from '../layouts/Layout';

const Register = () => {
  return (
    <AuthLayout>
        <Form />
    </AuthLayout>
  )
}

export default Register