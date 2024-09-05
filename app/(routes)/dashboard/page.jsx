'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../../../utils/dbConfig';
import { Bills, Budgets, Expenses, Income, Savings, SavingsDeposits } from '../../../utils/schema';
import DashCards from './_components/dash_comp/DashCards'
import SetIncome from './_components/dash_comp/SetIncome'
import RadialChart from './_components/charts/RadialChart'
import PieChartDash from './_components/charts/PieChartDash'

const Dashboard = () => {
  const thisyear = Number(new Date().getFullYear())
  const thismonth = Number(new Date().getMonth())
  const { user } = useUser();

  const [totalOut, setOut] = useState(0)
  const router = useRouter();
  // const [budgetListInfo, setBudgetListInfo] = useState([]);
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState(0)
  const [month, setMonth] = useState(thismonth)
  const [year, setyear] = useState(thisyear)
  const [info, setInfo] = useState(null)
  const [past, setPast] = useState(false)
  const [billTotal, setBillTotal] = useState(0)
  const [saved, setSaved] = useState(0)

  const GetInfo = async () => {
    try {
      const result = await db.select().from(Income).where(and(eq(month, Income.month), eq(year, Income.year), eq(user.id, Income.userid)))
      if (result.length > 0) {
        // console.log(month, result)
        setIncome(result[0].income)
        setInfo(result[0])
      } else {
        console.log('none')
        setIncome(0)
        setInfo(null)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    GetInfo()
    getExpenses()
    getSaved()
  }, [year, month])

  const convertTimestampToDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    const year = date.getFullYear();
    const month = date.getMonth();

    return { month, year };
  };

  const extractMonth = (date) => {
    if (date) {
      const arr = date.split("/")
      return Number(arr[1]);
    }
    return null
  }

  const extractYear = (date) => {
    if (date) {
      const arr = date.split("/")
      return Number(arr[2]);
    }
    return null
  }

  const getExpenses = async () => {
    try {
      const result = await db.select({
        amount: Expenses.amount,
        budget: Budgets.name,
        date: Expenses.id,
        retired: Budgets.retired
      })
        .from(Expenses)
        .leftJoin(Budgets, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Expenses.createdBy, user.id))
      // .orderBy(desc(Expenses.id))
      if (result.length>0) {

        const filtered = result.filter(expense => expense.retired !== true)
        const timefilter = filtered.filter(expense => convertTimestampToDate(expense.date).month == month && convertTimestampToDate(expense.date).year == year)

        const groupedExpenses = timefilter.reduce((acc, expense) => {
          const budgetName = expense.budget;
          if (!acc[budgetName]) {
            acc[budgetName] = 0;
          }
          acc[budgetName] += Number(expense.amount);
          return acc;
        }, {});

        const expensesArray = Object.keys(groupedExpenses).map(budgetName => ({
          name: budgetName,
          uv: groupedExpenses[budgetName],
          fill: '#83a6ed'
        }));

        setExpenses(expensesArray);

        let totalSpend = 0

        const result2 = await db.select({
          ...getTableColumns(Bills)
        })
          .from(Bills)
          .where(eq(Bills.createdBy, user.id))
          .groupBy(Bills.id);

        if (result2.length>0) {
          const filtered = result2.filter(element => extractMonth(element.date) === month + 1 && extractYear(element.date) === year && element.paid === true);

          filtered.forEach(bill => {
            totalSpend = totalSpend + Number(bill.charge);
          });

          setBillTotal(totalSpend)

          timefilter.forEach(item => {
            totalSpend = totalSpend + Number(item.amount)
            // console.log(convertTimestampToDate(item.date).month)
          })
          setOut(totalSpend)
        }
      }
      // console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const getSaved = async () => {
    try {
      const result = await db.select({
        date: SavingsDeposits.id,
        amount: SavingsDeposits.amount
      }).from(SavingsDeposits).where(eq(SavingsDeposits.createdBy, user.id))

      if (result) {
        const timefilter = result.filter(deposit => convertTimestampToDate(deposit.date).month == month && convertTimestampToDate(deposit.date).year == year)
        console.log(timefilter)

        let totalSaved = 0

        timefilter.forEach(deposit => {
          totalSaved = totalSaved + Number(deposit.amount)
        })

        setSaved(totalSaved)
      }

    } catch (error) {

    }
  }

  return (
    <div className='p-10'>
      <div className='flex items-center justify-between'>
        <div className='p-5'>
          <h2 className=' font-bold text-3xl'>Hi {user?.firstName}!</h2>
          <p>Let's see what's happening with your money</p>
        </div>
        <SetIncome income={income} setIncome={setIncome} info={info} userid={user.id} month={month} year={year} getInfo={() => GetInfo()} />
      </div>

      <DashCards totalOut={totalOut} setyear={setyear} setMonth={setMonth} income={income} setIncome={setIncome} month={month} year={year} userid={user.id} thismonth={thismonth} thisyear={thisyear} saved={saved} />

      <div className='grid sm:grid-cols-1 md:grid-cols-2 grid-cols-2 gap-4'>
        <PieChartDash income={income} expenses={totalOut} saved={saved} />
        <RadialChart totalOut={Number(totalOut)} income={Number(income)} expenses={expenses} billTotal={Number(billTotal)} />

      </div>

    </div>
  );
};

export default Dashboard;
