"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu as LucideMenu, X } from "lucide-react"
import { useAuthStore } from '@/stores/authStore'

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { authenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 bg-[#1C1C1C] shadow-md border-b border-gray-800">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold tracking-wide text-primary">
            SEB API DEMO
          </Link>

          {/* Desktop Menu */}
          <nav className="items-center hidden space-x-8 md:flex">
            {authenticated && (
              <>
                <Link href="/accounts" className="text-gray-300 transition hover:text-primary">
                  Accounts
                </Link>
                <Link href="/payment/initiation" className="text-gray-300 transition hover:text-primary">
                  Payment
                </Link>
                <Link href="/payment/list" className="text-gray-300 transition hover:text-primary">
                  Payment List
                </Link>
                <Link href="/foreign-exchange-rate" className="text-gray-300 transition hover:text-primary">
                  Exchange rates
                </Link>
                <Link href="/alternative-investments" className="text-gray-300 transition hover:text-primary">
                  FX Market Orders
                </Link>
                <Link href="/foreign-exchange-currency-account-transfer" className="text-gray-300 transition hover:text-primary">
                  Exchange
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-sm text-gray-400 transition hover:text-red-400"
                >
                  Logout
                </button>
              </>
            )}
            {!authenticated && (
              <>
                <Link href="/" className="text-gray-300 transition hover:text-primary">
                  Login
                </Link>
                <Link href="/foreign-exchange-rate" className="text-gray-300 transition hover:text-primary">
                  Exchange rates
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-primary focus:outline-none md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <LucideMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 rounded-lg border border-gray-800 bg-[#1C1C1C] p-4">
            <ul className="space-y-4 text-sm">
            {authenticated && (
              <>
              <li>
                <Link
                  href="/accounts"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 transition hover:text-primary"
                >
                  Accounts
                </Link>
              </li>
              <li>
                <Link
                  href="/foreign-exchange-rate"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 transition hover:text-primary"
                >
                  Exchange rates
                </Link>
              </li>
              <li>
                <Link
                  href="/payment/initiation"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 transition hover:text-primary"
                >
                  Payment
                </Link>
              </li>
              <li>
                <Link
                  href="/payment/list"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 transition hover:text-primary"
                >
                  Payment List
                </Link>
              </li>
              <li>
                <Link
                  href="/alternative-investments"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 transition hover:text-primary"
                >
                  FX Market Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/foreign-exchange-currency-account-transfer"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 transition hover:text-primary"
                >
                  Exchange
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-400 transition hover:text-red-400"
                >
                  Logout
                </button>
              </li>
              </>
            )}
            {!authenticated && (
              <>
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-300 transition hover:text-primary"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-300 transition hover:text-primary"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}

export default Menu
