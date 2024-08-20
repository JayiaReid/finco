'use client';
import { UserButton, useUser } from '@clerk/nextjs';
import { Loader2Icon, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Card from '../../_components/Card';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '../../../../../utils/schema';
import Chart from '../../_components/Chart'
import Budget from './Budget';
import ExpensesList from '../../expenses/_components/ExpensesList';
import { db } from '../../../../../utils/dbConfig';

const BudgetDashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [budgetListInfo, setBudgetListInfo] = useState([]);
  const [expenses, setExpenses]=useState([])

  useEffect(() => {
    if (user) {
      getBudgets();
    }
  }, [user]);

  const getExpenses = async () =>{
    if(!user) return;

    try{
      const result = await db.select({
        ...getTableColumns(Expenses),
        icon: Budgets.icon,
        retired: Budgets.retired
      })
      .from(Expenses)
      .leftJoin(Budgets, eq(Budgets.id, Expenses.budgetId))  // Use Budgets table directly in leftJoin
      .where(eq(Expenses.createdBy, user.id))
      .orderBy(desc(Expenses.id))

      const filtered = result.filter(expense => expense.retired !== true)

      const filtered2 = filtered.filter((expense, index)=>index<5)
      setExpenses(filtered2)
    }catch (error) {
      console.error('Error fetching budgets:', error);
  }
}

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

      const currentBudgets = result.filter(budget => budget.retired !== true)
      const noBills = currentBudgets.filter(budget => !budget.name.includes("Bills"));

      setBudgetListInfo(noBills)
    //   console.log(budgetListInfo)

      getExpenses()
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  if (!user) {
    return <div className='h-screen flex items-center justify-center'><Loader2Icon className='animate-spin'/></div>;
  }

  return (
    <div>
      {/* Add something to set money or this will be automatic */}
      <Card list={budgetListInfo} />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-5 gap-5'>
        
        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 md:col-span-2'>
          {/* <h2 className='font-bold text-xl'>Latest Budgets</h2> */}
          {budgetListInfo?.map((item, index)=>(
            <Budget item={item}/>
          ))}
        </div>
        <div className='row-span-10'>
          <Chart list={budgetListInfo} />
          <h2 className='font-bold text-xl mt-3'>Latest Expenses</h2>
          <ExpensesList icon={true} list={expenses} refreshData={getBudgets}/>
        </div>
      </div>
    </div>
  );
};

export default BudgetDashboard
