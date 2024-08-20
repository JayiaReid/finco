"use client"
import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { Button } from "../../components/ui/button"


const Header = () => {
  const {user, isSignedIn} = useUser();

  return (
    <div className='p-5 flex bg-transparent justify-between'>
        <Image src={'/budget.png'} width={60} height={100}/>
        {isSignedIn?
          <UserButton/>:
          <div className='flex gap-2'>
          <Link href={'/sign-in'}>
            <Button className='shadow-md bg-secondary text-secondary-foreground hover:text-primary-foreground'>Log In</Button>
          </Link>
          <Link href={'/sign-up'}>
            <Button className='shadow-md hover:bg-secondary hover:text-secondary-foreground'>Sign Up</Button>
          </Link>
          </div>
}
        
    </div>
  )
}

export default Header