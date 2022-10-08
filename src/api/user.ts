import { User, Gender, Faculty } from "./types";
import { uploadImage } from "./uploader";

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

export function uploadImageAndStoreToDb(user: User, image: File) {
  const callback = (urls: string[]) => {
    if (urls.length !== 2) {
      return;
    }
    const profilePhoto = urls[0];
    const thumbnailPhoto = urls[1];
    const updatedUser: User = {
      id: user.id,
      name: user.name,
      gender: user.gender,
      faculty: user.faculty,
      telegramHandle: user.telegramHandle,
      year: user.year,
      profilePhoto: profilePhoto,
      thumbnailPhoto: thumbnailPhoto,
    };
    console.log(updatedUser);
    //TODO: Make api call with updated user object
  };
  return uploadImage(image, user.id, callback);
}
