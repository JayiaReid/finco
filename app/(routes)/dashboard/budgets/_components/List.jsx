'use client';

import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import { db } from '../../../../../utils/dbConfig';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import Budget from '../_components/Budget'

const BudgetList = () => {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState([])

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

  useEffect(() => {
    getBudgets()
  }, [user]);

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 m-4">
        {budgetList.map((budget, index)=>(
          
          <Budget refreshData={()=>getBudgets()} item={budget}/>
        ))}
      </div>
    </div>
  );
};

export default BudgetList;
