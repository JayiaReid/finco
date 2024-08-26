"use client"
import { useUser } from '@clerk/nextjs'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const ExpensesOverview = () => {

  const router = useRouter()
  const {user} = useUser()

  useEffect(()=>{
    router.push('/dashboard/budgets')
  }, [user])

  return (
    <div className='flex justify-center items-center animate-spin h-screen'>
       <Loader2Icon />
    </div>
  )
}

export default ExpensesOverview