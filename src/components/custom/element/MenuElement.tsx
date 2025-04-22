import { cn } from "@/lib/utils";
import { useMenuStore } from "@/store/menuStore";

import { useRouter } from "next/navigation";

export type GroupMenuType = {
  groupId: string;
  displayName: string;
  subMenu?: SubMenuType[];
};
type SubMenuType = {
  menuId: string;
  displayName: string;
  url: string;
};

interface MenuGroupProps {
  menus: GroupMenuType[];
}

function MenuGroup({ menus }: MenuGroupProps) {
  const { selectedSubMenu } = useMenuStore();

  return (
    menus &&
    menus.map((group) => {
      return (
        <GroupMenu
          key={group.groupId}
          groupMenu={group}
          selectedSubMenu={selectedSubMenu}
        />
      );
    })
  );
}

interface GroupMenuProps {
  groupMenu: GroupMenuType;
  selectedSubMenu: string;
}
function GroupMenu({ groupMenu, selectedSubMenu }: GroupMenuProps) {
  const { groupId, displayName, subMenu } = groupMenu;

  const { appendShowGroup, removeShowGroup, showGroupList } = useMenuStore();

  const handleShowGroupMenu = (menuId: string) => {
    const isShow = showGroupList.includes(menuId);

    if (isShow) {
      removeShowGroup(menuId);
    } else {
      appendShowGroup(menuId);
    }
  };

  let isIncludeSelectedSubMenu = false;
  if (
    groupMenu.subMenu &&
    groupMenu.subMenu.findIndex((d) => d.menuId == selectedSubMenu) > -1
  ) {
    isIncludeSelectedSubMenu = true;
  }
  return (
    <li>
      <span onClick={() => handleShowGroupMenu(groupId)}>{displayName}</span>
      <ul className="pl-5">
        {subMenu &&
          subMenu.map((menu) => {
            const isShow = showGroupList.includes(groupMenu.groupId);
            const isSelected = menu.menuId == selectedSubMenu;
            return (
              (isShow || isIncludeSelectedSubMenu) && (
                <SubMenu
                  key={menu.menuId}
                  subMenuData={menu}
                  isSelected={isSelected}
                />
              )
            );
          })}
      </ul>
    </li>
  );
}

interface SubMenuProps {
  subMenuData: SubMenuType;
  isSelected: boolean;
}

function SubMenu({ subMenuData, isSelected }: SubMenuProps) {
  const router = useRouter();
  const { menuId, displayName, url } = subMenuData;

  const { setSelectedSubMenu } = useMenuStore();

  return (
    <li
      onClick={() => {
        setSelectedSubMenu(menuId);
        router.push(url);
      }}
    >
      <span className={cn("", isSelected && "font-bold")}>{displayName}</span>
    </li>
  );
}

export { MenuGroup };
