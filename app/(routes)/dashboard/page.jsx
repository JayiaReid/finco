'use client';
import { UserButton, useUser } from '@clerk/nextjs';
import { Loader2Icon, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Card from './_components/Card';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../utils/schema';
import Chart from './_components/Chart'
import Budget from './budgets/_components/Budget';
import ExpensesList from './expenses/_components/ExpensesList';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';

const Dashboard = () => {
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
      })
      .from(Expenses)
      .leftJoin(Budgets, eq(Budgets.id, Expenses.budgetId))  // Use Budgets table directly in leftJoin
      .where(eq(Expenses.createdBy, user.id))
      .orderBy(desc(Expenses.id))

      console.log(result)
      setExpenses(result)
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

      console.log(result);
      setBudgetListInfo(result)
      console.log(budgetListInfo)

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
      <div className='flex items-center justify-between p-5'>
        <div className=''>
        <h2 className='mt-5 font-bold text-2xl'>Hi {user?.firstName}!</h2>
        <p>Let's see what happening with your money and manage your expenses</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <MessageCircle className='cursor-pointer text-xl' />
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className='flex flex-col gap-3'>
              <h2>No messages yet</h2>
              <Button><Link href="/dashboard/messages">See All Messages</Link></Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Card list={budgetListInfo} />
      <div className='grid grid-cols-1 md:grid-cols-3 m-5 gap-5'>
        <div className='md:col-span-2'>
          <Chart list={budgetListInfo}/>
          <h2 className='font-bold text-xl mt-3'>Latest Expenses</h2>
          <ExpensesList icon={true} list={expenses} refreshData={getBudgets}/>
        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-xl'>Latest Budgets</h2>
          {budgetListInfo?.map((item, index)=>(
            <Budget item={item}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard
