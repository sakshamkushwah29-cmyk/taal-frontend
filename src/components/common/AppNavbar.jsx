"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useNotifications } from "@/contexts/NotificationContext";

import {
  Menu,
  User,
  ShoppingCart,
  Search,
  Settings,
  LogOut,
  CalendarCheck,
  Home,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TopHeaderStrip from "../_ui/TopHeaderStrip";

/* --- Reusable SearchBar --- */
function SearchBar({ placeholder, autoFocus = false, onSubmitSearch }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
    onSubmitSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full group">
      <button
        type="submit"
        aria-label="Search"
        className="absolute left-3 top-1/2 -translate-y-1/2"
      >
        <Search className="w-5 h-5 text-brand dark:text-brand-light" />
      </button>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border-b-2 border-transparent
                   focus:outline-none placeholder-gray-400
                   focus:placeholder-brand dark:focus:placeholder-brand-light
                   transition-colors duration-300 bg-transparent"
      />
      <span
        className="absolute bottom-0 left-0 h-0.5 bg-brand dark:bg-brand-light w-0
                   group-focus-within:w-full transition-all duration-300"
      />
    </form>
  );
}

export default function AppNavbar() {
  const router = useRouter();
  const { notifications } = useNotifications();
  const authUser = useSelector((state) => state.auth.authUser);
  const isAuthenticated = authUser?.isAuthenticated;
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  /* --- Navigation Data --- */
  const NAV_ITEMS = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/products" },
      { label: "Rentals", href: "/rentals" },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
      { label: "About", href: "/about" },
    ],
    []
  );

  const userProfilePic =
    authUser?.user?.profilePic || authUser?.user?.user?.profilePic;
  const userName =
    authUser?.user?.name || authUser?.user?.user?.name || "My Account";

  const ACCOUNT_LINKS = useMemo(
    () => [
      {
        href: "/account/my-bookings",
        label: "My Tickets",
        icon: CalendarCheck,
      },
      { href: "/account/my-orders", label: "My Orders", icon: ShoppingCart },
      { href: "/account/addresses", label: "My Addresses", icon: Home },
      { href: "/account/edit-profile", label: "Edit Profile", icon: User },
      {
        href: "/account/change-password",
        label: "Change Password",
        icon: Settings,
      },
      { href: "/logout", label: "Logout", icon: LogOut, danger: true },
    ],
    []
  );

  return (
    <header>
      <TopHeaderStrip />

      <div className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 lg:px-6">
          {/* ===== Desktop ===== */}
          <div className="hidden md:flex items-center justify-between py-2">
            <Link href="/" className="flex items-center w-1/4">
              <Image
                src="/assets/logos/taal_logo_updated.png"
                alt="Taal Logo"
                width={120}
                height={40}
                className="object-contain transition-transform hover:scale-105"
              />
            </Link>

            <div className="w-2/4 flex justify-center">
              <SearchBar placeholder="Search products, rentals, events..." />
            </div>

            <div className="w-1/4 flex justify-end items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 overflow-hidden"
                    >
                      {userProfilePic ? (
                        <img
                          src={userProfilePic}
                          alt={userName}
                          className="w-7 h-7 rounded-full object-cover border border-brand/20"
                        />
                      ) : (
                        <User className="w-5 h-5 text-brand" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {ACCOUNT_LINKS.map((link) => (
                      <DropdownMenuItem asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={link.danger ? "text-red-500" : ""}
                        >
                          <link.icon className="mr-2 h-4 w-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => router.push("/login")}
                >
                  <User className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* ===== Mobile ===== */}
          <div className="flex md:hidden items-center justify-between py-2 relative">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-64 p-6 flex flex-col justify-between"
              >
                {/* Main Links */}
                <nav className="flex flex-col gap-4 mt-6">
                  {NAV_ITEMS.map((item) => (
                    <SheetClose asChild key={item.label}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-100
                                   hover:text-brand dark:hover:text-brand-light transition-colors"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {/* Account Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                  <p className="text-xs uppercase text-gray-400 mb-3">
                    Account
                  </p>
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      {ACCOUNT_LINKS.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className={`flex items-center gap-2 text-gray-700 dark:text-gray-200
                                        hover:text-brand dark:hover:text-brand-light transition-colors ${
                                          link.danger
                                            ? "text-red-500 hover:text-red-600"
                                            : ""
                                        }`}
                          >
                            <link.icon size={18} />
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => router.push("/login")}
                      >
                        Login / Sign Up
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/">
              <Image
                src="/assets/logos/taal_logo_updated.png"
                alt="Taal Logo"
                width={80}
                height={30}
                className="object-contain ml-10"
              />
            </Link>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileSearchOpen((p) => !p)}
              >
                <Search className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>

              {!isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => router.push("/login")}
                >
                  <User className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 overflow-hidden"
                  onClick={() => router.push("/account/edit-profile")}
                >
                  {userProfilePic ? (
                    <img
                      src={userProfilePic}
                      alt={userName}
                      className="w-6 h-6 rounded-full object-cover border border-brand/20"
                    />
                  ) : (
                    <User className="w-5 h-5 text-brand" />
                  )}
                </Button>
              )}
            </div>

            {/* Slide-down mobile search */}
            {mobileSearchOpen && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 p-4 shadow-md z-50 border-t border-gray-200 dark:border-gray-700">
                <SearchBar
                  placeholder="Search products, rentals, events..."
                  autoFocus
                  onSubmitSearch={() => setMobileSearchOpen(false)}
                />
              </div>
            )}
          </div>

          {/* ===== Desktop Bottom Nav ===== */}
          <div className="hidden md:flex justify-center border-t border-gray-200 dark:border-gray-700">
            <NavigationMenu className="py-2">
              <NavigationMenuList className="flex gap-6">
                {NAV_ITEMS.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className="px-6 py-4 font-medium tracking-wide text-gray-800 dark:text-gray-100
                                   hover:text-brand dark:hover:text-brand-light relative
                                   after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:w-0
                                   after:bg-brand dark:after:bg-brand-light after:transition-all after:duration-500
                                   hover:after:w-4/5 hover:after:left-[10%]"
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
