'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses, Expenses as ExpensesTable } from '../../../../../utils/schema'; // Renaming the table import to avoid conflicts
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import Budget from '../../budgets/_components/Budget';
import AddExpense from '../_components/AddExpense'
import ExpensesList from '../_components/ExpensesList'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../components/ui/alert-dialog"
import { Button } from "../../../../../components/ui/button"
import { toast } from '../../../../../components/ui/use-toast';
import { ArrowLeftToLine, Trash } from 'lucide-react';

const ExpensesPage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [BudgetInfo, setInfo] = useState({})
  const [list, setList] = useState([])

  const router = useRouter()

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user]);

  const getBudgetInfo = async () => {
    try {
      const result = await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(CAST(${ExpensesTable.amount} AS NUMERIC))`.mapWith(Number),
        totalItems: sql`count(${ExpensesTable.id})`.mapWith(Number),
      })
        .from(Budgets)
        .leftJoin(ExpensesTable, eq(Budgets.id, ExpensesTable.budgetId))
        .where(eq(Budgets.createdBy, user.id))
        .where(eq(Budgets.id, id))
        .groupBy(Budgets.id);

      console.log(result);
      setInfo(result[0])
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }

    getExpensesList()
  };

  const getExpensesList = async () => {
    const result = await db.select().from(Expenses)
      .where(eq(Expenses.budgetId, id))
      .orderBy(desc(Expenses.id))
    console.log(result)
    setList(result)
  }

  const deleteBudget= async ()=>{
    try {
        if (!id) {
            throw new Error("Invalid ID provided");
        }
        const result2 = await db.delete(Expenses).where(eq(Expenses.budgetId, id))
        const result = await db.delete(Budgets).where(eq(Budgets.id, id))
        
        if (result.rowCount === 0 ) {
            throw new Error("No budget found with the provided ID");
        }
        toast({
          title: "Budget deleted successfully"
        });
        router.push('/dashboard/budgets'); 
    } catch (error) {
        toast({ title: "Error deleting budget"});
        throw error;
    }

    // ended at pasting the alert dialog for deleting budget
}

  return (
    <div className='p-10'>
      <h2 onClick={()=>router.push('/dashboard/budgets')} className='m-2 cursor-pointer items-end justify-end font-semibold flex gap-2'><ArrowLeftToLine/> Go Back to Budgets</h2>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold w-full'>My Expenses</h2>
        <div className='flex place-items-end w-full justify-end m-2 '>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='hover:bg-accent text-destructive bg-transparent outline-none border-none shadow-none'><Trash>Delete a Budget</Trash></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure you want to delete this budget?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
        <Budget item={BudgetInfo} />
        <AddExpense refreshData={getBudgetInfo} budgetId={id} userId={user?.id} />
      </div>
      <div className='mt-4'>
        <h2 className='font-bold text-lg'>Lastest Expenses</h2>
        <ExpensesList icon={false} refreshData={getBudgetInfo} list={list} />
      </div>
    </div>
  );
};

export default ExpensesPage;
