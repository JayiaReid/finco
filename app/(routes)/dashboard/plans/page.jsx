"use client"
import React, { useEffect, useState } from 'react'
import CreatePlan from './_components/CreatePlan'
import { db } from '../../../../utils/dbConfig'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import { PlanItems, Plans } from '../../../../utils/schema'
import Plan from './_components/Plan'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip"

const plansPage = () => {

  const { user } = useUser()
  const [planlist, setPlanList] = useState([])

  useEffect(() => {
    getPlans()
  }, [user])

  const getPlans = async () => {
    if (!user) return;

    try {
      const result = await db.select({
        ...getTableColumns(Plans),
        count: sql `count(${PlanItems.id})`.mapWith(Number)
      }).from(Plans)
      .where(eq(Plans.createdBy, user.id))
      .leftJoin(PlanItems, eq(Plans.id, PlanItems.planId))
      .groupBy(Plans.id)
      .orderBy(desc(Plans.id))
      console.log(result)
      setPlanList(result)
      console.log(planlist);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }

  }


  return (
    <div className='p-10'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl p-5 font-bold flex gap-5'>My Plans <CreatePlan refreshData={getPlans} /></h2>
        <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info/>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Plans aka wishlists where u can add items and include notes and prices</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
        
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 m-4'>
      

      {planlist.map((item, index)=>(
        <Plan item={item} />
      ))}
      </div>
      
    </div>
  )
}

export default plansPage