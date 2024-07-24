'use client';

import { UserButton } from '@clerk/nextjs';
import { LayoutDashboardIcon, MessageCircleCodeIcon, PersonStanding, PiggyBankIcon, ReceiptText, SidebarCloseIcon } from 'lucide-react';
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
            id: 3,
            title: 'Expenses',
            icon: ReceiptText,
            path: '/dashboard/expenses',
        },
        {
            id: 4,
            title: 'Messages',
            icon: MessageCircleCodeIcon,
            path: '/dashboard/messages',
        },
        {
            id: 5,
            title: 'Home',
            icon: PersonStanding,
            path: '/',
        },
        
    ]

    return (
        <div onMouseLeave={()=>showNav(false)} className='h-screen text-primary-foreground p-5'>
            <SidebarCloseIcon className='ml-40 cursor-pointer my-4' onClick={() => showNav(false)} />
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
