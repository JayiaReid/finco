'use client';
import { UserButton, useUser } from '@clerk/nextjs';
import { EyeIcon, Loader2Icon, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Card from './_components/Card';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../../../utils/dbConfig';
import { Budgets, Expenses, UserStats } from '../../../utils/schema';
import Chart from './_components/Chart'
import Budget from './budgets/_components/Budget';
import ExpensesList from './expenses/_components/ExpensesList';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogClose, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { toast } from '../../../components/ui/use-toast'
import Image from 'next/image';
import DashCards from './_components/DashCards'

const Dashboard = () => {
  const thisyear = Number(new Date().getFullYear())
  const thismonth = Number(new Date().getMonth())
  const { user } = useUser();
  const router = useRouter();
  const [budgetListInfo, setBudgetListInfo] = useState([]);
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState(0)
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setyear] = useState(new Date().getFullYear())
  const [info, setInfo] = useState(null)
  const [past, setPast] = useState(false)

  useEffect(() => {
    if (user) {
      getInfo()
    }
  }, [user, year, month]);

  useEffect(() => {
    calculatePastMonths();
  }, [month, year]);

  const calculatePastMonths = () => {
    if (month < thismonth && year == thisyear) {
      setPast(true)
    }
    else if (year < thisyear) {
      setPast(true)
    } else {
      setPast(false)
    }
  }

  const getInfo = async () => {
    try {
      const result = await db.select().from(UserStats)
        .where(eq(UserStats.userid, user.id))
        .where(eq(UserStats.month, month + 1))
        .where(eq(UserStats.year, year))

      if (result.length > 0) {
        console.log(result)
        setInfo(result[0])
        setIncome(result[0].income);
      } else {
        setIncome(0)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to fetch user info",
        variant: "destructive"
      })
    }
  }

  const setup = async (edit) => {
    try {
      if (edit) {
        const result = await db.update(UserStats).set({
          income
        }).where(eq(UserStats.userid, user.id))
          .where(eq(UserStats.month, month + 1))
          .where(eq(UserStats.year, year))
        if (result) {
          console.log('edited')
          toast({
            title: "Profile updated"
          })
          console.log(result)
        }
      } else {
        const result = await db.insert(UserStats).values({
          id: Date.now(),
          income: income,
          userid: user.id,
          month: month + 1,
          year: year
        })
        if (result) {
          toast({
            title: "Profile updated"
          })
          console.log(result)
        }
      }
      getInfo()
    } catch (error) {
      console.log('error', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setIncome(0); // Reset income only after the operation completes
    }
  }

  return (
    <div className='p-10'>
      <div className='flex items-center justify-between'>
        <div className='p-5'>
          <h2 className=' font-bold text-3xl'>Hi {user?.firstName}!</h2>
          <p>Let's see what's happening with your money</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline'>Income</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className='flex flex-col gap-3'>
              {info ? <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setIncome(info.income)} className='w-full'>Edit Income</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <h2 className='text-xl font-bold'>Edit Income for month</h2>
                    </DialogTitle>
                    <DialogDescription>
                      <div className='p-3 flex flex-col gap-2'>
                        <h2>Income</h2>
                        <Input type='number' value={income} onChange={(e) => setIncome(e.target.value)} placeholder="e.g. 5000" />
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button className='my-5' onClick={() => setup(true)}>Submit</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog> : <div className='flex flex-col gap-3'>
                <h2>Finish Account Set Up</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='w-full'>Set Up Profile</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        <h2 className='text-xl font-bold'>Finish Profile Set Up</h2>
                        <h2 className='text-sm font-light'>All information is encrypted so only you know these details</h2>
                      </DialogTitle>
                      <DialogDescription>
                        <div className='p-3 flex flex-col gap-2'>
                          <h2>Income</h2>
                          <Input type='number' value={income} onChange={(e) => setIncome(Number(e.target.value))} placeholder="e.g. 5000" />
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button className='my-5' onClick={() => setup(false)}>Submit</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <DashCards setyear={setyear} setMonth={setMonth} income={info?.income} month={month} year={year} userid={user.id} thismonth={thismonth} thisyear={thisyear} />
      <div className='text-3xl flex justify-center items-center'>
        <Image src='/dashobard.png' alt='Dashboard Overview' width={700} height={700} />

        {/* percentage of income to bills, expenses, savings */}

        {/* expenses to each budget by month including bills */}

        {/* percentage of out to in */}

        {/* change income */}
      </div>
    </div>
  );
};

export default Dashboard;
