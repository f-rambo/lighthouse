"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { UserService } from "@/services/user/v1alpha1/user";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { MailboxIcon, KeyIcon } from "@/components/icon";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const userCookieMaxAge = 1;
  const tokenCookieMaxAge = 2;
  const { toast } = useToast();

  const redirect = useCallback(() => {
    if (router.back() !== undefined) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const data = Cookies.get(process.env.NEXT_PUBLIC_USER ?? "ocean-user");
    if (data) {
      redirect();
      return;
    }
  }, [redirect]);

  const signIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    UserService.signIn(email, password).then((user) => {
      if (user instanceof Error) {
        toast({
          variant: "destructive",
          title: "login failed",
          description: user.message,
        });
        return;
      }
      Cookies.set(
        process.env.NEXT_PUBLIC_USER ?? "ocean-user",
        JSON.stringify(user),
        { expires: userCookieMaxAge }
      );
      Cookies.set(process.env.NEXT_PUBLIC_TOKEN ?? "ocean-token", user.token, {
        expires: tokenCookieMaxAge,
      });
      if (router.back() !== undefined) {
        router.back();
      } else {
        router.push("/");
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={signIn}>
            <div className="relative space-y-2">
              <div className="flex items-center">
                <Label htmlFor="email">Email</Label>
                <MailboxIcon className="ml-auto h-5 w-5" />
              </div>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <KeyIcon className="ml-auto h-5 w-5" />
              </div>
              <Input
                id="password"
                required
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
