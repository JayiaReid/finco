'use client';
import { UserButton } from '@clerk/nextjs';
import { Landmark, LayoutDashboardIcon, MessageCircleCodeIcon, PersonStanding, PiggyBankIcon, Receipt, ReceiptText, SidebarCloseIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const SideNavDef = ({showNav}) => {
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
            id: 6,
            title: 'Debts',
            icon: Landmark,
            path: '/dashboard/Debts',
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
    ];

    return (
        <div onMouseOver={()=>showNav(true)} className=' h-screen w-auto text-primary-foreground p-5'>
            {/* <SidebarCloseIcon className='ml-40 cursor-pointer my-4' onClick={() => showNav(false)} /> */}
            <Image src='/budget.png' alt='Budget' width={50} height={50} />
            <div>
                {menu.map((item) => (
                    <h2
                        key={item.id}
                        className={`flex p-5 cursor-pointer mt-5 hover:bg-accent hover:text-accent-foreground rounded-md gap-2 items-center text-primary-foreground ${
                            param === item.path && 'text-secondary-foreground bg-accent'
                        }`}
                        onClick={() => router.push(item.path)}
                    >
                        <item.icon />
                    </h2>
                ))}
            </div>
            <div className='fixed bottom-10 gap-2 flex font-bold p-5 text-primary-foreground items-center'>
                <UserButton />
            </div>
        </div>
    );
}

export default SideNavDef