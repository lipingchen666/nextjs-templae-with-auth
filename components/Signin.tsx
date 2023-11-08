'use client'
import React from 'react'
import { signIn, signOut } from "next-auth/react";

const Signin = () => {
  return (
    <div className='flex space-x-6'>
        <button className='sign-in-bbutton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => { signIn('okta')}}>
            Sign in
        </button>
        <button className='sign-out-button bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded' onClick={() => { signOut() }}>
            Sign out
        </button>
    </div>
  )
}

export default Signin