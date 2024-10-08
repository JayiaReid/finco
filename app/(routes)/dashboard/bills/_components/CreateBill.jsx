"use client"
import React, { useState } from 'react'
import { Button } from '../../../../../components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../../../components/ui/dialog'
import { Input } from '../../../../../components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '../../../../../components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { db } from '../../../../../utils/dbConfig'
import { Bills } from '../../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import EmojiPicker from 'emoji-picker-react'

const CreateBill = ({ refreshData }) => {
    const [name, setName] = useState('')
    const [charge, setCharge] = useState('')
    const [type, setType] = useState('Select a type')
    const [date, setDate] = useState('')
    const [icon, setIcon] = useState('$$')
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const { user } = useUser()

    const addBill = async () => {
        const repeats = type !== 'Does Not Repeat'
        const consistency = type === 'Repeats and Charge is Consistent'

        try {
            const result = await db.insert(Bills).values({
                id: Date.now(),
                name,
                charge: parseFloat(charge),
                date,
                repeats,
                consistency,
                createdBy: user.id,
                paid: false,
                icon
            })

            if (result) {
                Toast({title: 'Added Sucessfully'})
            }
        } catch (error) {
            console.log(error)
        }

        setName('')
        setCharge('')
        setDate('')
        setIcon('$$')
        setType('Select a type')

        refreshData()
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Create New Bill + </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a new bill</DialogTitle>
                        <DialogDescription>
                            <Button size='lg' variant="outline" onClick={() => setOpenEmojiPicker(!openEmojiPicker)} className='mt-4 mb-2'>{icon}</Button>
                            {openEmojiPicker ? <div className='absolute'><EmojiPicker onEmojiClick={(e) => { setIcon(e.emoji); setOpenEmojiPicker(false) }} theme='dark' style={{ background: "#020817" }} /></div> : null}
                            <div className='p-3 flex flex-col gap-2'>
                                <h2>Bill Name</h2>
                                <Input onChange={(e) => setName(e.target.value)} value={name} placeholder="eg. Hydro Bill" />
                            </div>
                            <div className='p-3 flex flex-col gap-2'>
                                <h2>Charge</h2>
                                <Input onChange={(e) => setCharge(e.target.value)} value={charge} placeholder="eg. 200" />
                            </div>
                            <div className='p-3 flex flex-col gap-2'>
                                <h2>Date</h2>
                                <Input onChange={(e) => setDate(e.target.value)} value={date} placeholder="eg. 20/01/2024 (dd/mm/yyyy)" />
                            </div>
                            <div className='p-3 flex items-start flex-col gap-2'>
                                <h2>Type</h2>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className='w-full' variant='outline'>{type}<ChevronDown /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuRadioGroup value={type} onValueChange={setType}>
                                            <DropdownMenuRadioItem value='Repeats and Charge is Consistent'>Repeats and Charge is Consistent</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value='Repeats but charge varies'>Repeats but charge varies</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value='Does Not Repeat'>Does Not Repeat</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </DialogDescription>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button disabled={!(name && charge && date)} onClick={() => addBill()}>Save</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateBill
