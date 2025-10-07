import { NextRequest, NextResponse } from "next/server"
import { getUserList, addToUserList, removeFromUserList } from "@/lib/repos/user-list-repo"

export async function GET() {
  try {
    const userList = await getUserList()
    return NextResponse.json(userList)
  } catch (error) {
    console.error("Error fetching user list:", error)
    return NextResponse.json(
      { error: "Failed to fetch user list" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { movieId } = await request.json()

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      )
    }

    const success = await addToUserList(movieId)

    if (!success) {
      return NextResponse.json(
        { error: "Movie is already in the list" },
        { status: 409 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding to user list:", error)
    return NextResponse.json(
      { error: "Failed to add to user list" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { movieId } = await request.json()

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      )
    }

    const success = await removeFromUserList(movieId)

    if (!success) {
      return NextResponse.json(
        { error: "Movie not found in list" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from user list:", error)
    return NextResponse.json(
      { error: "Failed to remove from user list" },
      { status: 500 }
    )
  }
}