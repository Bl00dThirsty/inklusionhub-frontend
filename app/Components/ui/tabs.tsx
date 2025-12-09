'use client';

import * as React from 'react';

export function Tabs({ className, defaultValue, children, ...props }: any) {
  return (
    <div className={`w-full ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsList({ className, children, ...props }: any) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ className, value, children, ...props }: any) {
  return (
    <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm ${className}`} {...props}>
      {children}
    </button>
  );
}

export function TabsContent({ className, value, children, ...props }: any) {
  return (
    <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`} {...props}>
      {children}
    </div>
  );
}