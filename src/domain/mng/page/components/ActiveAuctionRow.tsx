"use client";

import { Button } from "@/components/ui/button";
import { AuctionInfo } from "..";
import { useEffect, useState } from "react";
import { numberWithCommas } from "@/lib/commonUtils";
import { axiosClient, ResponseModel, successCode } from "@/lib/axiosClient";

interface Props {
  auction: AuctionInfo;
  handleInactive: (auctionId: number) => void;
  handleCloseAuction: (auctionKey: string) => void;
}

function ActiveAuctionRow({
  auction,
  handleInactive,
  handleCloseAuction,
}: Props) {
  const [contextOrigin, setContextOrigin] = useState<string>("");
  const { auctionKey, status, productInfo, isStart } = auction;

  const handleUpdateBid = async (auctionKey: string, openState: string) => {
    const URL = `/auction/bid-${openState}/${auctionKey}`;

    const res = await axiosClient.put<ResponseModel<null>>(URL);
    const { code, message } = res.data;

    if (code != successCode) {
      alert(message);
      return;
    }
    if (openState == "close") {
      handleCloseAuction(auctionKey);
    }
    const successMessage =
      openState == "open" ? "응찰이 시작되었습니다." : "응찰이 종료되었습니다.";
    alert(successMessage);

    window.location.reload();
  };

  useEffect(() => {
    setContextOrigin(window.location.origin);
  });
  return (
    <div className="flex justify-between">
      <div className="flex-1 min-w-[120px] overflow-auto">
        <p className="truncate">{productInfo.productTitle}</p>
        <p className="truncate">{`${contextOrigin}/auction/${auctionKey}`}</p>
      </div>
      <div className="mx-5 min-w-[120px] overflow-auto">
        <p className="truncate">
          시작가: {numberWithCommas(productInfo.startPrice)}
        </p>
        <p className="truncate">
          종료가: {numberWithCommas(productInfo.endPrice)}
        </p>
      </div>
      <div className="flex items-center">
        <div className="flex gap-2">
          <Button
            variant={"secondary"}
            className="bg-amber-400 hover:bg-amber-300 "
          >
            카운트다운
          </Button>
          {isStart == "Y" ? (
            <Button
              variant={"destructive"}
              onClick={() => handleUpdateBid(auctionKey, "close")}
            >
              응찰중지
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              onClick={() => handleUpdateBid(auctionKey, "open")}
            >
              응찰시작
            </Button>
          )}

          <Button onClick={() => handleInactive(auction.auctionId)}>
            비활성화
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ActiveAuctionRow };
