import { redirect } from 'next/navigation';
import Signin from '@/components/Signin';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';
import React from 'react';

const page = async ({
    searchParams: { next }
  }: {
    searchParams: { next?: string }
  }) => {
  const user = await getCurrentUser();

  if (user) {
    redirect(next || "/profile");
  }

  return (
    <div className='w-full h-full bg-white flex justify-center items-center'>
        <Signin />
    </div>
  )
}

export default page