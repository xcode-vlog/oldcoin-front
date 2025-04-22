"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import {
  Row,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { axiosClient, ResponseModel, successCode } from "@/lib/axiosClient";

import { PageTitle } from "@/components/custom/element/PageTitle";
import { TableExtention, UserColumn } from "./components/table";
import { CommonTableContent } from "@/components/custom/element/TableContent";

export type UserTableInfo = {
  userSeq: string | number;
  userId: string;
  name: string;
  nickName: string;
  email: string;
  hpNumber: string;
  confirm: string;
};

async function getUserInfo(setter: (data: UserTableInfo[]) => void) {
  const URL = "/user/user-list";
  const res = await axiosClient.get<ResponseModel<UserTableInfo[]>>(URL);

  const { code, data, message } = res.data;
  if (code != successCode) {
    alert(message);
    return;
  }

  if (data) {
    setter([]);
  }
  setter(data);
}

export async function confirmUser(row: Row<UserTableInfo>) {
  const URL = "/user/user-confirm";
  const res = await axiosClient.put<ResponseModel<any>>(URL, {
    userId: row.original.userId,
    confirm: "Y",
  });

  const { code, message } = res.data;

  if (code != successCode) {
    alert(message);
    return;
  }
  window.location.reload();
}

export function UserClient() {
  const [data, setData] = React.useState<UserTableInfo[]>([]);

  React.useEffect(() => {
    getUserInfo(setData);
  }, []);

  const table = useReactTable({
    data: data,
    columns: UserColumn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="w-full">
      <PageTitle title="회원 정보 관리" />
      <TableExtention table={table} />
      <CommonTableContent table={table} columns={UserColumn} />
    </div>
  );
}
