"use client";

import {
  GroupMenuType,
  MenuGroup,
} from "@/components/custom/element/MenuElement";
import { MainContent } from "@/components/custom/wrapper/MainContent";
import { SideMenu } from "@/components/custom/wrapper/SideMenu";

function SideMenuWithContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: GroupMenuType[] = [
    {
      groupId: "group_1",
      displayName: "회원관리 섹션",
      subMenu: [
        {
          menuId: "sub_1",
          displayName: "회원 목록",
          url: "/mng/user",
        },
      ],
    },
    {
      groupId: "group_2",
      displayName: "아이템관리 섹션",
      subMenu: [
        {
          menuId: "sub_2_1",
          displayName: "아이템 목록",
          url: "/mng/product",
        },
        {
          menuId: "sub_2_2",
          displayName: "아이템 생성",
          url: "/mng/product/create",
        },
      ],
    },
    {
      groupId: "group_3",
      displayName: "페이지제어 섹션",
      subMenu: [
        {
          menuId: "sub_3",
          displayName: "페이지 관리",
          url: "/mng/page",
        },
      ],
    },
  ];

  return (
    <div className="relative flex justify-between h-full w-full gap-3">
      <SideMenu>
        <ul className="space-x-3">
          <MenuGroup menus={menus} />
        </ul>
      </SideMenu>
      <MainContent>{children}</MainContent>
    </div>
  );
}

export default SideMenuWithContentLayout;
