"use client"
import { PlusIcon } from 'lucide-react'
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


const CreateBudget = ({refreshData}) => {
    const [emoji, setEmoji] = useState('$$')
    const [openEmojiPicker, setopenEmojiPicker] = useState(false)
    const [budgetName, setBudgetName] = useState()
    const [amount, setAmount] = useState()
    const { user } = useUser()

    const CreateBudget = async () => {
        const result = await db.insert(Budgets).values({
            id: Date.now(),
            name: budgetName,
            amount: amount,
            icon: emoji,
            createdBy: user.id
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

    return (
        <div>

            <Dialog>
                <DialogTrigger><div className='p-10 bg-accent items-center flex flex-col cursor-pointer outline rounded-xl outline-2'>
                    <PlusIcon className='text-3xl' />
                    <h2>
                        Create New Budget
                    </h2>
                </div></DialogTrigger>
                <DialogContent className='m-2'>
                    <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
                        <DialogDescription>
                            <Button size='lg' variant="outline" onClick={() => setopenEmojiPicker(!openEmojiPicker)} className='my-5'>{emoji}</Button>
                            {openEmojiPicker ? <div className='absolute'><EmojiPicker onEmojiClick={(e) => { setEmoji(e.emoji); setopenEmojiPicker(false) }} theme='dark' style={{ background: "#020817" }} /></div> : <div></div>}
                            <div className='p-3 flex flex-col gap-2'>
                                <h2>Budget Name</h2>
                                <Input onChange={(e) => setBudgetName(e.target.value)} placeholder="eg. Dorm Room" />
                            </div>
                            <div className='p-3 flex flex-col gap-2'>
                                <h2>Budget Amount</h2>
                                <Input type='number' onChange={(e) => setAmount(e.target.value)} placeholder="eg. 5000" />
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                        <Button onClick={CreateBudget} disabled={!(budgetName && amount)} className='my-5'>Create Budget</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>

    )
}

export default CreateBudget