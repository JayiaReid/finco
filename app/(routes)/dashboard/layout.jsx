'use client';

import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
import SideNav from './_components/SideNav';
import Dash_Header from './_components/Dash_Header';
import { db } from '../../../utils/dbConfig';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { Budgets } from '../../../utils/schema';
import { useRouter } from 'next/navigation';
import SideNavDef from './_components/SideNavDef'
const DashboardLayout = ({ children }) => {
    const [nav, showNav] = useState(false);

    const { user } = useUser();
    const router = useRouter()

    const checkBudgets = async () => {
        const result = await db.select().from(Budgets).where(eq(Budgets.createdBy, user.id))
        console.log(result)
        if(result?.length==0){
            router.push('/dashboard/budgets')
        }
    }

    useEffect(() => {
        user&&checkBudgets()
    }, [user])

    return (
        <div>
            {nav ? (
                <div>
                    <div className='fixed bg-primary z-10 w-64 block'>
                        <SideNav showNav={showNav} />
                    </div>
                    {/* <Dash_Header showNav={showNav} /> */}
                    <div className='ml-64 bg-background'>
                        {children}
                    </div>
                </div>
            ) : (
                <div className='bg-background'>
                    <div className='fixed bg-primary z-10 w-30 block'>
                        <SideNavDef showNav={showNav} />
                    </div>
                        <div className='ml-[100px]'>
                           {/* <Dash_Header showNav={showNav} />  */}
                        </div>
                        <div className='ml-[100px] bg-background'>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
