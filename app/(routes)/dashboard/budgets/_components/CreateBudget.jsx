"use client"
import { Pencil, PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../../../components/ui/dialog"
import { Button } from '../../../../../components/ui/button'
import { Input } from '../../../../../components/ui/input'
import EmojiPicker from 'emoji-picker-react'
import { useUser } from '@clerk/nextjs'
import { Budgets } from '../../../../../utils/schema'
import { db } from '../../../../../utils/dbConfig'
import { toast } from '../../../../../components/ui/use-toast'
import { title } from 'process'
import { eq } from 'drizzle-orm'


const CreateBudget = ({ edit, exisitingData, refreshData }) => {
    const [emoji, setEmoji] = useState('$$')
    const [openEmojiPicker, setopenEmojiPicker] = useState(false)
    const [budgetName, setBudgetName] = useState()
    const [amount, setAmount] = useState()
    const { user } = useUser()

    const editBudget = () => {
        setBudgetName(exisitingData?.name)
        setAmount(exisitingData?.amount)
        setEmoji(exisitingData?.icon)
    }

    const CreateBudget = async () => {

        if (exisitingData) {

            // const res = await db.delete(Budgets).where(eq(Budgets.id, exisitingData?.id));

            const result = await db.update(Budgets).set({
                name: budgetName,
                amount, 
                icon: emoji
            }).where(eq(Budgets.id, exisitingData?.id))

            if(result){
                console.log('edited')
                refreshData()
            }

            

        } else {
            const result = await db.insert(Budgets).values({
                id: Date.now(),
                name: budgetName,
                amount: amount,
                icon: emoji,
                createdBy: user.id,
                retired:false
            })
            console.log(result)
            if (result) {
                refreshData()
                toast({
                    title: "New Budget Created!"
                })
            } else {
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                })
            }
        }

    }

    return (
        <div>

            <Dialog>
                <DialogTrigger><div className=''>
                    {edit ? <Button onClick={() => editBudget()}>Edit</Button> : <Button>Add New Budget +</Button>}
                </div></DialogTrigger>
                <DialogContent className='m-2'>
                    <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
                        <DialogDescription>
                            <Button size='lg' variant="outline" onClick={() => setopenEmojiPicker(!openEmojiPicker)} className='my-5'>{emoji}</Button>
                            {openEmojiPicker ? <div className='absolute'><EmojiPicker onEmojiClick={(e) => { setEmoji(e.emoji); setopenEmojiPicker(false) }} /></div> : <div></div>}
                            <div className='p-3 flex flex-col gap-2'>
                                <h2>Budget Name</h2>
                                <Input value={budgetName} onChange={(e) => setBudgetName(e.target.value)} placeholder="eg. Dorm Room" />
                            </div>
                            <div className='p-3 flex flex-col gap-2'>
                                <h2>Budget Amount</h2>
                                <Input value={amount} type='number' onChange={(e) => setAmount(e.target.value)} placeholder="eg. 5000" />
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button onClick={CreateBudget} disabled={!(budgetName && amount)} className='my-5'>Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>

    )
}

export default CreateBudget