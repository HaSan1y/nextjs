import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

export async function POST() {

   try {
      const cookieStore = await cookies()
      cookieStore.set('auth-token', '', {
         maxAge: 0,
         path: '/',
         domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '',
         sameSite: 'lax',
         secure: process.env.NODE_ENV === 'production',  // only set secure in production
      })
      return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
   } catch (error) {
      // Handle errors and return an appropriate response
      console.error('Error logging out:', error)  //err for client
      return NextResponse.json({ error: 'An error occurred while logging out' }, { status: 500 })
   }
}