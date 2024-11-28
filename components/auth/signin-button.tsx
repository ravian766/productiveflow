'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function SignInButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if we have a session token
    const hasToken = document.cookie.includes('session-token');
    setIsLoggedIn(hasToken);
  }, []);

  const handleSignOut = async () => {
    // Clear the session token
    document.cookie = 'session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setIsLoggedIn(false);
    router.push('/auth/signin');
    router.refresh();
  };

  if (isLoggedIn) {
    return (
      <div className="flex gap-4 ml-auto">
        <button 
          onClick={handleSignOut} 
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => router.push('/auth/signin')} 
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md ml-auto"
    >
      Sign In
    </button>
  );
}