"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, X } from "@/components/common/icons"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/war-collection", label: "War Collection" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Link href="/" className="navbar-logo">
            <img src="/xflix-logo.svg" alt="XFLIX" className="h-8" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "navbar-link",
                pathname === item.href && "navbar-link-active"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          <Link href="/search" className="navbar-action-btn">
            <Search className="navbar-action-icon" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-content">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "navbar-mobile-link",
                  pathname === item.href && "navbar-mobile-link-active"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}