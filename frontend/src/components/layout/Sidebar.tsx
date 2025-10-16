import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BedDoubleIcon, CalendarIcon, UsersIcon, BookOpenIcon, LogOutIcon, PackageIcon, DollarSignIcon } from 'lucide-react';
const Sidebar = () => {
  const navItems = [{
    name: 'Dashboard',
    path: '/',
    icon: <HomeIcon size={20} />
  }, {
    name: 'Rooms',
    path: '/rooms',
    icon: <BedDoubleIcon size={20} />
  }, {
    name: 'Bookings',
    path: '/bookings',
    icon: <BookOpenIcon size={20} />
  }, {
    name: 'Calendar',
    path: '/calendar',
    icon: <CalendarIcon size={20} />
  }, {
    name: 'Guests',
    path: '/guests',
    icon: <UsersIcon size={20} />
  }, {
    name: 'Inventory',
    path: '/inventory',
    icon: <PackageIcon size={20} />
  }, {
    name: 'Expenses',
    path: '/expenses',
    icon: <DollarSignIcon size={20} />
  }];
  return <aside className="bg-blue-800 text-white w-64 flex-shrink-0 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">SPSTI</h1>
          <p className="text-blue-300 text-sm">Management Portal</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {navItems.map(item => <li key={item.name}>
                <NavLink to={item.path} className={({
              isActive
            }) => `flex items-center px-4 py-3 text-sm ${isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-700'}`}>
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>)}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button className="flex items-center text-blue-100 hover:text-white w-full">
            <LogOutIcon size={20} className="mr-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>;
};
export default Sidebar;