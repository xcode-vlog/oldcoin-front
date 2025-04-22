"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActiveAuctionRow } from "./components/ActiveAuctionRow";
import { axiosClient, ResponseModel, successCode } from "@/lib/axiosClient";
import { InactiveAuctionRow } from "./components/InactiveAuctionRow";
import { useStompClient } from "@/lib/stompClient";
import * as StompJs from "@stomp/stompjs";

type ProductInfo = {
  productId: string;
  productTitle: string;
  startPrice: number;
  endPrice: number;
  imageUrl: string;
};

export type AuctionInfo = {
  auctionId: number;
  auctionKey: string;
  productId: number;
  status: string;
  productInfo: ProductInfo;
  isStart: string;
  startTime: Date;
  endTime: Date;
};

function MngChatClient() {
  const { stompClient } = useStompClient();
  const client = useRef<StompJs.Client>(stompClient);

  const [auctionList, setAuctionList] = useState<AuctionInfo[]>([]);
  const [tabValue, setTabValue] = useState("active");

  const getAuctionList = useCallback(async () => {
    const URL = `/auction/${tabValue}`;
    const res = await axiosClient.get<ResponseModel<AuctionInfo[]>>(URL);
    const { code, data, message } = res.data;
    if (code != successCode) {
      alert(message);
      return null;
    }

    setAuctionList(data);
  }, [tabValue]);

  const handleOnInactive = useCallback(async (auctionId: number) => {
    const URL = `/auction/action-inactive/${auctionId}`;

    const res = await axiosClient.delete<ResponseModel<null>>(URL);
    const { code, message } = res.data;
    if (code != successCode) {
      alert(message);
      return null;
    }
    getAuctionList();
  }, []);

  const handleOnCloseAuction = (auctionKey: string) => {
    client.current.publish({
      destination: `/pub/auction/${auctionKey}`,
      body: JSON.stringify({
        auctionMessageType: "BID_CLOSE",
        message: "close",
      }),
    });
  };

  useEffect(() => {
    getAuctionList();
  }, [getAuctionList]);

  useEffect(() => {
    client.current.activate();

    return () => {
      client.current.deactivate();
    };
  }, []);

  return (
    <section className="h-full">
      <Tabs
        className="h-full"
        value={tabValue}
        onValueChange={(value) => setTabValue(value)}
      >
        <TabsList>
          <TabsTrigger value="active">진행전/진행중</TabsTrigger>
          <TabsTrigger value="inactive">종료</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="p-1">
          <section className="flex flex-col w-full h-full space-y-5  overflow-scroll">
            {auctionList &&
              auctionList.map((auction) => (
                <ActiveAuctionRow
                  key={auction.auctionId}
                  auction={auction}
                  handleInactive={handleOnInactive}
                  handleCloseAuction={handleOnCloseAuction}
                />
              ))}
          </section>
        </TabsContent>
        <TabsContent value="inactive" className="p-[3px]">
          <section className="flex flex-col w-full h-full space-y-5 overflow-scroll">
            {auctionList &&
              auctionList.map((auction) => (
                <InactiveAuctionRow key={auction.auctionId} auction={auction} />
              ))}
          </section>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export { MngChatClient };
