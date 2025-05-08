import { NextRequest, NextResponse } from 'next/server';
// import type{}

// interface AuthResponse {
//    authenticated: boolean;
//    user?: string;
// }

export async function GET(req: NextRequest): Promise<NextResponse> {
   const authToken = req.cookies.get('auth-token');

   if (!authToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
   }

   const user = authToken.value;
   // const user = await validateToken(authToken); // Uncomment if token validation logic is added
   return NextResponse.json({ authenticated: true, user }, { status: 200 });
}
