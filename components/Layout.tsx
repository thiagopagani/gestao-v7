import React, { useState, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BuildingOffice2Icon, UserGroupIcon, BriefcaseIcon, CurrencyDollarIcon, DocumentTextIcon, DocumentChartBarIcon, UsersIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Empresas', href: '/empresas', icon: BuildingOffice2Icon },
  { name: 'Clientes', href: '/clientes', icon: UserGroupIcon },
  { name: 'Funcionários', href: '/funcionarios', icon: BriefcaseIcon },
  { name: 'Diárias', href: '/diarias', icon: CurrencyDollarIcon },
  { name: 'Recibos', href: '/recibos', icon: DocumentTextIcon },
  { name: 'Relatórios', href: '/relatorios', icon: DocumentChartBarIcon },
  { name: 'Usuários', href: '/usuarios', icon: UsersIcon },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex flex-col flex-1 px-2 space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
              isActive
                ? 'bg-blue-900 text-white'
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`
          }
        >
          <item.icon className="mr-3 h-6 w-6 flex-shrink-0 text-blue-300" aria-hidden="true" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-blue-800 pt-5 pb-4">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-2xl font-bold text-white">Gestão T7</h1>
          </div>
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <NavLinks />
          </div>
        </div>
        <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex min-h-0 flex-1 flex-col bg-blue-800">
          <div className="flex h-16 flex-shrink-0 items-center bg-blue-900 px-4">
            <h1 className="text-2xl font-bold text-white">Gestão T7</h1>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <NavLinks />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              {/* Search bar can go here */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown can go here */}
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;