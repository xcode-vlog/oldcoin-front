"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosClient, ResponseModel, successCode } from "@/lib/axiosClient";
import { LoginInfo, useLoginStatePersist } from "@/store/loginStorePersist";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const signupSchema = z.object({
  userId: z.string().min(1, { message: "ID는 필수 입력입니다." }),
  password: z.string().min(1, { message: "비밀번호는 필수 입력입니다." }),
  name: z.string().min(1, { message: "이름은 필수 입력입니다." }),
  nickName: z.string().min(1, { message: "별명은 필수 입력입니다." }),
  email: z.string().min(1, { message: "이메일은 필수 입력입니다." }),
  hpNumber: z.string().min(1, { message: "핸드폰번호는 필수 입력입니다." }),
});

type SignupFormData = z.infer<typeof signupSchema>;

function AdminSignupClient() {
  const { login } = useLoginStatePersist();
  const router = useRouter();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userId: "",
      password: "",
      name: "",
      nickName: "",
      email: "",
      hpNumber: "",
    },
  });
  const handleOnSubmit = async (formData: SignupFormData) => {
    const URL = "/user/signup";

    const reqData = {
      ...formData,
      userRole: "ADMIN",
      confirm: "Y",
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
    router.replace("/");
  };
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>관리자회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleOnSubmit)}
            >
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label htmlFor={field.name}>아이디</Label>
                    <Input id={field.name} {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label htmlFor={field.name}>비밀번호</Label>
                    <Input id={field.name} {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1 w-full">
                      <Label htmlFor={field.name}>이름</Label>
                      <Input id={field.name} {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nickName"
                  render={({ field }) => (
                    <FormItem className="space-y-1 w-full">
                      <Label htmlFor={field.name}>별명</Label>
                      <Input id={field.name} {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label htmlFor={field.name}>이메일</Label>
                    <Input id={field.name} {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hpNumber"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label htmlFor={field.name}>핸드폰번호</Label>
                    <Input id={field.name} {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-end gap-5">
          <Button onClick={form.handleSubmit(handleOnSubmit)}>회원가입</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export { AdminSignupClient };
