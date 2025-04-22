import { Button } from "@/components/ui/button";
import { AuctionInfo } from "..";
import { useEffect, useState } from "react";
import { numberWithCommas } from "@/lib/commonUtils";

interface Props {
  auction: AuctionInfo;
}

function InactiveAuctionRow({ auction }: Props) {
  const [contextOrigin, setContextOrigin] = useState<string>("");
  const { auctionKey, productInfo } = auction;

  useEffect(() => {
    setContextOrigin(window.location.origin);
  });
  return (
    <div className="flex justify-between">
      <div className="flex-1 min-w-[120px]">
        <p className="truncate">{productInfo.productTitle}</p>
        <p className="truncate">{`${contextOrigin}/auction/${auctionKey}`}</p>
      </div>
      <div className="mx-5 min-w-[120px]">
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
            상세
          </Button>
        </div>
      </div>
    </div>
  );
}

export { InactiveAuctionRow };
