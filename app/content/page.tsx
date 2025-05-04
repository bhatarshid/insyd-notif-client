'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation"
import { decode } from 'punycode';

interface Comment {
  comment: string;
  user_id: number;
  commenter_name: string;
}

interface Like {
  user_id: number;
  liker_name: string;
  liker_email: string;
}

interface Content {
  id: number;
  userId: number;
  content: string;
  created_at: string;
  user_name: string;
  user_email: string;
  comments: Comment[];
  likes: Like[];
  like_count: number;
}

export default function Page() {
  const [contentArray, setContentArray] = useState<Content[]>([]);
  const [commentInput, setCommentInput] = useState<Record<number, string>>({});
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "Guest"

  useEffect(() => {
    fetchData();
    fetch('http://localhost:3000/api/user?email='+decodeURI(email))
      .then(async (response) => {
        const data = await response.json();
        console.log(data)
        setUser(data.user);
      });
  }, []);

  const fetchData = async () => {
    const res = await fetch('http://localhost:3000/api/posts');
    const data = await res.json();
    setContentArray(data.posts);
  };

  const handleCommentChange = (postId: number, text: string) => {
    setCommentInput((prev) => ({
      ...prev,
      [postId]: text,
    }));
  };

  const handleAddComment = async (postId: number) => {
    const text = commentInput[postId]?.trim();
    if (!text) return;
    await fetch(`http://localhost:3000/api/posts/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: text,  postId, userId: user?.id }),
    });

    setCommentInput((prev) => ({ ...prev, [postId]: '' }));
    fetchData();
  };

  const handleLike = async (postId: number) => {
    await fetch(`http://localhost:3000/api/posts/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId, userId: user?.id }),
    });
    fetchData();
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-8 px-4'>
      {contentArray.length === 0 ? (
        <div>No content available</div>
      ) : (
        contentArray.map((item) => (
          <div
            key={item.id}
            className='w-full max-w-xl mb-6 p-4 border rounded-xl shadow-md bg-white'
          >
            <div className='text-lg font-semibold mb-2'>{item.user_name}</div>
            <div className='text-gray-800 mb-2'>{item.content}</div>
            <div className='text-sm text-gray-500 mb-2'>
              Posted on: {item.created_at}
            </div>

            <button
              onClick={() => handleLike(item.id)}
              className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mb-2'
            >
              Like ({item.like_count})
            </button>

            <div className='mb-4'>
              <input
                type='text'
                placeholder='Add a comment...'
                value={commentInput[item.id] || ''}
                onChange={(e) => handleCommentChange(item.id, e.target.value)}
                className='border px-2 py-1 rounded w-full mb-2'
              />
              <button
                onClick={() => handleAddComment(item.id)}
                className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'
              >
                Post Comment
              </button>
            </div>

            <div className='mt-2 space-y-3'>
              {item.comments.map((comment, idx) => (
                <div key={idx} className='ml-2 border-l pl-3'>
                  <div className='text-sm font-medium'>
                    {comment.commenter_name}
                  </div>
                  <div className='text-sm text-gray-700'>
                    {comment.comment}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
