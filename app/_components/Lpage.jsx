import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../../components/ui/button'

const Lpage = () => {
    return (
        <div>
            <div className='h-[500px] flex flex-col gap-5 items-center justify-center z-20'>
                <h1 className='text-[90px] text-primary-foreground font-bold duration-500'>FinCo.: Expenses</h1>
                <Link href={'/dashboard'}>
                    <Button className='bg-transparent outline font-bold hover:shadow-lg hover:bg-white hover:text-primary hover:outline-none'>Manage Expenses and Budgets</Button>
                </Link>
            </div>
        </div>
        

    )
}

export default Lpage