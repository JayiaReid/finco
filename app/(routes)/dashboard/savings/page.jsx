"use client"
import React, { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import { Info } from 'lucide-react'
import CreateSavings from './_components/CreateSavings'
import { db } from '../../../../utils/dbConfig'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { Savings, SavingsDeposits } from '../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import Tracker from './_components/Tracker'
import Link from 'next/link'
import Cards from './_components/Cards'

const SavingsPage = () => {

  const { user } = useUser()
  const [savingsList, setList] = useState([])
  const [retired, setRetired] = useState([])
  const [count, setCount] = useState(0)
  const [saved, setSaved] = useState(0)
  const [left, setLeft] = useState(0)
  const [goal, setGoal] = useState(0)

  useEffect(() => {
    getSavingsList()
  }, [user])



  const getSavingsList = async () => {
    try {
      const result = await db.select({
        ...getTableColumns(Savings),
        totalDeposits: sql`count(${SavingsDeposits.id})`.mapWith(Number),
      }).from(Savings)
        .leftJoin(SavingsDeposits, eq(SavingsDeposits.savingsId, Savings.id))
        .where(eq(user.id, Savings.createdBy))
        .groupBy(Savings.id)

      if (result) {

        const current = result.filter(item => item.retired !== true)
        const retired = result.filter(item => item.retired === true)
        setRetired(retired)
        setList(current)

        let count = 0
        let goal = 0
        let saved = 0
        let left = 0

        current.forEach(item => {
          count += 1
          goal += Number(item.goal)
          left += Number(item.left)
          saved += Number(item.saved)
        })
        setCount(count)
        setGoal(goal)
        setLeft(left)
        setSaved(saved)
      }


    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold p-5 text-3xl'>Savings Dashboard</h2>
        <div className='flex gap-3 items-center'>
          <CreateSavings refreshData={getSavingsList()} edit={false} existingData={null} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info />
              </TooltipTrigger>
              <TooltipContent className='bg-secondary text-secondary-foreground'>
                <h2 className='font-bold p-2'>
                  Track Savings Using Charts as well as keep track of deposit history
                </h2>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Cards saved={saved} goal={goal} left={left} count={count} />
      <h2 className='text-xl font-bold mt-5'>Trackers</h2>
      <div className='grid mt-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2'>
        {savingsList.map((item, index) => (
          <Tracker item={item} />
        ))}
      </div>
      
      <h2 className='font-bold my-5 text-2xl'>Retired Trackers</h2>

      {retired.length > 0 ? <div className='grid gap-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 '>
        {retired.map((item, index) => (
          <div key={index}>
            <Tracker item={item} />
          </div>
        ))}
      </div> : <h2 className='text-lg p-5 flex justify-center'>No retired trackers</h2>}

    </div>
  )
}

export default SavingsPage