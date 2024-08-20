import { PiggyBank } from 'lucide-react'
import React from 'react'

const Cards = ({saved, goal, left, count}) => {
    return (
        <div className='mt-4 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                <div className='flex flex-col gap-1'>
                    <h2 className='text-lg'>Total Goal</h2>
                    <h2 className='text-xl flex items-center gap-3 font-bold'>${goal>0? goal : 0}</h2>
                </div>
                <div className='bg-primary text-white rounded-full p-3'>
                    <PiggyBank />
                </div>

            </div>
            <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                <div className='flex flex-col gap-1'>
                    <h2 className='text-lg'>Total Saved</h2>
                    <h2 className='text-xl flex items-center gap-3 font-bold'>${saved>0? saved :0}</h2>
                </div>
                <div className='bg-primary text-white rounded-full p-3'>
                    <PiggyBank />
                </div>

            </div>
            <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                <div className='flex flex-col gap-1'>
                    <h2 className='text-lg'>Total Left</h2>
                    <h2 className='text-xl flex items-center gap-3 font-bold'>${left>0? left : 0}</h2>
                </div>
                <div className='bg-primary text-white rounded-full p-3'>
                    <PiggyBank />
                </div>

            </div>
            <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                <div className='flex flex-col gap-1'>
                    <h2 className='text-lg'>Number of Trackers</h2>
                    <h2 className='text-xl flex items-center gap-3 font-bold'>{count>0? count :0}</h2>
                </div>
                <div className='bg-primary text-white rounded-full p-3'>
                    <PiggyBank />
                </div>

            </div>

        </div>
    )
}

export default Cards