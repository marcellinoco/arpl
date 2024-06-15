"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

import { User } from "@/models/model";
import useAuthStore from "@/store/useAuthStore";

import { google } from "@/app/auth/action";
import { useGoogleLogin } from "@react-oauth/google";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ImWhatsapp } from "react-icons/im";
import GoogleLogo from "./google-logo";

const SignIn: FC = () => {
  const router = useRouter();

  const { setAccessToken, setUser } = useAuthStore();

  const [isLoading, setLoading] = useState(false);
  const signInWithGoogleHandler = useGoogleLogin({
    flow: "implicit",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    onError: () => setLoading(false),
    onSuccess: async ({ access_token }) => {
      try {
        const { accessToken, user } = await google(access_token);
        onSuccess(user, accessToken);
      } catch {}
    },
  });

  const onSuccess = (user: User, accessToken: string) => {
    setAccessToken(accessToken);
    setUser({
      name: user.name,
      id: user.uid,
      email: user.email,
      image: user.avatar,
    });

    router.push("/onboard");
  };

  if (isLoading) {
    return <AiOutlineLoading3Quarters className="animate-spin" />;
  }

  return (
    <Card className="p-5">
      <CardHeader>
        <div className="flex flex-col space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            AutoRepl.ai
          </CardTitle>

          <CardDescription className="text-sm text-muted-foreground">
            Seamless customer experience with AI
          </CardDescription>
        </div>
      </CardHeader>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="grid gap-3">
          <Button
            className="flex items-center justify-center transition hover:scale-105"
            variant="outline"
            onClick={() => {
              setLoading(true);
              signInWithGoogleHandler();
            }}
          >
            <GoogleLogo className="mr-2 h-4 w-4" />
            Connect with Gmail
          </Button>
          <Button
            className="flex items-center justify-center transition hover:scale-105"
            variant="outline"
            onClick={() => {
              setLoading(true);
              signInWithGoogleHandler();
            }}
          >
            <ImWhatsapp color="green" className="mr-2 h-4 w-4" />
            Connect with WhatsApp
          </Button>
        </div>
      </div>
    </Card>
  );
};

SignIn.displayName = "Sign In";
export default SignIn;
