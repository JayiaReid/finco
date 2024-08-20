import { useUser } from '@clerk/nextjs'
import { Banknote, CircleDollarSign, PiggyBank } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../utils/dbConfig'
import { UserStats } from '../../../../utils/schema'
import { eq } from 'drizzle-orm'

const Card = ({list}) => {

    // month and year for ..

    const [totalMoneyHave, setTotalMoney] = useState(null)
    const [totalSpendings, setTotalSpendings] = useState(null)
    const [totalBudgets, setTotalBudgets] = useState(null)

    // for edtiitng
    // const [total, setTotal] = useState(0)
    // const [budgeted1, setbudgeted] = useState(0)
    
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

    const getStats = async () =>{
        try {
            const res = await db.select({
            total: UserStats.total,
            budgeted: UserStats.budgeted
            }).from(UserStats).where(eq(user.id, UserStats.userid))
            .where(eq(new Date().getFullYear(), UserStats.year))
            .where(eq(Number(new Date().getMonth()+1), UserStats.month))

            const total = Number(res[0].total) - Number(res[0].budgeted)
            console.log(total)
            return total
        } catch (error) {
            console.log(error)
            return 0
        }
        
    }

    const updateStats = async () =>{
        try {
        const total = await getStats()
        const result = await db.update(UserStats).set({
            budgeted:totalMoneyHave,
            total: total + totalMoneyHave
        }).where(eq(user.id, UserStats.userid))
        .where(eq(new Date().getFullYear(), UserStats.year))
        .where(eq(Number(new Date().getMonth()+1), UserStats.month))
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        const fetchData = async () => {
          await calculateTotalSpendage();
          await updateStats();
        };
      
        fetchData();
      }, [list, totalMoneyHave]);
      

  return (
    <div className='p-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 '>
        <div className='p-7 shadow-md border rounded-lg flex items-center justify-between '>
            <div>
                <h2 className=''>Total Budget</h2>
            <h2 className='font-bold text-xl'>${totalMoneyHave}</h2>
            </div>
            <PiggyBank className='bg-primary rounded-full text-primary-foreground h-10 w-10 p-2'/>
        </div>
        <div className='p-7 shadow-md border rounded-lg flex items-center justify-between '>
            <div>
                <h2 className=''>Total Spend</h2>
            <h2 className='font-bold text-xl'>${totalSpendings}</h2>
            </div>
            <Banknote className='bg-primary rounded-full text-primary-foreground h-10 w-10 p-2'/>
        </div>
        <div className='p-7 shadow-md border rounded-lg flex items-center justify-between '>
            <div>
                <h2 className=''>Total Remaining</h2>
            <h2 className='font-bold text-xl'>${totalMoneyHave - totalSpendings}</h2>
            </div>
            <CircleDollarSign className='bg-primary rounded-full text-primary-foreground h-10 w-10 p-2'/>
        </div>
        {/* <div className='p-7 border rounded-lg flex items-center justify-between '>
            <div>
                <h2 className=''>No. of Budget</h2>
            <h2 className='font-bold text-xl'>{totalBudgets}</h2>
            </div>
            <CircleDollarSign className='bg-primary rounded-full text-primary-foreground h-10 w-10 p-2'/>
        </div> */}
        
    </div>
  )
}

export default Card