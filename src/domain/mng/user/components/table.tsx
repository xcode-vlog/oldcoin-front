import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef, Table as TanstackTable } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { confirmUser, UserTableInfo } from "..";

import { Label } from "@/components/ui/label";
import { phoneFormat } from "@/lib/commonUtils";

export const UserColumn: ColumnDef<UserTableInfo>[] = [
  {
    accessorKey: "userId",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            className="rounded-full"
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            아이디
          </Button>
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("userId")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            className="rounded-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            이름
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">{`${row.getValue(
          "name"
        )}(${row.original["nickName"]})`}</div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            className="rounded-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            email
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "hpNumber",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            className="rounded-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            핸드폰번호
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {phoneFormat(row.getValue("hpNumber"))}
      </div>
    ),
  },
  {
    accessorKey: "confirm",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            className="rounded-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            승인상태
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("confirm") == "Y" ? (
          <span className="text-blue-500">승인완료</span>
        ) : (
          <span className="text-red-500">승인대기</span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {row.getValue("confirm") != "Y" ? (
              <DropdownMenuItem
                onClick={() => {
                  confirmUser(row);
                }}
              >
                승인
              </DropdownMenuItem>
            ) : (
              <></>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TableExtention({
  table,
}: {
  table: TanstackTable<UserTableInfo>;
}) {
  return (
    <div className="flex items-center py-4">
      <div className="flex items-center w-20 pl-3">
        <Label htmlFor="input_filter" className="text-gray-500">
          검색
        </Label>
      </div>

      <Input
        id="input_filter"
        placeholder="검색어를 입력해주세요."
        onChange={(event) => {
          table.setGlobalFilter(event.target.value);
        }}
        className="max-w-sm"
      />
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}
