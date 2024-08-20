"use client"
import React, { useEffect, useState } from 'react'
import BudgetList from './_components/List'
import CreateBudget from './_components/CreateBudget'
import { useUser } from '@clerk/nextjs'
import { Info } from 'lucide-react'
import BudgetDashboard from './_components/budgetDashboard'
import Budget from './_components/Budget'
import { db } from '../../../../utils/dbConfig'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { Expenses, Budgets } from '../../../../utils/schema'

const BudgetsPage = () => {

  const {user} = useUser()
  const [budgetList, setBudgetList]=useState([])
  const [retiredBudgets, setRetiredBudgets]=useState([])

  const getBudgets = async () => {
    if (!user) return;

    try {
      const result = await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
        totalItems: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user.id))
      .groupBy(Budgets.id);
      
      const filtered = result.filter(budget => budget.retired == true)
      setRetiredBudgets(filtered)
      console.log(filtered);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  useEffect(()=>{
    getBudgets()
  },[user])

  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h2 className='p-5 font-bold text-3xl'>My Budgets </h2>
        <div className='flex items-center gap-3'>
        <CreateBudget edit={false} exisitingData={null} refreshData={()=>getBudgets()} />
          <Info/>
        </div>
      </div>
      
      {/* <BudgetList/> */}
      <BudgetDashboard/>
      <h2 className='font-bold my-4 text-2xl'>Retired Budgets</h2>
      <div className='grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 '>
        {retiredBudgets.map((budget, index)=>(
        <Budget key={index} item={budget} />
      ))}
      </div>
      
    </div>
  )
}

export default BudgetsPage