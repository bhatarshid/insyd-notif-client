"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThumbsUp } from "lucide-react"

interface ContentItem {
  id: number
  title: string
  body: string
  author: string
  date: string
}

const contentArray: ContentItem[] = [
  {
    id: 1,
    title: "Understanding React Hooks",
    body: "React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 and have changed how we write React components.\n\nHooks like useState, useEffect, and useContext allow you to reuse stateful logic between components without changing your component hierarchy. This makes your code more readable and easier to maintain.",
    author: "React Team",
    date: "May 2, 2023",
  },
  {
    id: 2,
    title: "Getting Started with Next.js",
    body: "Next.js is a React framework that enables server-side rendering, static site generation, and more. It's designed to make building React applications easier and more productive.\n\nWith features like file-based routing, API routes, and built-in CSS support, Next.js provides a complete solution for building modern web applications. It's also highly extensible, allowing you to customize it to your needs.",
    author: "Vercel",
    date: "June 15, 2023",
  },
  {
    id: 3,
    title: "The Power of Tailwind CSS",
    body: "Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without ever leaving your HTML. Instead of pre-designed components, Tailwind provides low-level utility classes that let you build completely custom designs.\n\nThis approach gives you the flexibility to create unique designs while still benefiting from the consistency and maintainability of a framework. It's also highly customizable, allowing you to adapt it to your brand.",
    author: "Tailwind Labs",
    date: "April 10, 2023",
  },
]

interface Comment {
  id: number
  text: string
  author: string
  date: string
}

export default function ContentPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "Guest"

  const [selectedContentId, setSelectedContentId] = useState(1)
  const selectedContent = contentArray.find((item) => item.id === selectedContentId) || contentArray[0]

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(42)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      text: "This is really interesting content!",
      author: "user@example.com",
      date: "2 hours ago",
    },
    {
      id: 2,
      text: "I learned a lot from this, thanks for sharing.",
      author: "another@example.com",
      date: "5 hours ago",
    },
  ])

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    const newComment: Comment = {
      id: Date.now(),
      text: comment,
      author: email,
      date: "Just now",
    }

    setComments([newComment, ...comments])
    setComment("")
  }

  // Redirect if no email is provided
  useEffect(() => {
    if (!searchParams.get("email")) {
      window.location.href = "/"
    }
  }, [searchParams])

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <div>
                <CardTitle>{selectedContent.title}</CardTitle>
                <CardDescription>Viewing as: {email}</CardDescription>
              </div>
              <div className="flex gap-2">
                {contentArray.map((item) => (
                  <Button
                    key={item.id}
                    variant={item.id === selectedContentId ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedContentId(item.id)}
                  >
                    Article {item.id}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              By {selectedContent.author} • {selectedContent.date}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {selectedContent.body.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant={liked ? "default" : "outline"} onClick={handleLike} className="flex items-center gap-2">
              <ThumbsUp size={16} />
              <span>{likeCount}</span>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddComment} className="space-y-4 mb-6">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full"
              />
              <Button type="submit">Post Comment</Button>
            </form>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar>
                      <AvatarFallback>{comment.author[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{comment.author}</p>
                      <p className="text-xs text-gray-500">{comment.date}</p>
                    </div>
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
