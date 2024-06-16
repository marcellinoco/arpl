import { serverAxios } from "@/utils/axios";

export async function isOnboarded(
  token: string
): Promise<boolean> {
  "use server";
  try {
    const { data } = await serverAxios.post<boolean>("/api/emails", { token });

    cookies().set("accessToken", data.accessToken);
    return data;
  } catch (error) {
    throw error;
  }
}
