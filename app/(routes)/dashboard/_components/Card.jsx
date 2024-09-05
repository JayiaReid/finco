import { useUser } from '@clerk/nextjs'
import { Banknote, CircleDollarSign, CircleFadingPlus, PiggyBank } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Card = ({list}) => {

    // month and year for ..

    const [totalMoneyHave, setTotalMoney] = useState(null)
    const [totalSpendings, setTotalSpendings] = useState(null)
    const [totalBudgets, setTotalBudgets] = useState(null)

    
    const {user}=useUser()

    const calculateTotalSpendage = async () =>{
        let totalMoney = 0
        let totalSpend =0
        let NoBudgets = 0

        list?.forEach(item =>{
            totalMoney=totalMoney+Number(item.amount)
            totalSpend=totalSpend+Number(item.totalSpend)
            NoBudgets=NoBudgets+1;
        })

        setTotalMoney(totalMoney)
        setTotalSpendings(totalSpend)
        setTotalBudgets(NoBudgets)

       
        
    }

    

    useEffect(() => {
        const fetchData = async () => {
          await calculateTotalSpendage();
        };
      
        fetchData();
      }, [list, totalMoneyHave]);
      

  return (
    <div className='p-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 '>
        <div className='p-7 shadow-md border rounded-lg flex items-center justify-between '>
            <div>
                <h2 className=''>Total Budget</h2>
            <h2 className='font-bold text-xl'>${Number(totalMoneyHave).toFixed(2)}</h2>
            </div>
            <PiggyBank className='bg-primary rounded-full text-primary-foreground h-10 w-10 p-2'/>
        </div>
        <div className='p-7 shadow-md border rounded-lg flex items-center justify-between '>
            <div>
                <h2 className=''>Total Spend</h2>
            <h2 className='font-bold text-xl'>${Number(totalSpendings).toFixed(2)}</h2>
            </div>
            <Banknote className='bg-primary rounded-full text-primary-foreground h-10 w-10 p-2'/>
        </div>
        <div className='p-7 shadow-md border rounded-lg flex items-center justify-between '>
            <div>
                <h2 className=''>Total Remaining</h2>
            <h2 className='font-bold text-xl'>${Number(totalMoneyHave - totalSpendings).toFixed(2)}</h2>
            </div>
            <CircleDollarSign className='bg-primary rounded-full text-primary-foreground h-10 w-10 p-2'/>
        </div>
        <div className='p-7 shadow-md border rounded-lg flex items-center justify-between '>
            <div>
                <h2 className=''>No. of Budgets</h2>
            <h2 className='font-bold text-xl'>{totalBudgets}</h2>
            </div>
            <CircleFadingPlus className='bg-primary rounded-full text-primary-foreground h-10 w-10 p-2'/>
        </div>
        
    </div>
  )
}

export default Card