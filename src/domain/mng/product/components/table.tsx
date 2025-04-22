import { ColumnDef } from "@tanstack/react-table";
import { ProductTableInfo } from "..";
import { Button } from "@/components/ui/button";
import { numberWithCommas } from "@/lib/commonUtils";
import Image from "next/image";
import { NoImage } from "@/components/custom/element/NoImage";



export const ProductColumn: ColumnDef<ProductTableInfo>[] = [
  {
    accessorKey: "productId",
    size: 80,
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
            상품번호
          </Button>
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("productId")}
      </div>
    ),
  },
  {
    accessorKey: "imageUrl",
    size: 50,
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            className="rounded-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            이미지
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <div className="relative overflow-hidden w-[27px] h-[27px]">
            {row.getValue("imageUrl") != "" ? (
              <Image
                src={`https://firebasestorage.googleapis.com/v0/b/oldcoin-auction.firebasestorage.app/o/${(
                  row.getValue("imageUrl") as string
                ).replace("/", "%2F")}?alt=media`}
                className="object-conain"
                fill
                alt="product image"
                loading="lazy"
              />
            ) : (
              <div className="flex w-[27px] h-[27px] rounded-2xl box-border">
                <NoImage />
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "productTitle",
    size: 250,
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            className="rounded-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            상품이름
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          {row.getValue("productTitle")}
        </div>
      );
    },
  },
  {
    accessorKey: "startPrice",
    size: 80,
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            className="rounded-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            시작가
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {numberWithCommas(row.getValue("startPrice"))}
      </div>
    ),
  },
  {
    accessorKey: "endPrice",
    size: 80,
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            className="rounded-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            종료가
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {numberWithCommas(row.getValue("endPrice"))}
      </div>
    ),
  },
];
