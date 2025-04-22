"use client";

import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useLoginStatePersist } from "@/store/loginStorePersist";
import { Button } from "@/components/ui/button";
import { axiosClient, ResponseModel, successCode } from "@/lib/axiosClient";
import { useRouter } from "next/navigation";

function TopHeader() {
  const { isLogin, loginInfo, logout } = useLoginStatePersist();

  const router = useRouter();

  const handleLogout = async () => {
    const URL = "/user/logout";
    const { data } = await axiosClient.get<ResponseModel<null>>(URL);
    if (data.code != successCode) {
      alert(data.message);
      return;
    }

    logout();

    router.replace("/");
  };
  return (
    <div className="flex justify-center w-full border-b border-gray-200 px-5">
      <div className="flex justify-between items-center w-full h-[52px] max-w-[var(--max-width-container)]">
        <div className="relative h-[32px] w-[80px]">
          <Link href={"/"}>
            <Image src={"/images/planICT_fff.png"} fill alt={"logo"} />
          </Link>
        </div>
        <ul className="flex justify-end gap-5 items-center">
          {isLogin ? (
            <>
              <li>{`${loginInfo?.name}(${loginInfo?.nickName})`}</li>
              <li>
                <Button onClick={handleLogout}>로그아웃</Button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">
                <Label className="px-[12px] py-[12px]">로그인</Label>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function GnbHeader() {
  const { role } = useLoginStatePersist();

  return (
    <div className="flex justify-center w-full border-b border-gray-200">
      <div className="flex justify-between items-center w-full h-[56px] max-w-[var(--max-width-container)]">
        <div>
          <ul className="flex gap-8 text-xl font-bold">
            <li>경매상품</li>
            <li>진행중 경매</li>
          </ul>
        </div>
        {role != "ROLE_ADMIN" ? (
          <></>
        ) : (
          <div>
            <ul className="flex gap-5 font-bold">
              <Link href={"/mng/product"}>
                <li>상품관리</li>
              </Link>
              <Link href={"/mng/auction"}>
                <li>경매진행상황</li>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export { TopHeader, GnbHeader };
