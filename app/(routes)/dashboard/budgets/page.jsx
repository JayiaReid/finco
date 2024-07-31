"use client"
import React, { useState } from 'react'
import BudgetList from './_components/List'
import CreateBudget from './_components/CreateBudget'
import { useUser } from '@clerk/nextjs'

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
      <h2 className='p-5 font-bold text-3xl flex gap-5 items-center'>My Budgets <CreateBudget edit={false} exisitingData={null} refreshData={()=>getBudgets()} /></h2>
      <BudgetList/>
    </div>
  )
}

export default Budgets