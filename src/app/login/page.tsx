import AuthForm from '@/components/AuthForm'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function LoginPage() {
   return (
      <div className='flex justify-center items-center h-screen'>
         <Card className='w-96 bg-white shadow-md rounded-lg p-6'>
            <CardHeader className='text-center'>
               <CardTitle className='text-2xl font-bold'>Login Page</CardTitle>
            </CardHeader>
            <AuthForm type='login' />
         </Card>
      </div>
   )
}

export default LoginPage