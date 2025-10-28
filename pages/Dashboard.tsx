import React from 'react';
import { BuildingOffice2Icon, UserGroupIcon, BriefcaseIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const stats = [
  { name: 'Empresas Ativas', stat: '12', icon: BuildingOffice2Icon },
  { name: 'Clientes Cadastrados', stat: '78', icon: UserGroupIcon },
  { name: 'Funcionários Alocados', stat: '115', icon: BriefcaseIcon },
  { name: 'Total Faturado (Mês)', stat: 'R$ 45.890,50', icon: CurrencyDollarIcon },
];

const data = [
  { name: 'Jan', Faturamento: 40000 },
  { name: 'Fev', Faturamento: 30000 },
  { name: 'Mar', Faturamento: 52000 },
  { name: 'Abr', Faturamento: 48000 },
  { name: 'Mai', Faturamento: 61000 },
  { name: 'Jun', Faturamento: 55000 },
];

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
      <p className="mt-2 text-slate-600">Visão geral do seu sistema de gestão.</p>
      
      <div className="mt-8">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.name} className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-8 shadow sm:px-6 sm:pt-6">
              <dt>
                <div className="absolute rounded-md bg-blue-500 p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Faturamento Mensal</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar dataKey="Faturamento" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;