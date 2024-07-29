import { EyeOff, Loader } from 'lucide-react'
import React from 'react'

const Messages = () => {
  return (
    <div className='text-4xl animate-pulse h-screen flex items-center justify-center'>
      <h2 className='font-extrabold'>Coming Soon</h2>
      <EyeOff className='text-4xl'/>
      {/* This page will show notifations:
        - If exxceeds a budget
        - Monthly Summary:
            - sum spent for the month 
            - New Budget Added 
            - Function to add to messages list and message component

        - on click of icon pop up with latest messages 
        - and status of read or not red has a distuguish if not read shows in pop up */}
    </div>
  )
}

export default Messages