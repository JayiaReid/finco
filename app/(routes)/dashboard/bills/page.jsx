"use client"
import { CheckIcon, DollarSign, EyeOff, Info, Loader, LogOut, Pencil, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CreateBill from './_components/CreateBill'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import { db } from '../../../../utils/dbConfig'
import { Bills } from '../../../../utils/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import BillCards from './_components/Cards'
import { Checkbox } from '../../../../components/ui/checkbox'

// set up logic about repeating bills
// set up year logic as well
// set up the calculations as well
// Fix gridding
// set up user money stats using dashboard icon to finish setting up
// where income per month is defined
// set up budget and plan expiry

const BillsPage = () => {

  const [consistentBills, setCBills] = useState([])
  const [inconsistentBills, setIBills] = useState([])
  const [onceBills, setOBills] = useState([])
  const [totalPaid, setTotalPaid] = useState(0)
  const [billBudget, setBillBudget] = useState(0)
  const [leftToPay, setLeftToPay] = useState(0)
  const [paidBills, setPaidBills] = useState([])
  const [pending, setPending] = useState([])
  const [month, setMonth] = useState(new Date().getMonth())

  const { user } = useUser()

  useEffect(() => {
    if (user) {
      getBillsList()
    }
  }, [user, month])

  const extractMonth = (date) => {
    if (date) {
      const arr = date.split("/")
      return Number(arr[1]);
    }
    return null
  }

  const getBillsList = async () => {
    if (user) {
      const result = await db.select().from(Bills).where(eq(Bills.createdBy, user.id))

      if (result) {
        const filteredBills = result.filter(element => extractMonth(element.date) === month + 1)
        const paid = filteredBills.filter(bill => bill.paid)
        const pending = filteredBills.filter(bill => !bill.paid)

        setPaidBills(paid)
        setPending(pending)
      }
    }
  }

  const setPaid = async (id, status) => {

    const result = await db.update(Bills).set({
      paid: status
    }).where(eq(Bills.id, id))

    getBillsList()
  }

  return user ? (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-3xl'>Tracking Bills</h2>
        <div className='flex gap-3 items-center'>
          <CreateBill refreshData={getBillsList} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info />
              </TooltipTrigger>
              <TooltipContent className='bg-secondary text-secondary-foreground'>
                <h2 className='font-bold p-2'>
                  Keep Track of mandatory expenses and their deadlines
                </h2>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <BillCards
        billBudget={billBudget}
        setBillBudget={setBillBudget}
        totalPaid={totalPaid}
        leftToPay={leftToPay}
        month={month}
        setMonth={setMonth}
        userid={user.id}
      />

      <div className='mt-5'>
        <h2 className='text-2xl font-bold'>Pending Bills</h2>
        {pending.length > 0 ? <div className='grid gap-4 mt-5 grid-cols-3 lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2'>
          {pending.map((bill, index) => (
            // <div key={index} className='rounded-lg p-5 border flex flex-col gap-2'>
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <h2 className="rounded-full bg-accent text-2xl p-3">
                    {bill?.icon}
                  </h2>
                  <div>
                    <h2 className="font-bold">
                      {bill?.name}
                    </h2>

                  </div>
                </div>
                <h2 className="font-bold text-primary">${bill?.charge}</h2>
              </div>
              <h2 className='text-md mt-5 flex gap-3'><div className='font-semibold'>Bill Date:</div> {bill?.date}</h2>
              <h2 className='text-md mt-5 flex items-center gap-3'><Checkbox id="status" onClick={() => setPaid(bill?.id, true)} /> <label htmlFor='status' className='font-semibold'>Paid?</label></h2>
            </div>
          ))}
        </div> : <h2 className='text-lg p-5 flex justify-center'>No Pending Bills</h2>}
      </div>

      <div className='mt-5'>
        <h2 className='text-2xl font-bold'>Paid Bills</h2>
        {paidBills.length > 0 ? <div className='grid gap-4 mt-5 lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2'>
          {paidBills.map((bill, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <h2 className="rounded-full bg-accent text-2xl p-3">
                    {bill?.icon}
                  </h2>
                  <div>
                    <h2 className="font-bold">
                      {bill?.name}
                    </h2>

                  </div>
                </div>
                <h2 className="font-bold text-primary">${bill?.charge}</h2>
              </div>
              <h2 className='text-md mt-5 flex gap-3'><div className='font-semibold'>Bill Date:</div> {bill?.date}</h2>
              <h2 className='text-md mt-5 flex items-center gap-3'><CheckIcon className='cursor-pointer' id="status" onClick={() => setPaid(bill?.id, false)} /> <label htmlFor='status' className='font-semibold'>Paid?</label></h2>
            </div>
          ))}</div> : <h2 className='text-lg p-5 flex justify-center'>No Paid Bills </h2>
        }


      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center'><Loader className='animate-spin' /></div>
  );
}

export default BillsPage
