import { UserList } from "@/lib/types"
import { getMovieById } from "./movie-repo"

const MOCK_USER_ID = "mock-user-1"

const mockUserList: string[] = []

export async function getUserList(userId: string = MOCK_USER_ID): Promise<UserList[]> {
  const userListWithMovies = await Promise.all(
    mockUserList.map(async (movieId) => {
      const movie = await getMovieById(movieId)
      return movie ? {
        id: `${userId}-${movieId}`,
        userId,
        movieId,
        movie
      } : null
    })
  )

  return userListWithMovies.filter(Boolean) as UserList[]
}

export async function addToUserList(movieId: string, userId: string = MOCK_USER_ID): Promise<boolean> {
  if (!mockUserList.includes(movieId)) {
    mockUserList.push(movieId)
    return true
  }
  return false
}

export async function removeFromUserList(movieId: string, userId: string = MOCK_USER_ID): Promise<boolean> {
  const index = mockUserList.indexOf(movieId)
  if (index > -1) {
    mockUserList.splice(index, 1)
    return true
  }
  return false
}

export async function isInUserList(movieId: string, userId: string = MOCK_USER_ID): Promise<boolean> {
  return mockUserList.includes(movieId)
}