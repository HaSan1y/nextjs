import AuthForm from '@/components/AuthForm'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function SignUpPage() {
   return (
      <div className='flex justify-center items-center h-screen'>
         <Card className='w-96 shadow-md rounded-lg p-6'>
            <CardHeader className='text-center'>
               <CardTitle className='text-2xl font-bold'>SignUp</CardTitle>
            </CardHeader>
            <AuthForm type='signUp' />
         </Card>
      </div>
   )
}

export default SignUpPage