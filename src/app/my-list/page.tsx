"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar/navbar"
import { TitleCard } from "@/components/cards/title-card"
import { UserList } from "@/lib/types"

export default function MyListPage() {
  const [userList, setUserList] = useState<UserList[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await fetch("/api/my-list")
        if (response.ok) {
          const data = await response.json()
          setUserList(data)
        }
      } catch (error) {
        console.error("Failed to fetch user list:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserList()
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 px-8 md:px-12 lg:px-16">
          <div className="text-center text-gray-400 py-8">
            Loading your list...
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="pt-20 px-8 md:px-12 lg:px-16">
        <h1 className="text-3xl font-bold text-white mb-8">My List</h1>

        {userList.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <p className="text-xl mb-4">Your list is empty</p>
            <p>Add movies and TV shows to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {userList.map((item) => (
              <TitleCard key={item.id} movie={item.movie} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}