import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session';
import React from 'react'
import { authOptions } from '@/lib/auth';

const page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn ? `${authOptions?.pages?.signIn}?next=%2Ffinanical` : "/?next=%2Ffinanical");
  }

  return (
    <div className="w-full h-full bg-white flex justify-center items-center">
        <div>
            <h1 className='text-2xl'>
                Authorized Finanical Information Page
            </h1>
        </div>
    </div>
  )
}

export default page