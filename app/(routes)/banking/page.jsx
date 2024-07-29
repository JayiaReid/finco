"use client"
import { EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Banking = () => {
  const Router = useRouter()

  return (
    <div onClick={()=>Router.push('/')} className='text-4xl cursor-pointer animate-pulse h-screen flex items-center justify-center'>
      <h2 className='font-extrabold'>Coming Soon</h2>
      <EyeOff className='text-4xl'/></div>
  )
}

export default Banking