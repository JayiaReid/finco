"use client"
import React, { useState } from 'react'
import { db } from '../../../../../utils/dbConfig'
import { Savings } from '../../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import EmojiPicker from 'emoji-picker-react'
import { Button } from '../../../../../components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../../../components/ui/dialog'
import { Input } from '../../../../../components/ui/input'
import { Toast } from '../../../../../components/ui/toast'
import { eq } from 'drizzle-orm'

const CreateSavings = ({ refreshData, edit, existingData }) => {
    const [name, setName] = useState('')
    const [goal, setGoal] = useState(0)
    const { user } = useUser()
    const [icon, setIcon] = useState('$$')
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)

    const editSavings = async () =>{
        setGoal(existingData?.goal)
        setName(existingData?.name)
        setIcon(existingData?.icon)
    }

    const addSavings = async () => {
        try {

            let left=goal-Number(existingData?.saved)

            if(existingData){
                const res = await db.update(Savings).set({
                    left,
                    icon,
                    goal,
                    name
                }).where(eq(Savings.id, existingData?.id))

                if(res){
                    console.log("edited")
                }
                refreshData()
            }else{
                const result = await db.insert(Savings).values({
                id: Date.now(),
                icon,
                name,
                goal,
                saved: 0,
                left: goal,
                reached: false,
                createdBy: user.id
            })
           
                Toast({title: 'Added Sucessfully'})
                setName('')
                setGoal('')
                refreshData()
            }
            
            
        } catch (error) {
            console.log(error)
        }

        

    }
    return (
        <div><Dialog>
            <DialogTrigger asChild>
            {edit ? <Button onClick={() => editSavings()}>Edit</Button>: <Button>Create New Savings Tracker + </Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new tracker</DialogTitle>
                    <DialogDescription>
                        <Button size='lg' variant="outline" onClick={() => setOpenEmojiPicker(!openEmojiPicker)} className='mt-4 mb-2'>{icon}</Button>
                        {openEmojiPicker ? <div className='absolute'><EmojiPicker onEmojiClick={(e) => { setIcon(e.emoji); setOpenEmojiPicker(false) }} theme='dark' style={{ background: "#020817" }} /></div> : null}
                        <div className='p-3 flex flex-col gap-2'>
                            <h2>Name</h2>
                            <Input onChange={(e) => setName(e.target.value)} value={name} placeholder="eg. Emergency Fund" />
                        </div>
                        <div className='p-3 flex flex-col gap-2'>
                            <h2>Goal</h2>
                            <Input onChange={(e) => setGoal(e.target.value)} value={goal} placeholder="eg. 3000" />
                        </div>
                       
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={!(name && goal)} onClick={() => addSavings()}>Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog></div>
    )
}

export default CreateSavings