import { cookies } from 'next/headers';

interface AuthResponse {
   authenticated: boolean;
   user?: string;
}

export default async function handler(
   req: Request,
   res: {
      status: (code: number) => {
         json: (body: AuthResponse) => void;
      };
   }
) {
   const authToken = (await cookies()).get('auth-token');
   if (!authToken) return res.status(401).json({ authenticated: false });

   const user = authToken.value;
   // const user = await validateToken(authToken);
   return res.status(200).json({ authenticated: true, user });
}