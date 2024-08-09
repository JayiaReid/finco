"use client"
import React, { useState } from 'react'
import BudgetList from './_components/List'
import CreateBudget from './_components/CreateBudget'
import { useUser } from '@clerk/nextjs'
import { Info } from 'lucide-react'

const Budgets = () => {

  const {user} = useUser()
  const [budgetList, setBudgetList]=useState([])

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

      setBudgetList(result)
      console.log(budgetList);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h2 className='p-5 font-bold text-3xl'>My Budgets </h2>
        <div className='flex items-center gap-3'>
        <CreateBudget edit={false} exisitingData={null} refreshData={()=>getBudgets()} />
          <Info/>
        </div>
      </div>
      
      <BudgetList/>
    </div>
  )
}

export default Budgets