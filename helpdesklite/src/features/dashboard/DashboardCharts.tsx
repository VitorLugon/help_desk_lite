"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardChartsProps = {
  priorityData: Array<{
    label: string;
    total: number;
  }>;
  statusData: Array<{
    label: string;
    total: number;
  }>;
};

export function DashboardCharts({
  priorityData,
  statusData,
}: DashboardChartsProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <ChartPanel data={statusData} title="Chamados por status" />
      <ChartPanel data={priorityData} title="Chamados por prioridade" />
    </section>
  );
}

function ChartPanel({
  data,
  title,
}: {
  data: Array<{ label: string; total: number }>;
  title: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 h-72">
        {data.length > 0 ? (
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={data} margin={{ bottom: 28, left: -20, right: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                interval={0}
                tick={{ fill: "#475569", fontSize: 12 }}
                tickMargin={12}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#475569", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="total" fill="#0e7490" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
            Sem dados para exibir.
          </div>
        )}
      </div>
    </article>
  );
}
