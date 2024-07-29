"use client"
import Link from 'next/link'
import React from 'react'

const Plan = ({item, display}) => {
  return (
    <Link href={'/dashboard/plans/'+item?.id}>
    <div className='border rounded-lg p-5 hover:shadow-md text-secondary-foreground items-center flex gap-5'>
        <h2 className='rounded-full bg-accent p-3 text-xl'>{item?.icon}</h2>
        <div>
        {display ? (
          item.notes ? (
            <h2 className='font-light text-md'>
              {item?.notes}. The plan currently has {item?.totalItems > 0 ? item?.totalItems : 0} item(s)
            </h2>
          ) : (
            <h2>
              The plan currently has {item?.totalItems > 0 ? item?.totalItems : 0} item(s)
            </h2>
          )
        ) : (
          <div>
            <h2 className='text-xl font-bold'>{item?.name}</h2>
            <h2 className='text-xs font-light'>{item?.count > 0 ? item?.count : 0} Item(s)</h2>
          </div>
        )}
        </div>
    </div>
    </Link>
  )
}

export default Plan