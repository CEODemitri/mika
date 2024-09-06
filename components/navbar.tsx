'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon, XIcon } from 'lucide-react'
import { ModeToggle } from './ui/Toggle'


export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Services', href: '#' },
  ]

  return (
    <nav className="shadow-md">
      <div className="min-w-[100%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-wider">MIKA</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <ModeToggle/>

          <div className="-mr-2 flex items-center sm:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col p-0">
                <div className="flex justify-between items-center py-4 px-6 border-b">
                  <span className="text-xl font-bold">MIKA</span>
                  
                </div>
                <div className="flex-grow py-6 px-6">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block py-2 text-base font-medium text-gray-900 hover:bg-gray-800 hover:text-gray-500 rounded-md px-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="mt-auto bg-gray-900 text-white py-4 px-6 h-52">
                  <p className="text-sm">© 2024 Mika: For Kosmonauts. All rights we were born with.</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}