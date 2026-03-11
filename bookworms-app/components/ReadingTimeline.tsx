"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import type { Milestone } from "@/lib/types";

interface Props {
  books: { finished_on: string; title: string }[];
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
}

interface DataPoint {
  date: number; // unix ms
  count: number;
  title: string;
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ReadingTimeline({ books, startDate, endDate, milestones }: Props) {
  const sorted = [...books].sort(
    (a, b) => new Date(a.finished_on).getTime() - new Date(b.finished_on).getTime()
  );

  // Build step data: start at 0, then one point per book
  const data: DataPoint[] = [{ date: startDate.getTime(), count: 0, title: "" }];
  sorted.forEach((book, i) => {
    data.push({
      date: new Date(book.finished_on).getTime() + i, // +i ms ensures unique keys when books share a date
      count: i + 1,
      title: book.title,
    });
  });
  // Add endpoint so the chart extends to endDate
  if (data[data.length - 1].date < endDate.getTime()) {
    data.push({ date: endDate.getTime(), count: data[data.length - 1].count, title: "" });
  }

  const maxY = Math.max(
    sorted.length * 1.5,
    milestones[milestones.length - 1].target * 1.1
  );

  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const weeklyTicks: number[] = [];
  for (let t = startDate.getTime(); t <= endDate.getTime(); t += ONE_WEEK_MS) {
    weeklyTicks.push(t);
  }

  const milestoneColors = ["#ef4444", "#3b82f6", "#8b5cf6", "#f59e0b"];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          type="number"
          scale="time"
          domain={[startDate.getTime(), endDate.getTime()]}
          ticks={weeklyTicks}
          tickFormatter={formatDate}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          domain={[0, Math.ceil(maxY)]}
          tick={{ fontSize: 11 }}
          width={32}
        />
        <Tooltip
          labelFormatter={(v) => formatDate(Number(v))}
          formatter={(value, _name, props) => [
            `${value} books`,
            props.payload?.title || "",
          ]}
        />
        {milestones.map((m, i) => (
          <ReferenceLine
            key={m.label}
            y={m.target}
            stroke={milestoneColors[i % milestoneColors.length]}
            strokeDasharray="6 3"
            label={{ value: `${m.emoji} ${m.label}`, position: "insideTopRight", fontSize: 11, fill: milestoneColors[i % milestoneColors.length] }}
          />
        ))}
        <Line
          type="stepAfter"
          dataKey="count"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
