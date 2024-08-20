import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const PieChartComponent = ({ item }) => {

  const data = [
    { name: "Group A", value: Number(item?.saved) },
    { name: "Group B", value: Number(item?.left) },
  ];

  const COLORS = ["#0F172A", "#F1F5F8"];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        
      </PieChart>
    </ResponsiveContainer>
  )
}

export default PieChartComponent;
