'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PostLoginCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleGetToken = async () => {
    try {
      const response = await fetch('/api/auth/getToken');
      const data = await response.json();

      if (data.success && data.accessToken) {
        window.location.reload()
      } else {
        console.error('Failed to retrieve token:', data.error);
      }
    } catch (error) {
      console.error('Failed to retrieve token:', error);
    }
  };

  useEffect(() => {
    const code = searchParams ? searchParams.get('code') : null;


    if (code) {
      fetch('/api/auth/saveCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      .then(response => {
        if (response.ok) {
          router.push('/');
        }
      }).then(() => {
        handleGetToken();
      })
      .catch(error => {
        console.error('Failed to save code:', error);
        router.push('/');
      });
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  return <div>Processing Login..</div>;
}