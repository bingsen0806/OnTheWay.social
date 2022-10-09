/**
 * TODO: add firebase functions here for api calls
 */

import { httpsCallable } from "firebase/functions";
import { firestoreFunctions } from "../firebase";
import {
  ApiRequestBody,
  ApiResponseBody,
  AppliedRequest,
  CreatedRequest,
} from "./types";

export async function getAppliedRequests(page: number) {
  const callApi = httpsCallable<
    ApiRequestBody,
    ApiResponseBody<AppliedRequest[]>
  >(firestoreFunctions, "getAppliedPosts");
  const result = await callApi({ page });
  return result.data;
}

export async function getCreatedRequests(page: number) {
  const callApi = httpsCallable<
    ApiRequestBody,
    ApiResponseBody<CreatedRequest[]>
  >(firestoreFunctions, "getCreatedPosts");
  const result = await callApi({ page });
  return result.data;
}

export async function cancelRequest(postId: string) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<string>>(
    firestoreFunctions,
    "deletePost"
  );
  const result = await callApi({ postId });
  return result.data;
}
