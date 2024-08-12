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
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '../../../../components/ui/dialog'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'

// set up logic about repeating bills
// set up the calculations as well
// set up user money stats using dashboard icon to finish setting up
// where income per month is defined
// set up budget and plan expiry
//repeats and .. inst working in saving

const BillsPage = () => {
  const thisyear = Number(new Date().getFullYear())
  const thismonth = Number(new Date().getMonth())
  const [consistentBills, setCBills] = useState([])
  const [inconsistentBills, setIBills] = useState([])
  const [onceBills, setOBills] = useState([])
  const [totalPaid, setTotalPaid] = useState(0)
  const [billBudget, setBillBudget] = useState(0)
  const [leftToPay, setLeftToPay] = useState(0)
  const [paidBills, setPaidBills] = useState([])
  const [pending, setPending] = useState([])
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setyear] = useState(new Date().getFullYear())
  const [past, setPast] = useState(false)
  const [charge, setcharge] = useState(0)

  const { user } = useUser()

  useEffect(() => {
    if (user) {
      getBillsList()
      calculatePastMonths()
    }
  }, [user, month, year])

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

  const extractDay = (date) => {
    if (date) {
      const arr = date.split("/")
      return Number(arr[0]);
    }
    return null
  }

  const createNextBill = async (bill, charge) => {

    const nextMonth = extractMonth(bill.date) + 1;

    const date = `${extractDay(bill.date)}/${nextMonth > 12 ? 1 : nextMonth}/${nextMonth > 12 ? extractYear(bill.date) + 1 : extractYear(bill.date)}`;
    const result = await db.insert(Bills).values({
      id: Date.now(),
      name: bill.name,
      charge: charge,
      consistency: bill.consistency,
      repeats: bill.repeats,
      date: date,
      createdBy: bill.createdBy,
      paid: false,
      icon: bill.icon
    })

    if (result) {
      console.log("saved", date)
      const result2 = await db.update(Bills).set({
        continued: true
      }).where(eq(Bills.id, bill.id))
    } else {
      console.log(error)
    }
    getBillsList()

  }

  const getBillsList = async () => {
    if (user) {
      const result = await db.select().from(Bills).where(eq(Bills.createdBy, user.id))

      if (result) {
        const monthFilter = result.filter(element => extractMonth(element.date) === month + 1)
        const filteredBills = monthFilter.filter(element => extractYear(element.date) === year)
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
        past={past}
        thisyear={thisyear}
        billBudget={billBudget}
        setBillBudget={setBillBudget}
        totalPaid={totalPaid}
        leftToPay={leftToPay}
        month={month}
        setMonth={setMonth}
        userid={user.id}
        year={year}
        setyear={setyear}
      />

      <div className='mt-5'>
        <h2 className='text-2xl font-bold'>Pending Bills</h2>
        {pending.length > 0 ? <div className='grid gap-4 mt-5 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1'>
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
              {bill?.repeats && bill?.consistency ?
                <h2 >
                  {bill?.continued == true ? <div className='text-md mt-5 flex items-center gap-3'>
                    <CheckIcon id="repeats" />
                    <label htmlFor='repeats' className='font-semibold'>Continues next month</label>
                  </div> : <div className='text-md mt-5 flex items-center gap-3'>
                    <Checkbox id="repeats" onClick={() => createNextBill(bill, bill.charge)} />
                    <label htmlFor='repeats' className='font-semibold'>Continues next month?</label>
                  </div>}

                </h2> : null}
              {bill?.repeats && bill?.consistency === false ? (
                bill.continued !== true ? (
                  <Dialog>
                    <DialogTrigger>
                      <h2 className='text-md mt-5 flex items-center gap-3'>
                        <Checkbox id="repeats" onClick={() => createNextBill(bill, bill.charge)} />
                        <label htmlFor='repeats' className='font-semibold'>Continues next month?</label>
                      </h2>
                    </DialogTrigger>
                    <DialogContent>
                      <h2 className='text-lg font-bold'>Enter next bill's charge</h2>
                      <Input
                        type='number'
                        placeholder='e.g. 200'
                        value={charge}
                        onChange={(e) => setcharge(e.target.value)}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={() => createNextBill(bill, charge)}>Create Next Bill</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className='text-md mt-5 flex items-center gap-3'>
                    <CheckIcon id="repeats" />
                    <label htmlFor='repeats' className='font-semibold'>Continues next month</label>
                  </div>
                )
              ) : null}

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
              {bill?.repeats && bill?.consistency ?
                <h2 >
                  {bill?.continued == true ? <div className='text-md mt-5 flex items-center gap-3'>
                    <CheckIcon id="repeats" />
                    <label htmlFor='repeats' className='font-semibold'>Continues next month</label>
                  </div> : <div className='text-md mt-5 flex items-center gap-3'>
                    <Checkbox id="repeats" onClick={() => createNextBill(bill, bill.charge)} />
                    <label htmlFor='repeats' className='font-semibold'>Continues next month?</label>
                  </div>}

                </h2> : null}
              {bill?.repeats && bill?.consistency === false ? (
                bill.continued !== true ? (
                  <Dialog>
                    <DialogTrigger>
                      <h2 className='text-md mt-5 flex items-center gap-3'>
                        <Checkbox id="repeats" onClick={() => createNextBill(bill, bill.charge)} />
                        <label htmlFor='repeats' className='font-semibold'>Continues next month?</label>
                      </h2>
                    </DialogTrigger>
                    <DialogContent>
                      <h2 className='text-lg font-bold'>Enter next bill's charge</h2>
                      <Input
                        type='number'
                        placeholder='e.g. 200'
                        value={charge}
                        onChange={(e) => setcharge(e.target.value)}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={() => createNextBill(bill, charge)}>Create Next Bill</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className='text-md mt-5 flex items-center gap-3'>
                    <CheckIcon id="repeats" />
                    <label htmlFor='repeats' className='font-semibold'>Continues next month</label>
                  </div>
                )
              ) : null}
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
