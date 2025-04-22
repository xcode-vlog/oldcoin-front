"use client";

import { PageTitle } from "@/components/custom/element/PageTitle";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { axiosClient, ResponseModel, successCode } from "@/lib/axiosClient";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  CommonTableContent,
  CommonTablePaginationButton,
} from "@/components/custom/element/TableContent";
import { ProductColumn } from "./components/table";

export type ProductTableInfo = {
  productId: string;
  productTitle: string;
  startPrice: number;
  endPrice: number;
};

function ProductClient() {
  const router = useRouter();

  const [data, setData] = useState<ProductTableInfo[]>([]);

  const table = useReactTable({
    columns: ProductColumn,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 15, //custom default page size
      },
    },
  });

  const getProductList = useCallback(async () => {
    const URL = "/product/product-list";
    const res = await axiosClient.get<ResponseModel<ProductTableInfo[]>>(URL);

    const { code, data, message } = res.data;

    if (code != successCode) {
      alert(message);
      return;
    }
    setData(data);

    table.reset();
  }, [table.reset]);

  useEffect(() => {
    getProductList();
  }, [getProductList]);

  const handleOnRowClick = (rowData: ProductTableInfo) => {
    // todo
    const URL = `/mng/product/${rowData.productId}`;
    router.push(URL);
  };

  return (
    <section>
      <PageTitle title="아이템 목록" />
      <CommonTableContent
        columns={ProductColumn}
        table={table}
        onHandleOnRowClick={handleOnRowClick}
      />
      <CommonTablePaginationButton table={table} />
    </section>
  );
}

export { ProductClient };
