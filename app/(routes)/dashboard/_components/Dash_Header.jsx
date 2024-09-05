"use client"
import { UserButton } from '@clerk/nextjs'
import { MessageCircleDashed } from 'lucide'
import { MenuIcon, MessageCircle, MessageCircleDashedIcon, SearchIcon } from 'lucide-react'
import React from 'react'
import ModeToggle from '../_components/Toggle'
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover"
import Link from 'next/link'

const Dash_Header = ({ showNav }) => {
  return (
    <div className='bg-primary p-2 flex justify-between items-center text-primary-foreground'>
      <div className='cursor-pointer'>
        
      </div>
      {/* <div>
            Search Bar
        </div> */}
      <div className='flex gap-3 items-center'>
        {/* <ModeToggle /> */}
        <Popover>
          <PopoverTrigger asChild>
            <MessageCircle className='cursor-pointer' />
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className='flex flex-col gap-3'>
              <h2>No messages yet</h2>
              <Button><Link href="/dashboard/messages">See All Messages</Link></Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default Dash_Header