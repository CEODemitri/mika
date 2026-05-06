'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MenuIcon, ChevronDown } from 'lucide-react'
import { ModeToggle } from './ui/Toggle'

const navItems = [
  { href: '/', label: 'Home' },
  {
    label: 'Astrology',
    href: '/astrology',
    children: [
      { href: '/astrology/birth-chart', label: 'Birth Chart' },
      { href: '/astrology/zodiac-signs', label: 'Zodiac Signs' },
      { href: '/astrology/planets', label: 'Planets & Houses' },
      { href: '/astrology/transits', label: 'Transits' },
    ],
  },
  {
    label: 'Mythology',
    href: '/mythology',
    children: [
      { href: '/mythology/greek', label: 'Greek Myths' },
      { href: '/mythology/roman', label: 'Roman Myths' },
      { href: '/mythology/celestial-lore', label: 'Celestial Lore' },
    ],
  },
  {
    label: 'Moon',
    href: '/moon',
    children: [
      { href: '/moon/phases', label: 'Moon Phases' },
      { href: '/moon/calendar', label: 'Lunar Calendar' },
      { href: '/moon/rituals', label: 'Lunar Rituals' },
    ],
  },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

type NavItem = {
  href: string
  label: string
  children?: { href: string; label: string }[]
}

function DesktopDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200"
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200">
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 rounded-md bg-popover border border-border shadow-lg z-50 py-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-150"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-widest text-primary">
              MIKA
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground tracking-[0.3em] uppercase font-sans mt-1">
              for kosmonauts
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => (
              <DesktopDropdown key={item.label} item={item} />
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[360px] flex flex-col p-0 bg-background border-border">
                  <div className="flex items-center justify-between py-5 px-6 border-b border-border">
                    <span className="font-serif text-xl font-bold tracking-widest text-primary">MIKA</span>
                  </div>
                  <nav className="flex-1 overflow-y-auto py-4 px-4" aria-label="Mobile navigation">
                    {navItems.map((item) => (
                      <div key={item.label}>
                        {item.children ? (
                          <div>
                            <button
                              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary rounded-md transition-colors"
                              onClick={() =>
                                setExpandedMobile(
                                  expandedMobile === item.label ? null : item.label
                                )
                              }
                            >
                              {item.label}
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                                  expandedMobile === item.label ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            {expandedMobile === item.label && (
                              <div className="ml-3 mt-1 mb-2 border-l border-border pl-3 flex flex-col gap-1">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-primary rounded transition-colors"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className="block px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>
                  <div className="bg-muted border-t border-border py-5 px-6">
                    <p className="text-xs text-muted-foreground tracking-wide leading-relaxed">
                      &copy; {new Date().getFullYear()} Mika: For Kosmonauts.
                      <br />
                      All rights we were born with.
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
