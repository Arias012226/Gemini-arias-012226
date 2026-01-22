import React from 'react';
import { Card } from './ui/Components';
import { MOCK_DASHBOARD_DATA } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, Zap, Users } from 'lucide-react';
import { Language } from '../types';

interface DashboardProps {
  labels: Record<string, string>;
  isDark: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ labels, isDark }) => {
  const chartColor = isDark ? '#ffffff' : '#000000';
  const gridColor = isDark ? '#444444' : '#e5e5e5';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 flex items-center space-x-4 bg-card/80 backdrop-blur-md">
          <div className="p-3 bg-primary/10 rounded-full">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{labels.totalRuns}</p>
            <h3 className="text-2xl font-bold">{MOCK_DASHBOARD_DATA.metrics.totalRuns}</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center space-x-4 bg-card/80 backdrop-blur-md">
          <div className="p-3 bg-secondary/10 rounded-full">
            <Users className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{labels.activeAgents}</p>
            <h3 className="text-2xl font-bold">{MOCK_DASHBOARD_DATA.metrics.activeAgents}</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center space-x-4 bg-card/80 backdrop-blur-md">
          <div className="p-3 bg-muted/30 rounded-full">
            <Zap className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{labels.latency}</p>
            <h3 className="text-2xl font-bold">{MOCK_DASHBOARD_DATA.metrics.latency}</h3>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6 bg-card/80 backdrop-blur-md">
          <h3 className="mb-4 text-lg font-semibold">Usage Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DASHBOARD_DATA.usage}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={chartColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={chartColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                  itemStyle={{ color: 'var(--card-foreground)' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--primary)" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="col-span-3 p-6 bg-card/80 backdrop-blur-md">
          <h3 className="mb-4 text-lg font-semibold">Model Distribution</h3>
           <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DASHBOARD_DATA.models}>
                 <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={chartColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={chartColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'var(--muted)'}}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                  itemStyle={{ color: 'var(--card-foreground)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
