import { Legend, Line } from "recharts";
import { CartesianGrid, XAxis, YAxis } from "recharts";
import { LineChart } from "recharts";
import { ResponsiveContainer } from "recharts";


export interface LineProps {
    dataKey: string,
    name: string,
    color: string
}

interface RedisLineChartProps {
    data: any[];
    lines: LineProps[];
}

export default function RedisLineChart({ data, lines }: RedisLineChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                    dataKey="time"
                    stroke="#666"
                    fontSize={13}
                    tick={{ fill: '#9ca3af' }}
                />
                <YAxis
                    stroke="#666"
                    fontSize={12}
                    tick={{ fill: '#9ca3af' }}
                />

                {lines.map((line) => (
                    <Line
                        name={line.name}
                        type="basis"
                        dataKey={line.dataKey}
                        stroke={line.color}
                        dot={false}
                        strokeWidth={2}
                    />
                ))}
                <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontWeight: 'bold' }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}