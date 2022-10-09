import { httpsCallable } from "firebase/functions";
import { firestoreFunctions } from "../firebase";
import { ApiRequestBody, ApiResponseBody, AppliedRequestStatus } from "./types";

export async function createAppliedRequest(postId: string) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<string>>(
    firestoreFunctions,
    "createPostApplication"
  );
  const result = await callApi({ postId });
  return result.data;
}

export async function deleteAppliedRequest(postId: string) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<string>>(
    firestoreFunctions,
    "deletePostApplication"
  );
  const result = await callApi({ postId });
  return result.data;
}

export async function responseAppliedRequest(
  postId: string,
  applicantUserId: string,
  responseStatus: AppliedRequestStatus
) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<string>>(
    firestoreFunctions,
    "responsePostApplication"
  );
  const result = await callApi({
    postId,
    userId: applicantUserId,
    responseStatus,
  });
  return result.data;
}
