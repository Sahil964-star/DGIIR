import React from 'react';
import { Bell, Globe, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 fixed top-0 right-0 left-[260px] flex items-center justify-between px-8 z-10">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Hello, Citizen <span className="text-2xl">👋</span>
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">Let's make our city a better place together.</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Globe className="w-5 h-5" />
          <span className="text-sm font-medium">English</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* Profile Avatar */}
        <div className="w-10 h-10 rounded-full bg-dgiir-green-100 flex items-center justify-center border border-dgiir-green-200 cursor-pointer ml-2">
          <User className="w-5 h-5 text-dgiir-green-700" />
        </div>
      </div>
    </header>
  );
};

export default Header;
