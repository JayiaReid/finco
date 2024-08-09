import React, { useEffect, useState } from 'react'
import { Input } from '../../../../../components/ui/input'
import { Button } from '../../../../../components/ui/button'
import { CalendarArrowDownIcon, DollarSign, LogOut, Pencil, PiggyBank } from 'lucide-react'
import { db } from '../../../../../utils/dbConfig'
import { Bills } from '../../../../../utils/schema'
import { eq } from 'drizzle-orm'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '../../../../../components/ui/dropdown-menu'

const BillCards = ({ billBudget, setBillBudget, totalPaid, leftToPay, month, setMonth, userid }) => {
    const [editBill, setEditBill] = useState(false)
    const [monthsArray, setMonths] = useState([])
    const [defaultMonth, setDefaultMonth] = useState("")

    useEffect(() => {
        if (userid) {
            getMonths()
        }
        setDefaultMonth(monthConversion(new Date().getMonth()))
    }, [userid])

    const monthConversion = (index) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[index];
    }

    const getMonths = async () => {
        const months = [
            { index: 0, name: "January" },
            { index: 1, name: "February" },
            { index: 2, name: "March" },
            { index: 3, name: "April" },
            { index: 4, name: "May" },
            { index: 5, name: "June" },
            { index: 6, name: "July" },
            { index: 7, name: "August" },
            { index: 8, name: "September" },
            { index: 9, name: "October" },
            { index: 10, name: "November" },
            { index: 11, name: "December" }
          ];

          setMonths(months)
    }
    

    return (
        <div className='mt-4 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            <div className=''>
                <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg'>Bill Budget</h2>
                        {editBill ? <Input value={billBudget} className='p-1' type='number' onChange={(e) => setBillBudget(e.target.value)} /> : <h2 className='text-xl flex items-center gap-3 font-bold'>${billBudget} <Pencil size={18} className='cursor-pointer' onClick={() => setEditBill(true)} /></h2>}
                    </div>
                    {editBill ? <div className='flex gap-2 items-center'><Button variant='muted' onClick={() => { setEditBill(false); }}>Cancel</Button> <Button onClick={() => editBillBudget()}>Save</Button></div> : <div className='bg-primary text-white rounded-full p-3'>
                        <PiggyBank />
                    </div>}
                </div>
            </div>
            <div className=''>
                <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg'>Total Paid</h2>
                        <h2 className='text-xl font-bold'>${totalPaid}</h2>
                    </div>
                    <div className='bg-primary text-white rounded-full p-3'>
                        <DollarSign />
                    </div>

                </div>
            </div>
            <div className=''>
                <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg'>Total Left To Pay</h2>
                        <h2 className='text-xl font-bold'>${leftToPay}</h2>
                    </div>
                    <div className='bg-primary text-white rounded-full p-3'>
                        <LogOut />
                    </div>

                </div>
            </div>
            <div className='border flex justify-between items-center shadow-md rounded-lg p-4'>
                <div>
                    <h2 className='text-lg'>Select a Month</h2>
                    <h2 className='text-xl font-bold'>{month ? monthConversion(month) : defaultMonth}</h2>
                </div>
                
                {/* dropdown menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <CalendarArrowDownIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={month} onValueChange={(value) => setMonth(value)}>
                            {monthsArray.map((item) => (
                                <DropdownMenuRadioItem key={item.index} value={item.index}>
                                    {item.name}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default BillCards
