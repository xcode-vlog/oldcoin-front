"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PreSpacedFormMessage } from "@/components/custom/element/CustomFormMessage";
import { PageTitle } from "@/components/custom/element/PageTitle";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosClient, ResponseModel, successCode } from "@/lib/axiosClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import fireStorage, { downloadUrl } from "@/firebase/fireStorage";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as UUID } from "uuid";
import Image from "next/image";
import { NoImage } from "@/components/custom/element/NoImage";

const productSchema = z
  .object({
    productTitle: z.string().min(1, { message: "상품명은 필수 입력입니다." }),
    startPrice: z.coerce
      .number({
        required_error: "시작가는 필수 입력입니다.",
        invalid_type_error: "숫자만 입력 가능합니다.",
      })
      .positive({ message: "0원 보다 큰 금액을 입력해주세요" })
      .min(1_000, { message: "최소금액은 1,000원 이상입니다." }),
    endPrice: z.coerce
      .number({
        required_error: "종료가는 필수 입력입니다.",
        invalid_type_error: "숫자만 입력 가능합니다.",
      })
      .positive({ message: "0원 보다 큰 금액을 입력해주세요" })
      .max(900_000_000, { message: "금액을 확인하세요." }),
    imageUrl: z.string(),
  })
  .refine((data) => data.startPrice < data.endPrice, {
    path: ["endPrice"],
    message: "최종금액은 시작 금액보다 커야합니다.",
  });

export type ProductFormType = z.infer<typeof productSchema>;

const initialValue = {
  productTitle: "",
  imageUrl: "",
  startPrice: 0,
  endPrice: 0,
};

interface Props {
  productId: string;
}

function ProductRegistClient({ productId }: Props) {
  const router = useRouter();

  const imageUrlRef = useRef<HTMLInputElement>(null);

  const [isBlock, setIsBlock] = useState(false);
  const [sharedImageUrl, setSharedImageUrl] = useState<string | null>(null);
  const isCreate = productId == "create";

  const form = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValue,
  });

  const setImageUrl = async (imageUrl: string) => {
    const url = await downloadUrl(imageUrl);

    setSharedImageUrl(url);
  };

  const getProductInfo = useCallback(async () => {
    const URL = `/product/product-info/${productId}`;
    const res = await axiosClient.get<ResponseModel<ProductFormType>>(URL);

    const { code, data, message } = res.data;
    if (code != successCode) {
      setIsBlock(true);
      alert(message);
      return null;
    }

    if (!data) {
      setIsBlock(true);
      alert("잘못된 접근입니다.");
      return;
    }
    if (data.imageUrl) {
      setImageUrl(data.imageUrl);
    }

    form.reset(data);
  }, [form.reset]);

  useEffect(() => {
    if (!isCreate) getProductInfo();
  }, [getProductInfo]);

  const handleOnSubmit = async (formData: any) => {
    const URL = isCreate
      ? "/product/create-product"
      : "/product/update-product";

    const data = isCreate
      ? { ...formData }
      : {
          productId,
          ...formData,
        };
    const res = await axiosClient.post(URL, data);

    const { code, message } = res.data;

    if (code != successCode) {
      alert(message);
      return;
    }

    window.location.reload();
  };

  const handleUploadImage = async (
    e: React.ChangeEvent<{ files: FileList | null }>
  ) => {
    const files = e.target.files;
    if (files == null) {
      return;
    }

    if (files && files.length > 0) {
      const file = files[0];

      const ext = file.name.split(".").pop();
      const uploadFileName = UUID();

      const imagePath = `product-images/${uploadFileName}${
        ext ? `.${ext}` : ""
      }`;

      const imageRef = ref(fireStorage, imagePath);

      const result = await uploadBytes(imageRef, file);

      const fullPath = result.metadata.fullPath;
      form.setValue("imageUrl", fullPath);

      if (productId) {
        form.handleSubmit(handleOnSubmit)();
      } else {
        const url = await downloadUrl(fullPath);
        setSharedImageUrl(url);
      }
    }
  };

  const handleOnCreateLink = async () => {
    const URL = `/auction/create`;
    const postData = {
      productId,
    };
    const res = await axiosClient.post<ResponseModel<null>>(URL, postData);
    const { code, message } = res.data;
    if (code != successCode) {
      alert(message);
      return;
    }

    alert("링크가 생성되었습니다.");
  };
  return (
    <div className="w-full">
      <PageTitle title={`아이템 ${isCreate ? "생성" : "수정"}`}>
        <Button
          variant={"secondary"}
          onClick={() => router.replace("/mng/product")}
        >
          목록으로
        </Button>
      </PageTitle>

      <div className="flex flex-col">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <section className="mb-5">
              <FormField
                name="productTitle"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="flex">
                      <Label htmlFor="productName" className="w-[120px]">
                        상품명
                      </Label>
                      <FormControl>
                        <Input id={field.name} {...field} />
                      </FormControl>
                    </div>
                    <PreSpacedFormMessage className="pl-[120px]" />
                  </FormItem>
                )}
              />
            </section>
            <section className="mb-5">
              <div className="flex gap-5">
                <div
                  className="inline-block box-border w-[276px] h-[211px] border rounded-2xl"
                  onClick={() => {
                    imageUrlRef.current?.click();
                  }}
                >
                  {/* iamge */}
                  <FormField
                    name="imageUrl"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex">
                          {sharedImageUrl ? (
                            <div className="relative w-[276px] h-[211px] overflow-hidden box-border">
                              <Image
                                src={sharedImageUrl}
                                alt="product image"
                                fill
                                className="object-scale-down"
                                // loading="lazy"
                              />

                              <Input
                                id={field.name}
                                className="hidden"
                                {...field}
                              />
                            </div>
                          ) : (
                            <div className="relative w-[276px] h-[211px] overflow-hidden box-border flex">
                              <NoImage />
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="inline-block">
                  <div className="flex flex-col justify-center space-y-5 w-full">
                    {/* 가격 */}
                    <FormField
                      name="startPrice"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <div className="flex">
                            <div className="flex items-center">
                              <Label
                                htmlFor="startPrice"
                                className="block w-[100px]"
                              >
                                시작가
                              </Label>
                            </div>
                            <div className="flex items-center w-full">
                              <FormControl>
                                <Input
                                  id={field.name}
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );

                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <PreSpacedFormMessage className="w-[150px] pl-5" />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="endPrice"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <div className="flex">
                            <div className="flex items-center">
                              <Label htmlFor="endPrice" className="w-[100px]">
                                종료가
                              </Label>
                            </div>

                            <div className="flex items-center w-full">
                              <FormControl>
                                <Input
                                  id={field.name}
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );

                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <PreSpacedFormMessage className="w-[150px] pl-5" />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </section>
          </form>
        </FormProvider>
        <section>
          {/* 버튼 */}
          <div className="flex flex-col w-[276px] gap-5">
            <div className="flex justify-center gap-5">
              {isCreate ? (
                <Button
                  className="w-full"
                  onClick={form.handleSubmit(handleOnSubmit)}
                  disabled={isBlock}
                >
                  등록
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={form.handleSubmit(handleOnSubmit)}
                  disabled={isBlock}
                >
                  수정
                </Button>
              )}
            </div>
            {!isCreate && (
              <div>
                <Button
                  variant={"secondary"}
                  className="w-full"
                  disabled={isBlock}
                  onClick={() => handleOnCreateLink()}
                >
                  링크생성
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Input
        ref={imageUrlRef}
        type="file"
        className="hidden"
        onChange={handleUploadImage}
      />
    </div>
  );
}

export { ProductRegistClient };
