"use client"
import { UserButton } from '@clerk/nextjs'
import { MessageCircleDashed } from 'lucide'
import { MenuIcon, MessageCircle, MessageCircleDashedIcon, SearchIcon } from 'lucide-react'
import React from 'react'
import ModeToggle from '../_components/Toggle'

// will be constant but has the profile, messages dark mode and search

const Dash_Header = ({showNav}) => {
  return (
    <div className='bg-primary p-2 flex justify-between items-center text-primary-foreground'>
        <div className='cursor-pointer'>
            <SearchIcon/>
        </div>
        {/* <div>
            Search Bar
        </div> */}
        <div className='flex gap-3 items-center'>
            <ModeToggle/>
            <MessageCircle className='cursor-pointer'/>
            <UserButton/>
        </div>
    </div>
  )
}

export default Dash_Header