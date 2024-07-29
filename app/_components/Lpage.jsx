import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../../components/ui/button'

const Lpage = () => {
    return (
        <section className="bg-gray-900 text-white flex Items-center flex-col">
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
                <div className="mx-auto max-w-3xl text-center">
                    <h1
                        className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
                    >
                        Manage Your Expenses
                        <span className="sm:block"> Control Your Money </span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
                        Create Budgets, Track Expenses and Save!
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link href={'/banking'}>
                            <Button variant='outline' className='outline bg-transparent outline-1'>Banking</Button>
                        </Link>

                        <Link href={'/dashboard'}>
                            <Button variant='outline' className='outline bg-transparent outline-1'>Manage Expenses and Budgets</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Image src={'/Finances.jpg'} width={2000} height={700} />
        </section>

    )
}

export default Lpage