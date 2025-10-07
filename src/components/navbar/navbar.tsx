"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User, Bell, Menu, X } from "@/components/common/icons"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
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
            <span className="navbar-logo-n">X</span>
            <span className="navbar-logo-text">FLIX</span>
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

          <button className="navbar-action-btn">
            <Bell className="navbar-action-icon" />
          </button>

          <div className="navbar-profile">
            <button className="navbar-profile-btn">
              <User className="navbar-profile-icon" />
            </button>
            <div className="navbar-profile-dropdown">
              <Link href="/profile" className="navbar-dropdown-item">Profile</Link>
              <Link href="/settings" className="navbar-dropdown-item">Settings</Link>
              <hr className="navbar-dropdown-divider" />
              <button className="navbar-dropdown-item">Sign Out</button>
            </div>
          </div>

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
            <hr className="navbar-mobile-divider" />
            <Link href="/profile" className="navbar-mobile-link">Profile</Link>
            <Link href="/settings" className="navbar-mobile-link">Settings</Link>
            <button className="navbar-mobile-link">Sign Out</button>
          </div>
        </div>
      )}
    </nav>
  )
}