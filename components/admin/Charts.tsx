"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from "recharts";

const COLORS = ["#5d8a6e", "#d4a843", "#7c6e5a", "#a3b899", "#c4956a", "#6b8fa3", "#b8860b", "#8fbc8f"];

interface MonthData {
  mes: string;
  label: string;
  ingresos: number;
  comisiones: number;
  neto: number;
}

interface PieData {
  name: string;
  value: number;
}

interface RepData {
  nombre: string;
  comision: number;
  ingresos: number;
}

function formatK(v: number): string {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

function formatPesos(v: number): string {
  return v.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bark text-white rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex justify-between gap-4">
          <span className="opacity-70">{p.name}:</span>
          <span className="font-semibold">{formatPesos(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bark text-white rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-medium">{payload[0].name}</p>
      <p className="font-semibold">{formatPesos(payload[0].value)}</p>
    </div>
  );
}

export function ChartIngresosPorMes({ data, mesSeleccionado, onSelect }: { data: MonthData[]; mesSeleccionado: string; onSelect: (mes: string) => void }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d4" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#7c6e5a" }}
            tickLine={false}
            axisLine={{ stroke: "#e8e0d4" }}
            onClick={(e: any) => {
              const d = data[e?.activeTooltipIndex];
              if (d) onSelect(d.mes);
            }}
            style={{ cursor: "pointer" }}
          />
          <YAxis tick={{ fontSize: 10, fill: "#7c6e5a" }} tickLine={false} axisLine={false} tickFormatter={formatK} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(93,138,110,0.08)" }} />
          <Bar
            dataKey="ingresos"
            name="Ingresos"
            radius={[6, 6, 0, 0]}
            onClick={(e: any) => onSelect(e.mes)}
            style={{ cursor: "pointer" }}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.mes === mesSeleccionado ? "#5d8a6e" : "#a3b899"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartComisionesPorMes({ data, mesSeleccionado }: { data: MonthData[]; mesSeleccionado: string }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5d8a6e" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#5d8a6e" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradComisiones" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4a843" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#d4a843" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d4" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#7c6e5a" }} tickLine={false} axisLine={{ stroke: "#e8e0d4" }} />
          <YAxis tick={{ fontSize: 10, fill: "#7c6e5a" }} tickLine={false} axisLine={false} tickFormatter={formatK} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#5d8a6e" fill="url(#gradIngresos)" strokeWidth={2} dot={{ r: 4, fill: "#5d8a6e", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#5d8a6e", stroke: "#fff", strokeWidth: 2 }} />
          <Area type="monotone" dataKey="comisiones" name="Comisiones" stroke="#d4a843" fill="url(#gradComisiones)" strokeWidth={2} dot={{ r: 4, fill: "#d4a843", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#d4a843", stroke: "#fff", strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartMetodosPago({ data }: { data: PieData[] }) {
  if (data.length === 0) return <p className="text-sm text-bark-500 text-center py-4">Sin datos</p>;
  return (
    <div className="flex items-center gap-4">
      <div className="w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={65}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-xs text-bark-600 flex-1">{d.name}</span>
            <span className="text-xs font-semibold text-bark">{formatPesos(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartComisionesPorRep({ data }: { data: RepData[] }) {
  if (data.length === 0) return <p className="text-sm text-bark-500 text-center py-4">Sin comisiones este mes</p>;
  return (
    <div className="w-full" style={{ height: Math.max(data.length * 50, 80) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d4" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#7c6e5a" }} tickLine={false} axisLine={false} tickFormatter={formatK} />
          <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11, fill: "#7c6e5a" }} tickLine={false} axisLine={false} width={100} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(93,138,110,0.08)" }} />
          <Bar dataKey="comision" name="Comisión" fill="#d4a843" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
