"use client";
import React, { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Radar
} from "recharts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Button } from "../../../../components/ui/button";
import { ChevronDown } from "lucide-react";

const Chart = ({ list }) => {
    const [type, setType] = useState("Line");

    return (
        <div className="border rounded-lg p-5">
            <div className="mb-2 flex gap-3 items-center justify-between">
                <h2 className="font-bold text-xl">Activity</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="shadow-none rounded-sm">
                            {type} Chart <ChevronDown />{" "}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Chart Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={type} onValueChange={setType}>
                            <DropdownMenuRadioItem value="Line">Line</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Bar">Bar</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Radar">Radar</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {type === "Line" && (
                <ResponsiveContainer width={"80%"} height={300}>
                    <LineChart data={list}>
                        <CartesianGrid />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" name="Total Spent" dataKey="totalSpend" stroke="#85C898" />
                        <Line type="monotone" name="Budgeted Amount" dataKey="amount" stroke="#0F172A" />
                    </LineChart>
                </ResponsiveContainer>
            )}
            {type === "Bar" && (
                <ResponsiveContainer width={"80%"} height={300}>
                    <BarChart data={list}>
                        <CartesianGrid />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar name="Total Spent" dataKey="totalSpend" fill="#85C898" />
                        <Bar name="Budgeted Amount" dataKey="amount" fill="#0F172A" />
                    </BarChart>
                </ResponsiveContainer>
            )}
            {type === "Radar" && (
                 <ResponsiveContainer width={"80%"} height={300}>
                 <RadarChart outerRadius={90} data={list}>
                     <PolarGrid />
                     <PolarAngleAxis dataKey="name" />
                     <PolarRadiusAxis angle={30} domain={[0, 150]} />
                     <Radar name="Total Spent" dataKey="totalSpend" stroke="#85C898" fill="#85C898" fillOpacity={0.6} />
                     <Radar name="Budgeted Amount" dataKey="amount" stroke="#0F172A" fill="#0F172A" fillOpacity={0.6} />
                     <Legend />
                 </RadarChart>
             </ResponsiveContainer>
            )}
        </div>
    );
};

export default Chart;
