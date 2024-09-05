import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PieChartDash = ({income, expenses, saved}) => {

    const data = [
        { name: `Expenses $${Number(expenses).toFixed(2)}`, value: Number(expenses) },
        { name: `Saved $${Number(saved).toFixed(2)}`, value: Number(saved) },
        { name: `Untouched $${Number(income - (saved + expenses)).toFixed(2)}`, value: Number(income - (saved + expenses))> 0 ? Number(income - (saved + expenses)) : 0  },
      ];
      const COLORS = ["#EB8A1A",'#6BBD7C', '#FED9A8'];
  return (
    <div className='mt-5 border rounded-lg'>
    <h2 className='font-bold m-3 text-xl'>Money Statistics</h2>
   <div className='flex items-center justify-center p-0'>
    <ResponsiveContainer width={"90%"} height={350} >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={100}
          paddingAngle={0}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend iconSize={10} width={200} height={100} layout='horizontal' verticalAlign='center' align="top" />
        <Tooltip />
      </PieChart>
      
      
    </ResponsiveContainer>
    </div>
    </div>
  )
}

export default PieChartDash