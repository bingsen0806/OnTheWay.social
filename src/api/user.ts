import { User, Gender, Faculty } from "./types";

/**
 * Get user object
 * TODO: add firebase func call.
 */
export async function getUser(userId: string) {
  const sampleUser: User = {
    id: userId,
    name: "Chun",
    gender: Gender.PREFER_NOT_TO_SAY,
    faculty: Faculty.COMPUTING,
    telegramHandle: "",
    year: 0,
    profilePhoto: "",
    thumbnailPhoto:
      "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
  };
  return Promise.resolve(sampleUser);
}
