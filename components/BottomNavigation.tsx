"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Search, label: 'Booking', href: '/booking' },
  { icon: History, label: 'History', href: '/history' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/' || pathname === '/register') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "text-blue-600")} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}