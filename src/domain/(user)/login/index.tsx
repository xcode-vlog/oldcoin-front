"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useRef } from "react";
import { PreSpacedFormMessage } from "@/components/custom/element/CustomFormMessage";
import { axiosClient, ResponseModel, successCode } from "@/lib/axiosClient";
import { LoginInfo, useLoginStatePersist } from "@/store/loginStorePersist";

const loginSchema = z.object({
  userId: z.string().min(1, { message: "ID는 필수 입력입니다." }),
  password: z.string().min(1, { message: "비밀번호는 필수 입력입니다." }),
});

type loginFormData = z.infer<typeof loginSchema>;

function LoginClient() {
  const clickCount = useRef(0);

  const { login } = useLoginStatePersist();
  const router = useRouter();
  const form = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const handleOnClickCount = async () => {
    clickCount.current++;

    setTimeout(() => {
      clickCount.current = 0;
    }, 5000);

    if (clickCount.current == 5) {
      router.replace("/adminLogin");
    }
  };

  const handleOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      form.handleSubmit(handleOnSubmit)();
    }
  };

  const handleOnSubmit = async (formData: loginFormData) => {
    const URL = "/user/login";

    const reqData = {
      ...formData,
      userRole: "ADMIN",
    };
    const { data } = await axiosClient.post<ResponseModel<LoginInfo>>(
      URL,
      reqData
    );

    if (data.code != successCode) {
      alert(data.message);
      return;
    }

    login(data.data);
    if (data.data.userRole == "ROLE_ADMIN") {
      router.replace("/mng");
      return;
    } else {
      router.replace("/");
    }
  };

  const handleSignup = () => {
    router.push("/signup");
  };
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>
            <div onClick={handleOnClickCount}>로그인</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleOnSubmit)}
            >
              <FormField
                name="userId"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label htmlFor="userId">userId</Label>
                    <FormControl>
                      <Input id="userId" {...field} />
                    </FormControl>
                    <PreSpacedFormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label htmlFor="password">비밀번호</Label>
                    <FormControl>
                      <Input
                        id="password"
                        {...field}
                        onKeyDown={handleOnEnter}
                      />
                    </FormControl>
                    <PreSpacedFormMessage />
                  </FormItem>
                )}
              />
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-end gap-5">
          <Button onClick={handleSignup} variant={"outline"}>
            회원가입
          </Button>
          <Button type="submit" onClick={form.handleSubmit(handleOnSubmit)}>
            로그인
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export { LoginClient };
