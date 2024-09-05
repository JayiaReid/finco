import React, { useState } from 'react'
// import Link from 'next/link';
// import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogClose, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
// import { Input } from '../../../components/ui/input';
// import Card from '../Card';
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../../../../../utils/dbConfig';
import { Income } from '../../../../../utils/schema';
// import Chart from './_components/Chart'
// import Budget from './budgets/_components/Budget';
// import ExpensesList from './expenses/_components/ExpensesList';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../components/ui/popover';
import { Button } from '../../../../../components/ui/button';
// import Link from 'next/link';
import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogClose, DialogHeader, DialogTitle, DialogDescription } from '../../../../../components/ui/dialog';
import { Input } from '../../../../../components/ui/input';
import { toast } from '../../../../../components/ui/use-toast'

const SetIncome = ({income, setIncome, info, userid, month, year, getInfo}) => {
    // const [info, setInfo] = useState(null)
    

    const setup = async (edit) => {
        try {
          if (edit) {
            const result = await db.update(Income).set({
              income
            }).where(and(eq(Income.userid, userid),eq(Income.month, month)),eq(Income.year, year))
            if (result) {
              console.log('edited')
              toast({
                title: "Profile updated"
              })
              console.log(month, result)
            }
          } else {
            const result = await db.insert(Income).values({
              id: Date.now(),
              income: income,
              userid: userid,
              month: month,
              year: year
            })
            if (result) {
              toast({
                title: "Profile updated"
              })
              console.log(month, result)
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
          setIncome(0); 
        }
      }
    

  return (
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
                <h2>Add Income for Month</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='w-full'>Set Income</Button>
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
  )
}

export default SetIncome