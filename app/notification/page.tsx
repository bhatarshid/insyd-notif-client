'use client';
import { useEffect, useState } from 'react';
import useWebSocket from '@/components/hooks/webSocket';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { messages, isConnected, auth } = useWebSocket('ws://localhost:3000');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      console.log(userData)
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (isConnected) {
        auth(parsedUser.id);
      }
    }
    else {
      router.push(`/`)
    }
  }, [isConnected]);

  return (
    <div className='flex flex-col items-center justify-start min-h-screen p-6 bg-gray-50'>
      <h2 className='text-2xl font-semibold mb-4'>Notifications</h2>

      {messages.length === 0 ? (
        <div className='text-gray-500'>No notifications</div>
      ) : (
        <div className='w-full max-w-xl space-y-4'>
          {messages.map((notif, index) => {
            const parsedNotif = JSON.parse(notif);
            if (['like', 'comment'].includes(parsedNotif.type)) {
              return (
                <div
                  key={index}
                  className='flex items-start p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition'
                >
                  <div className='flex-shrink-0'>
                    <span className='inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600'>
                      💬
                    </span>
                  </div>
                  <div className='ml-4'>
                    <p className='text-gray-800'>{parsedNotif.message}</p>
                    <p className='text-sm text-gray-500 mt-1 capitalize'>
                      Type: {parsedNotif.type}
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}