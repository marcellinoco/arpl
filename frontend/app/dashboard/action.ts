"use server";

import { cookies } from "next/headers";

import { EmailMessage, History } from "@/models/model";
import { serverAxios } from "@/utils/axios";

export async function getHistory(): Promise<{ emails: History[] }> {
  "use server";
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const { data } = await serverAxios.post<{ emails: History[] }>(
      "/api/emails",
      { maxResults: 5, pageToken: "" },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!data.emails) return { emails: [] };

    const emails = data.emails.map((email) => {
      return { ...email, from: email.from.split(" <")[0] };
    });

    data.emails = emails;
    return data;
  } catch (error) {
    console.error("Error in getHistory:", error);
    throw error;
  }
}

export async function getChatsDetails(
  threadId: string
): Promise<{ messages: EmailMessage[] }> {
  "use server";
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const { data } = await serverAxios.post<{ messages: EmailMessage[] }>(
      "/api/emails/threads",
      { threadId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const emails = data.messages.map((message) => {
      return { ...message, from: message.from.split(" <")[0] };
    });

    data.messages = emails;
    return data;
  } catch (error) {
    console.error("Error in getChatsDetails:", error);
    throw error;
  }
}
