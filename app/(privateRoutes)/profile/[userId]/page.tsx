import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session';
import React from 'react'
import { authOptions } from '@/lib/auth';
import { getAllUsers, getOneUserById } from '@/lib/daos/userDao';

const page = async ({ params }: { params: { userId: string } }) => {
  const user = await getCurrentUser();
  console.log('user', user);

  if (!user) {
    redirect(authOptions?.pages?.signIn ? `${authOptions?.pages?.signIn}?next=%2Fprofile/${params.userId}` : "/?next=%2Fprofile");
  }

  return (
    <div className="w-full h-full bg-white flex justify-center items-center">
        <div>
            <h1 className='text-2xl'>
                Authorized User Page {params.userId}
            </h1>
        </div>
    </div>
  )
}

export async function generateStaticParams() {
  const users = await getAllUsers();
  console.log("users", users);
  return users.map((user) => ({
    params: { userId: user._id },
  }))
}

export default page