import Link from 'next/link'
import React from 'react'
import PieChartComponent from './PieChart'

const Tracker = ({ item }) => {

    const calculatePercentage = (num, goal) =>{
        const perc = (Number(num)/Number(goal))*100
        return Math.round(perc)
      }

    return (
        <Link href={'/dashboard/savings/' + item?.id}>
            <div className='p-4 border rounded-lg hover:shadow-md cursor-pointer'>

                <div className='flex gap-2 items-center'>
                    <h2 className='rounded-full bg-accent text-2xl p-3'>{item?.icon}</h2>
                    <h2 className='font-bold'>{item?.name}</h2>
                </div>
                <div className='flex items-center gap-2'>
                    <h2 className='font-semibold'>{calculatePercentage(item?.saved, item?.goal)}% saved</h2>
                    <PieChartComponent item={item} />
                    <h2 className='font-semibold'>{calculatePercentage(item?.left, item?.goal)}% left</h2>
                </div>


                <h2 className='text-md'><span className='font-semibold'>Goal: </span>${item?.goal}</h2>
                <h2 className='text-md'><span className='font-semibold'>Total Saved: </span>${item?.saved}</h2>
                <h2 className='text-md'><span className='font-semibold'>Amount Left: </span>${item?.left}</h2>
                <h2 className='text-md'><span className='font-semibold'>Number of Deposits: </span>{item?.totalDeposits>0? item?.totalDeposits : 0 }</h2>
            </div>
        </Link>
    )
}

export default Tracker