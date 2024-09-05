"use client"
import { CheckIcon, DollarSign, EyeOff, Info, Loader, LogOut, Pencil, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CreateBill from './_components/CreateBill'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import { db } from '../../../../utils/dbConfig'
import { Bills } from '../../../../utils/schema'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import BillCards from './_components/Cards'
import PaidBillsComponent from './_components/PaidBills'
import PendingBillsComponent from './_components/PendingBills'

// set up the calculations as well
// set up user money stats using dashboard icon to finish setting up
// where income per month is defined

const BillsPage = () => {
  const thisyear = Number(new Date().getFullYear())
  const thismonth = Number(new Date().getMonth())
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
    if (!user) return;
  
    try {
      const result = await db.select({
        ...getTableColumns(Bills),
        totalCharge: sql`sum(CAST(${Bills.charge} AS NUMERIC))`.mapWith(Number),
        totalItems: sql`count(${Bills.id})`.mapWith(Number),
      })
      .from(Bills)
      .where(eq(Bills.createdBy, user.id))
      .groupBy(Bills.id);
  
      if (result) {
        const monthFilter = result.filter(element => extractMonth(element.date) === month + 1);
        const filteredBills = monthFilter.filter(element => extractYear(element.date) === year);
        const paid = filteredBills.filter(bill => bill.paid);
        const pending = filteredBills.filter(bill => !bill.paid);
  
        setPaidBills(paid);
        setPending(pending);
  
        let totalPaid = 0;
        paid.forEach(bill => {
          totalPaid += Number(bill.charge);
        });
        setTotalPaid(totalPaid);
  
        let totalLeftToPay = 0;
        pending.forEach(bill => {
          totalLeftToPay += Number(bill.charge);
        });
        setLeftToPay(totalLeftToPay);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const setPaid = async (id, status) => {

    const result = await db.update(Bills).set({
      paid: status
    }).where(eq(Bills.id, id))

    getBillsList()
  }

  const deleteBill = async (id) =>{
    try {
      const result = await db.delete(Bills).where(eq(Bills.id, id))
      console.log(result)

      getBillsList()
    } catch (error) {
      console.log(error)
    }
  }

  return user ? (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold p-5 text-3xl'>Tracking Bills</h2>
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
        // billBudget={billBudget}
        // setBillBudget={setBillBudget}
        totalPaid={totalPaid}
        leftToPay={leftToPay}
        month={month}
        setMonth={setMonth}
        userid={user.id}
        year={year}
        setyear={setyear}
      />

      <PendingBillsComponent pending={pending} setPaid={setPaid} createNextBill={createNextBill} setcharge={setcharge}  deleteBill={deleteBill} charge={charge} />
      <PaidBillsComponent paidBills={paidBills} setPaid={setPaid} createNextBill={createNextBill} setcharge={setcharge} deleteBill={deleteBill} charge={charge} />

    </div>
  ) : (
    <div className='flex items-center justify-center'><Loader className='animate-spin' /></div>
  );
}

export default BillsPage
