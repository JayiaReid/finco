"use client"
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
import { Plans } from '../../../../../utils/schema'
import { db } from '../../../../../utils/dbConfig'
import { toast } from '../../../../../components/ui/use-toast'
import { Textarea } from '../../../../../components/ui/textarea'
import { eq } from 'drizzle-orm'

const CreatePlan = ({ refreshData, edit, existingData }) => {
    const [name, setName] = useState('')
    const [notes, setNotes] = useState('')
    const [openEmojiPicker, setopenEmojiPicker] = useState(false)
    const [emoji, setEmoji] = useState('$$')

    const { user } = useUser()

    const editPlan = () => {
        setName(existingData?.name)
        setEmoji(existingData?.icon)
        setNotes(existingData?.notes)
    }

    const CreatePlan = async () => {
        if (existingData) {
            const result = await db.update(Plans).set({
                name,
                icon: emoji,
                notes
            }).where(eq(Plans.id, existingData?.id))
            
            if(result){
                console.log("edited")
            }
            refreshData()
        } else {
            const result = await db.insert(Plans).values({
                id: Date.now(),
                name: name,
                icon: emoji,
                notes: notes,
                createdBy: user.id
            })
            console.log(result)

            if (result) {
                refreshData()
                toast({
                    title: "New Plan Created!"
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
                <DialogTrigger>
                    {edit ? <Button onClick={() => editPlan()}>Edit</Button> : <Button>Add New Plan +</Button>}
                </DialogTrigger>
                <DialogContent className='m-2'>
                    <DialogHeader>
                        <DialogTitle>Create New Plan</DialogTitle>
                        <DialogDescription>
                            {/* <h2 className='font-bold'>Make Checklists/Buy Lists or outline upcoming expenses</h2> */}
                            <Button size='lg' variant="outline" onClick={() => setopenEmojiPicker(!openEmojiPicker)} className='mt-4 mb-2'>{emoji}</Button>
                            {openEmojiPicker ? <div className='absolute'><EmojiPicker onEmojiClick={(e) => { setEmoji(e.emoji); setopenEmojiPicker(false) }} theme='dark' style={{ background: "#020817" }} /></div> : <div></div>}
                            <div className='p-3 flex flex-col gap-2'>
                                <h2>Plan Name</h2>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="eg. Dorm Checklist" />
                            </div>
                            <div className='p-3 flex flex-col gap-2'>
                                <h2>Notes</h2>
                                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="eg. This is a checklist to outline what I want for dorm (optional)" />
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button onClick={() => CreatePlan()} disabled={!(name)} className='my-5'>Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreatePlan