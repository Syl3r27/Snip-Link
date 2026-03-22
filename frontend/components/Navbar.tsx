"use client";
import React, { useEffect, useRef } from 'react'
import gsap from "gsap";
import Link from 'next/link';
import { User } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {

  const navRef = useRef<HTMLElement>(null);
  const {user} = useAuth();
useEffect(()=>{
    if(!navRef.current) return;
    gsap.fromTo(
        navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
},[]);
  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-xl bg-background/70 border-b border-border/50"
    >
        <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">S</span>
        </div>
        <span className="font-semibold text-lg tracking-tight text-foreground">
          Snip
        </span>
      </Link>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group"
            >
              Dashboard
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] gradient-bg transition-all duration-300 group-hover:w-3/4 rounded-full" />
            </Link>

            <Link
              href="/profile"
              className="p-2 rounded-lg border border-border bg-muted/50 transition-all duration-200 hover:bg-muted active:scale-[0.95]"
              title="Profile"
            >
              <User className="w-4 h-4 text-muted-foreground" />
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="px-5 py-2 text-sm font-medium text-primary-foreground gradient-bg rounded-lg transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              Sign up
            </Link>
          </>
        )}
      </div>

    </nav>
    
  )
}

export default Navbar