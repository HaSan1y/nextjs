"use client"
import AuthForm from '../../components/AuthForm'
import { Card, CardHeader, CardTitle } from '../../components/ui/card'
// import { getUser } from '@/auth/server';
// import { useRouter } from 'next/navigation';
// import { User } from '@supabase/supabase-js';

function LoginPage() {
   // const [user, setUser] = useState<User | null>(null);
   // useEffect(() => {
   //    const fetchUser = async () => {
   //       const user = await getUser();
   //       if (!user || user === null) {
   //          console.log("Failed to retrieve user. not logged in Cookies disabled or session expired..");
   //          window.location.reload();

   //          // Handle the redirect logic on the client side here

   //       } else {
   //          console.log("User retrieved successfully:", user);
   //          const router = useRouter();
   //          setUser(user);
   //          router.push('/'); // Redirect to the home page or any other page you want
   //       }
   //    };

   //    fetchUser();
   // }, [user]);

   return (
      <div className='mt-20 flex flex-1 flex-col items-center'>
         <Card className='w-full max-w-md'>
            <CardHeader className='mb-4'>
               <CardTitle className='text-center text-3xl'>Login</CardTitle>
            </CardHeader>
            <AuthForm type='login' />
         </Card>
      </div>
   )
}

export default LoginPage
