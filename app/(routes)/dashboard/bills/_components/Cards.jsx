import React, { useEffect, useState } from 'react';
import { Input } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';
import { CalendarDays, CalendarFold, DollarSign, Pencil, PiggyBank, ReceiptIcon } from 'lucide-react';
import { db } from '../../../../../utils/dbConfig';
import { Budgets, UserStats } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '../../../../../components/ui/dropdown-menu';

const BillCards = ({ past, thisyear, totalPaid, leftToPay, month, setMonth, userid, year, setyear }) => {
    const [editBill, setEditBill] = useState(false);
    const [monthsArray, setMonths] = useState([]);
    const [defaultMonth, setDefaultMonth] = useState("");
    const [yearsArray, setYears] = useState([...Array(11)].map((_, i) => thisyear - 5 + i));
    const percent = Math.round((Number(leftToPay) / (Number(totalPaid) + Number(leftToPay))) * 100);
    const maxpercent = Math.min(percent, 100);
    const progressBarColor = percent > 100 ? 'bg-destructive' : 'bg-primary'

    useEffect(() => {
        if (userid) {
            getMonths();
        }
        setDefaultMonth(monthConversion(new Date().getMonth()));
    }, [userid]);


    const monthConversion = (index) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[index];
    };

    const getMonths = () => {
        setMonths([...Array(12)].map((_, i) => ({ index: i, name: monthConversion(i) })));
    };
    return (
        <div className='mt-4 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            <div className=''>
                <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg'>Billed Total</h2>
                        <h2 className='text-xl flex items-center gap-3 font-bold'>${(Number(totalPaid) + Number(leftToPay)).toFixed(2)}
                        </h2>
    
                    </div>
                    <div className='bg-primary text-white rounded-full p-3'>
                        <ReceiptIcon />
                    </div>
                </div>
            </div>
            <div className=''>
                <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                    <div className='flex flex-col gap-1 w-full'>
                        <h2 className='text-lg'>To be Paid</h2>
                        <div className='flex items-center gap-2 w-[90%]'>
                            <h2 className='text-xl font-bold'>${Number(leftToPay).toFixed(2)}</h2> 
                            <div className="w-full rounded-full bg-accent h-2">
                                <div
                                    className={`rounded-full h-2 ${progressBarColor}`}
                                    style={{ width: `${maxpercent}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-primary text-white rounded-full p-3'>
                        <DollarSign />
                    </div>
                </div>
            </div>
            <div className='border flex justify-between items-center shadow-md rounded-lg p-4'>
                <div>
                    <h2 className='text-lg'>Select a Month</h2>
                    <h2 className='text-xl font-bold'>{month ? monthConversion(month) : defaultMonth}</h2>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <CalendarDays />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={month} onValueChange={(value) => setMonth(value)}>
                            {monthsArray.map((month) => (
                                <DropdownMenuRadioItem key={month.index} value={month.index}>
                                    {month.name}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className='border flex justify-between items-center shadow-md rounded-lg p-4'>
                <div>
                    <h2 className='text-lg'>Select a Year</h2>
                    <h2 className='text-xl font-bold'>{year}</h2>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <CalendarFold />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={year} onValueChange={(value) => setyear(value)}>
                            {yearsArray.map((year, index) => (
                                <DropdownMenuRadioItem key={index} value={year}>
                                    {year}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default BillCards;
