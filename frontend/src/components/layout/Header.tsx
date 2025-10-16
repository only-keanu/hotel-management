import React from 'react';
import { BellIcon, MenuIcon, SearchIcon } from 'lucide-react';
const Header = () => {
  return <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 h-16">
      <div className="flex items-center md:hidden">
        <button className="text-gray-500 hover:text-gray-700">
          <MenuIcon size={24} />
        </button>
      </div>
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input type="text" placeholder="Search rooms, guests or bookings..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
      <div className="flex items-center">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 mr-3">
          <BellIcon size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            SP
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
            SPSTI Manager
          </span>
        </div>
      </div>
    </header>;
};
export default Header;