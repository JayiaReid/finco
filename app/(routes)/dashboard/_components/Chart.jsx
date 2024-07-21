import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const Chart = ({ list }) => {
    // menu for bar chart and linechart
    return (
        <div className='border rounded-lg p-5'>
            <h2 className='font-bold text-xl'>Activity</h2>
            <ResponsiveContainer width={'80%'} height={300}>
                <LineChart data={list}>
                    <CartesianGrid />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey='totalSpend' stroke='#85C898' />
                    <Line type="monotone" dataKey='amount' stroke='#0F172A' />
                </LineChart>
            </ResponsiveContainer>

        </div>
    )
}

export default Chart