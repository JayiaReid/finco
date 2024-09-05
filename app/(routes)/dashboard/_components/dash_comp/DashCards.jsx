"use client"
import React, { useEffect, useState } from 'react'
import { ArrowBigRightDash, CalendarDays, CalendarFold, DollarSign, HandCoins, Pencil, PiggyBank } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '../../../../../components/ui/dropdown-menu';
import { db } from '../../../../../utils/dbConfig';
import { Income } from '../../../../../utils/schema';
import { eq, getTableColumns } from 'drizzle-orm';

const DashCards = ({totalOut, income, month, year, userid, thisyear, thismonth, setyear, setMonth, saved }) => {

    const [monthsArray, setMonths] = useState([]);
    const [defaultMonth, setDefaultMonth] = useState("");
    const [yearsArray, setYears] = useState([...Array(11)].map((_, i) => thisyear - 5 + i));

    useEffect(() => {
        if (userid) {
            getMonths();
        }
        setDefaultMonth(monthConversion(thismonth));
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
        <div className='mt-4 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            <div className=''>
                <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg'>Income</h2>
                        <h2 className='text-xl flex items-center gap-3 font-bold'>${Number(income).toFixed(2)}
                        </h2>
                    </div>
                    <div className='bg-primary text-white rounded-full p-3'>
                        <HandCoins />
                    </div>
                </div>
            </div>
            <div className=''>
                <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg'>Total Out</h2>
                        <h2 className='text-xl flex items-center gap-3 font-bold'>${Number(totalOut).toFixed(2)}
                        </h2>
                    </div>
                    <div className='bg-primary text-white rounded-full p-3'>
                        <ArrowBigRightDash />
                    </div>
                </div>
            </div>
            <div className=''>
                <div className='flex p-4 items-center justify-between border shadow-md rounded-lg'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg'>Total Saved</h2>
                        <h2 className='text-xl flex items-center gap-3 font-bold'>${Number(saved).toFixed(2)}
                        </h2>
                    </div>
                    <div className='bg-primary text-white rounded-full p-3'>
                        <PiggyBank />
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
    )
}

export default DashCards