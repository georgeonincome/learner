'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Header — reproduced from the reference site's own markup.
 * Source: `_reference/site/www.savvypro.org/index.html` and the live capture in
 * `captured/index.html`; class names and structure preserved.
 */

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Learn Digital Skills', href: '/learn-digital-skills' },
  { label: 'Private Lessons', href: '/learning-with-a-coach' },
  { label: 'Books', href: '/books' },
  { label: 'CMO Services', href: '/business-solutions' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'STUDENT LOGIN', href: '/signin' },
]

const LOGO = 'https://letcheck.b-cdn.net/1887/clnizq4lo015wgq9nh2425qsy.jpg'

const CART_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

const MENU_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="sys-primary text-3xl"
    aria-hidden="true"
  >
    <path d="M4 12h16" />
    <path d="M4 18h16" />
    <path d="M4 6h16" />
  </svg>
)

export function Header({
  user = null,
  cartCount = 0,
}: {
  user?: { name?: string; email?: string } | null
  cartCount?: number
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  const initial = (user?.name || user?.email || 'S').trim().charAt(0).toUpperCase()

  return (
    <header
      style={{ ['--ezy-header-height' as string]: '0px' }}
      data-label="main-header"
      // The reference emits four escaped underscores in this arbitrary variant;
      // String.raw keeps them verbatim so the compiled selector still matches.
      className={`sticky left-0 top-0 z-20 w-full ${String.raw`[&_.\\\\_stMenu]:static`}`}
    >
      <div className="sticky left-0 top-0 z-[20] w-full">
        <div className="relative" />
        <div
          data-label="student-menu"
          className={`_stMenu translate sys-navbar-bg sticky left-0 top-0 z-[1000] w-full border-b backdrop-blur-sm backdrop-saturate-150 transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'} border-gray-100 shadow-gray-50`}
        >
          <div className="container mx-auto px-2.5 sm:px-5">
            <div className="_stMenu_inr d-flex h-[75px] w-full items-center justify-between gap-x-4 py-2 _stMenu_logout">
              <div className="_stMenu_logo h-full shrink-0 grow-0 basis-auto">
                <Link
                  href="/"
                  className="_stMenu_logo_lnk flex h-full max-w-24 flex-col items-center justify-center min-[440px]:max-w-32 sm:max-w-40"
                >
                  <img
                    src={LOGO}
                    className="img-fluid _stMenu_logo_img"
                    style={{ width: 'auto' }}
                    alt="Logo"
                  />
                </Link>
              </div>

              <div className="_stMenu_mdl_all">
                <div className="_stMenu_mdl flex-1 false">
                  <ul className="_stMenu_mdl_ul d-flex mx-auto">
                    {NAV.map((item) => (
                      <li key={item.href} className="_stMenu_mdl_li1">
                        <span className="_stMenu_mdl_li1_span">
                          <Link
                            href={item.href}
                            className={`_stMenu_mdl_txt cursor-pointer text-base sys-navbar-text ${
                              isActive(item.href)
                                ? 'sys-navbar-text-active font-semibold'
                                : 'font-medium text-ezy-gray-400'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <ul className="_stMenu_mdl_r8_ul d-flex align-items-center h-full gap-x-2">
                  {user ? (
                    <>
                      <li className="_stMenu_mdl_r8_li _stMenu_logIn">
                        <span>
                          <Link
                            href="/dashboard"
                            className="_stMenu_mdl_r8_li_lnk sys-secondary-button-text sys-secondary-button-bg flex h-full items-center justify-center rounded-lg border !px-4 !py-2 text-base transition-colors duration-300 ease-in-out"
                          >
                            Dashboard
                          </Link>
                        </span>
                      </li>
                      <li className="_stMenu_mdl_r8_li _stMenu_signUp">
                        <span>
                          <Link
                            href="/user"
                            aria-label={user.email || user.name || 'Account'}
                            className="_stMenu_mdl_r8_li_lnk sys-primary-button-text sys-primary-bg flex h-full items-center justify-center rounded-lg border bg-gray-900 !px-4 !py-2 text-base font-normal text-white transition-colors duration-300 ease-in-out hover:bg-gray-700"
                          >
                            {initial}
                          </Link>
                        </span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="_stMenu_mdl_r8_li _stMenu_signUp">
                        <span>
                          <Link
                            href="/signup"
                            className="_stMenu_mdl_r8_li_lnk sys-primary-button-text sys-primary-bg flex h-full items-center justify-center rounded-lg border bg-gray-900 !px-4 !py-2 text-base font-normal text-white transition-colors duration-300 ease-in-out hover:bg-gray-700"
                          >
                            Sign up
                          </Link>
                        </span>
                      </li>
                      <li className="_stMenu_mdl_r8_li _stMenu_logIn">
                        <span>
                          <Link
                            href="/login"
                            className="_stMenu_mdl_r8_li_lnk sys-secondary-button-text sys-secondary-button-bg flex h-full items-center justify-center rounded-lg border !px-4 !py-2 text-base transition-colors duration-300 ease-in-out"
                          >
                            Login
                          </Link>
                        </span>
                      </li>
                    </>
                  )}
                </ul>

                <div className="_menu_language !ml-1 min-[480px]:!ml-2.5 [&>_div_.ant-select-selector]:!bg-transparent" />

                <Link
                  href="/cart"
                  className="_position_relative sys-navbar-text !ml-1 flex cursor-pointer items-center gap-1.5 text-ezy-primary-500 min-[480px]:!ml-2.5"
                >
                  <div className="relative flex flex-col items-center justify-center">
                    <span className="inline-flex text-2xl">{CART_ICON}</span>
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ezy-primary-500 px-1 text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden text-sm font-semibold sm:inline">Cart</span>
                </Link>

                <div className="stMenu_mbl_hmbrg !ml-1 min-[480px]:!ml-2.5">
                  <button
                    type="button"
                    className="_landng_mobile_nav_button"
                    aria-label="Open menu"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                  >
                    <span className="">{MENU_ICON}</span>
                  </button>
                </div>
              </div>
            </div>

            {open && (
              <div className="_stMenu_mbl_panel pb-3 lg:hidden">
                <ul className="_stMenu_mdl_ul flex flex-col items-start gap-y-1">
                  {NAV.map((item) => (
                    <li key={item.href} className="_stMenu_mdl_li1">
                      <span className="_stMenu_mdl_li1_span">
                        <Link
                          href={item.href}
                          className={`_stMenu_mdl_txt cursor-pointer text-base sys-navbar-text ${
                            isActive(item.href)
                              ? 'sys-navbar-text-active font-semibold'
                              : 'font-medium text-ezy-gray-400'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
