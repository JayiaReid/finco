'use client';
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftToLine, EyeIcon, Trash } from 'lucide-react';
import { db } from '../../../../../utils/dbConfig';
import { Savings, SavingsDeposits } from '../../../../../utils/schema';
import { desc, eq } from 'drizzle-orm';
import Tracker from '../_components/Tracker';
import AddDeposit from '../_components/AddDeposit'
import { Button } from '../../../../../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../../../components/ui/alert-dialog';
import { toast } from '../../../../../components/ui/use-toast';

const History = () => {
  const { id } = useParams();
  const [info, setInfo] = useState({})
  const [deposits, setDeposits] = useState([])

  useEffect(() => {
    getInfo()
    getDeposits()
  }, [id])

  const router = useRouter()

  const getInfo = async () => {
    try {
      const result = await db.select().from(Savings).where(eq(id, Savings.id))
      if (result) {
        console.log(result)
        setInfo(result[0])
      }
    } catch (error) {
      console.log(error)
    }

  }

  const getDeposits = async () => {
    try {
      const result = await db.select()
      .from(SavingsDeposits)
      .where(eq(SavingsDeposits.savingsId, id))
      .orderBy(desc(SavingsDeposits.id))
      if (result) {
        setDeposits(result)
      }
    } catch (error) {
      console.log(error)
    }

  }

  

  const deleteDeposit = async (Depositid, amount) =>{
    try {
      const result = await db.delete(SavingsDeposits).where(eq(Depositid,SavingsDeposits.id ))

      if(result){
        const res = await db.update(Savings).set({
          saved: Number(saved)-Number(amount),
          left: Number(left)+Number(amount)
      }).where(eq(Savings.id, id))
      if(res){
          refreshData()
      }
        refreshData()
      }
    } catch (error) {
      
    }
  }

  const deleteSaving = async () =>{
    try {
      const result = await db.delete(SavingsDeposits).where(eq(id,SavingsDeposits.savingsId ))
      
      if(result){
        const res = await db.delete(Savings).where(eq(id,Savings.id ))
        if(res){
          toast({
            title: " Deleted successfully"
          });
          router.push('/dashboard/savings')
        }
      }
    } catch (error) {
      
    }
  }

  const refreshData = ()=>{getDeposits(); getInfo();}

  const convertTimestampToDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  return (
    <div className='p-10'>
      <h2 onClick={() => router.push('/dashboard/savings')} className='m-2 cursor-pointer items-end justify-end font-semibold flex gap-2'><ArrowLeftToLine /> Go Back to Savings</h2>
      <div className='flex justify-between items-center'>
        <h2 className='p-5 font-bold text-3xl'>Savings Deposit History</h2>
        <div className='flex gap-2 items-center'>
        <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' className='shadow-sm'>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure you want to delete this tracker?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteSaving()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button>Edit</Button>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2'>
        <div className='lg:col-span-2'>
          <Tracker item={info} />
        </div>

        <AddDeposit refreshData={refreshData} left={info?.left} saved={info?.saved} id={id} />
      </div>

      <div className='mt-5 border'>
        <div className='font-bold bg-primary text-primary-foreground grid grid-cols-3 p-2'>
          <h2>
            Date
          </h2>
          <h2>
            Amount
          </h2>
          <h2>
            Action
          </h2>
        </div>
        {deposits?.map((deposit, index) => (
          <div key={index} className='grid grid-cols-3 bg-muted p-2'>
            <h2>
              {convertTimestampToDate(deposit?.id)}
            </h2>
            <h2>
              ${deposit?.amount}
            </h2>
            <h2 className='cursor-pointer'>
              <Trash onClick={() => deleteDeposit(deposit?.id)} className='text-destructive' />
            </h2>
          </div>
        ))}
      </div>

    </div>
  )
}

export default History