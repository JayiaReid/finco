'use client';

import { UserButton } from '@clerk/nextjs';
import { Landmark, LayoutDashboardIcon, MessageCircleCodeIcon, PersonStanding, PiggyBankIcon, Receipt, ReceiptText, SidebarCloseIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

// on click of exit only icons aka new hover feature

const SideNav = ({  showNav }) => {
    const param = usePathname();
    const router = useRouter();
    const menu = [
        {
            id: 1,
            title: 'Dashboard',
            icon: LayoutDashboardIcon,
            path: '/dashboard',
        },
        {
            id: 2,
            title: 'Budgets',
            icon: PiggyBankIcon,
            path: '/dashboard/budgets',
        },
        
        {
            id: 7,
            title: 'Bills',
            icon: Receipt,
            path: '/dashboard/bills',
        },
        {
            id: 4,
            title: 'Savings',
            icon: PiggyBankIcon,
            path: '/dashboard/savings',
        },
        {
            id: 3,
            title: 'Plans',
            icon: ReceiptText,
            path: '/dashboard/plans',
        },
        {
            id: 5,
            title: 'Home',
            icon: PersonStanding,
            path: '/',
        },
        
    ]

    return (
        <div className='h-screen text-primary-foreground p-5'>
            <div className='w-full flex-row-reverse flex justify-between items-center'>
                <SidebarCloseIcon className='cursor-pointer my-4' onClick={() => showNav(false)} />
                <Image src='/budget.png' alt='Budget' width={50} height={50} />
            </div>
            
            <div>
                {menu.map((item) => (
                    <h2
                        key={item.id}
                        className={`flex p-5 cursor-pointer mt-5 hover:bg-accent hover:text-accent-foreground rounded-md gap-2 items-center text-primary-foreground ${
                            param === item.path && 'text-secondary-foreground bg-accent'
                        }`}
                        onClick={() => {router.push(item.path); showNav(false)}}
                    >
                        <item.icon />
                        {item.title}
                    </h2>
                ))}
            </div>
            
            <div className='fixed bottom-10 gap-2 flex font-bold p-5 text-primary-foreground items-center'>
                <UserButton />
                Profile
            </div>
        </div>
    );
};

export default SideNav;
