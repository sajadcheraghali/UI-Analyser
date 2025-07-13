'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function comment() {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<{ user: string; text: string }[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/comments')
      .then(res => res.json())
      .then(data => setComments(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      setText('');
      const updated = await fetch('/api/comments').then(res => res.json());
      setComments(updated);
    } else {
      alert('ارسال نظر با مشکل مواجه شد.');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">نظرات کاربران</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full border p-2 rounded mb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!session || loading}
          placeholder={session ? "نظر خود را بنویسید..." : "برای ارسال نظر باید لاگین کنید."}
        />
        <button
          type="submit"
          disabled={!session || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          ارسال نظر
        </button>
      </form>

         <div className="max-w-2xl mx-auto p-4 "> {/* پس‌زمینه آبی روشن */}
            {comments.map((comment, i) => (
            <div key={i} className="mb-4 last:mb-0 bg-blue-50 rounded-lg shadow-md p-4 ">
            <div className="border border-black-300 rounded-md p-3 mb-2"> {/* کادر آبی برای نام کاربر */}
                <p className="text-sm text-blue-600 font-medium">{comment.user}</p>
            </div>
            <div className="border border-blue-300 rounded-md p-3"> {/* کادر آبی برای متن کامنت */}
                <p className="text-gray-800 leading-relaxed">{comment.text}</p>
            </div>
            </div>
        ))}
        </div>  
    </div>
  );
}
