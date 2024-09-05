'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { db } from '../../../utils/dbConfig';
import { Budgets } from '../../../utils/schema';
import { eq } from 'drizzle-orm';
import SideNav from './_components/SideNav';
import SideNavDef from './_components/SideNavDef';
import { Loader2Icon } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [nav, showNav] = useState(false);
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const checkBudgets = useCallback(async () => {
    if (user) {
      const result = await db.select().from(Budgets).where(eq(Budgets.createdBy, user.id));
      if (result?.length === 0) {
        router.push('/dashboard/budgets');
      }
    }
  }, [user, router]);

  const checkUser = useCallback(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    checkBudgets();
  }, [checkBudgets]);

  useEffect(() => {
    if (!isSignedIn && user) {
      router.push('/');
    }
  }, [isSignedIn, user, router]);

  if (!user) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader2Icon className='animate-spin' />
      </div>
    );
  }
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


  // return (
  //   <div>
  //     <div className={`fixed bg-primary z-10 w-${nav ? '64' : '30'} block`}>
  //       {nav ? <SideNav showNav={showNav} /> : <SideNavDef showNav={showNav} />}
  //     </div>
  //     <div className={`ml-${nav ? '64' : '[100px]'} bg-background`}>
  //       {children}
  //     </div>
  //   </div>
  // );
};

export default DashboardLayout;
