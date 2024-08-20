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

const Dashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [budgetListInfo, setBudgetListInfo] = useState([]);
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState(0)
  const [amount, setAmount] = useState(0)
  const [info, setInfo] = useState(null)

  useEffect(() => {
    if (user) {
      getInfo()
    }
  }, [user]);

  const getInfo = async () => {

    try {
      const result = await db.select().from(UserStats).where(eq(UserStats.userid, user.id))

      if (result.length > 0) {
        // console.log(result)
        setInfo(result[0])
      } else {
        console.log('not set up')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setup = async () => {
    try {
      const result = await db.insert(UserStats).values({
        id: Date.now(),
        income: income,
        total: amount,
        userid: user.id,
        month: Number(new Date().getMonth() + 1),
        year: new  Date().getFullYear()
      })
      if (result) {
        toast({
          title: "profile updated"
        })
        console.log(result)
        setAmount(0)
        setIncome(0)
      }
      else{console.log("error")}
    } catch(error) {
      console.log('error', error)
    }
  }


  return (
    <div>
      {/* Add something to set money or this will be automatic */}
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
              {info? <div>
                <h2>No Messages </h2>
              </div> : <div className='flex flex-col gap-3'>
                <h2>Finish Account Set Up</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='w-full'>Set Up Profile</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        <h2 className='text-xl font-bold'>Finish Profile Set Up</h2>
                        <h2 className='text-sm font-light'>all information is encrypted so only you know these details</h2>
                      </DialogTitle>
                      <DialogDescription>
                        <div className='p-3 flex flex-col gap-2'>
                          <h2>Income</h2>
                          <Input type='number' value={income} onChange={(e) => setIncome(e.target.value)} placeholder="eg. 5000" />
                        </div>
                        <div className='p-3 flex flex-col gap-2'>
                          <h2>Do you currently have a preset amount of money?</h2>
                          <Input value={amount} type='number' onChange={(e) => setAmount(e.target.value)} placeholder="eg. 5000 (optional: leave blank if no)" />
                        </div>
                      </DialogDescription>

                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button className='my-5' onClick={()=>setup()}>Submit</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>  }


            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className='text-3xl h-80 flex justify-center items-center animate-pulse'>
        <EyeIcon size={64} />
      </div>
    </div>
  );
};

export default Dashboard
