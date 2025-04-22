"use client";

import { NoImage } from "@/components/custom/element/NoImage";
import { PageTitle } from "@/components/custom/element/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuctionInfo } from "@/domain/mng/page";
import { downloadUrl } from "@/firebase/fireStorage";
import { axiosClient, ResponseModel, successCode } from "@/lib/axiosClient";
import { numberWithCommas } from "@/lib/commonUtils";
import Image from "next/image";
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import { Badge } from "@/components/ui/badge";
import { useStompClient } from "@/lib/stompClient";

interface Props {
  auctionKey: string;
}
type AuctionMessageType =
  | "BID_MAX"
  | "BID"
  | "BID_CLOSE"
  | "ENTER"
  | "LEAVE"
  | "BID_SUCCESS"
  | "BID_FAIL";
type BidMessageType = {
  message: string;
  auctionMessageType: AuctionMessageType;
};
type ReceiveMessage = {
  senderId: string;
  senderName: string;
  auctionKey: string;
  auctionMessageType: AuctionMessageType;
  auctionPrice: string;
  priority: number;
  award: string;
  memberList: AuctionMember[];
  messageId: number;
};
type AuctionMember = {
  auctionKey: string;
  userId: string;
  nickName: string;
};

function AuctionClient({ auctionKey }: Props) {
  const { stompClient } = useStompClient();
  const client = useRef<StompJs.Client>(stompClient);

  const scrollableRef = useRef<HTMLDivElement>(null);

  const [auctionInfo, setAuctionInfo] = useState<AuctionInfo>();
  const [sharedImageUrl, setSharedImageUrl] = useState<string>();
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [bidList, setBidList] = useState<ReceiveMessage[]>([]);
  const [members, setMembers] = useState<AuctionMember[]>([]);

  const [endAuction, setEndAuction] = useState<boolean>(false);

  client.current.onConnect = (frame: StompJs.IFrame) => {
    console.log("stomp connect");
    console.log(frame);

    stompSubscribe();
  };
  const stompConnect = () => {
    client.current.activate();
  };

  const stompDisconnect = () => {
    client.current.deactivate();
  };

  const stompSubscribe = () => {
    console.log("subscribe: " + `/sub/auction/${auctionKey}`);

    if (subscription) {
      subscription.unsubscribe();
    }

    client.current.subscribe(
      `/sub/auction/${auctionKey}`, // destination
      (message: StompJs.IMessage) => {
        const receiveMessage: ReceiveMessage = JSON.parse(message.body);

        if (receiveMessage.auctionMessageType == "BID_SUCCESS") {
          setBidList((prev) => [...prev, receiveMessage]);
          setCurrentPrice(parseInt(receiveMessage.auctionPrice));
        } else if (receiveMessage.auctionMessageType == "ENTER") {
          const memberList: AuctionMember[] = receiveMessage.memberList;
          setMembers(memberList);
        } else if (receiveMessage.auctionMessageType == "BID_CLOSE") {
          setEndAuction(true);
          loadBidList();
        }
      }
    );

    loadBidList();
    stompSendMessage("ENTER", "enter");
  };

  const stompSendMessage = (
    auctionMessageType: AuctionMessageType,
    message: string
  ) => {
    if (parseInt(message) == currentPrice) {
      auctionMessageType = "BID_MAX";
    }

    const sendMessage: BidMessageType = {
      auctionMessageType,
      message,
    };

    client.current.publish({
      destination: `/pub/auction/${auctionKey}`,
      body: JSON.stringify(sendMessage),
    });

    if (auctionMessageType == "BID_MAX") {
      // 경매 종료처리
      auctionClosingMessage();
    }
  };

  const auctionClosingMessage = () => {
    client.current.publish({
      destination: `/pub/auction/${auctionKey}`,
      body: JSON.stringify({
        auctionMessageType: "BID_CLOSE",
        message: "close",
      }),
    });
  };

  const handleOnBidSendButtonClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    endPrice?: boolean
  ) => {
    if (endPrice) {
      stompSendMessage("BID_MAX", auctionInfo!.productInfo.endPrice.toString());
    } else {
      const addPrice = e.currentTarget.dataset.value;
      const bidPrice = parseInt(addPrice ?? "0") + currentPrice;
      stompSendMessage("BID", bidPrice.toString() ?? "");
    }
  };

  const subscription: StompJs.StompSubscription | null = null;

  const setImageUrl = async (imageUrl: string) => {
    const url = await downloadUrl(imageUrl);
    setSharedImageUrl(url);
  };

  const loadAuctionDetail = useCallback(async (auctionKey: string) => {
    const URL = `/auction/detail/${auctionKey}`;
    const res = await axiosClient.get<ResponseModel<AuctionInfo>>(URL);

    const { code, message, data } = res.data;

    if (code != successCode) {
      alert(message);
      return;
    }
    setAuctionInfo(data);
    setCurrentPrice(data.productInfo.startPrice);
    setImageUrl(data.productInfo.imageUrl);
  }, []);

  const loadBidList = useCallback(async () => {
    const URL = `/auction/bid-history/${auctionKey}`;
    const res = await axiosClient.get<ResponseModel<ReceiveMessage[]>>(URL);

    const { code, message, data } = res.data;

    if (code != successCode) {
      alert(message);
      return;
    }

    setBidList(data);

    const maxPriceBid = data
      .toSorted((a, b) => parseInt(a.auctionPrice) - parseInt(b.auctionPrice))
      .pop();
    setCurrentPrice(
      (prev) => parseInt(maxPriceBid?.auctionPrice || "") || prev
    );

    const isEnd = data.some((bid) => bid.award == "Y");
    setEndAuction(isEnd);
  }, [loadAuctionDetail]);

  useEffect(() => {
    loadAuctionDetail(auctionKey);
  }, [auctionKey]);
  useEffect(() => {
    debugger;
    scrollableRef.current?.scrollTo({
      top: scrollableRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [bidList]);

  useEffect(() => {
    if (auctionInfo) {
      stompConnect();
    }

    return () => {
      stompDisconnect();
    };
  }, [auctionInfo]);

  const buttonDisableChecker = (price: number): boolean => {
    return (auctionInfo?.productInfo.endPrice ?? 0) < price;
  };

  return (
    <div className="h-[calc(100%-40px)]">
      <PageTitle
        title={`${auctionInfo?.productInfo.productTitle ?? ""}(${
          members.length
        }명 참여중)`}
      />
      <div className="flex justify-between gap-5 h-[calc(100%-40px)]">
        <section className="w-[40%]">
          <div className="flex flex-col items-center">
            {/* image */}
            <div className="mb-5"></div>

            {sharedImageUrl ? (
              <div className="relative w-[276px] h-[211px] overflow-hidden box-border mb-5">
                <Image
                  src={sharedImageUrl}
                  alt="product image"
                  fill
                  className="object-scale-down"
                />
              </div>
            ) : (
              <div className="relative w-[276px] h-[211px] overflow-hidden box-border flex">
                <NoImage />
              </div>
            )}

            <div className="p-5">
              <p>
                시작가 :{" "}
                {numberWithCommas(auctionInfo?.productInfo.startPrice ?? 0)}
              </p>
              <p>
                종료가 :{" "}
                {numberWithCommas(auctionInfo?.productInfo.endPrice ?? 0)}
              </p>
              <p className="mt-5">
                현재가 : {numberWithCommas(currentPrice ?? 0)}
              </p>
            </div>
          </div>
        </section>
        <section className="w-full">
          <div className="h-full flex flex-col">
            <Card className="h-full overflow-auto">
              <CardContent className="flex-1 overflow-auto">
                <div
                  className="flex flex-col items-center w-full h-full overflow-auto space-y-5"
                  ref={scrollableRef}
                >
                  {bidList &&
                    bidList.map((bid, index, bidList) =>
                      bidList.length - 1 == index ? (
                        bid.award == "Y" ? (
                          <Badge
                            key={index}
                            className="bg-amber-300 text-black"
                          >{`${bid.senderName}님 ${numberWithCommas(
                            bid.auctionPrice
                          )}원 낙찰되었습니다`}</Badge>
                        ) : (
                          <Badge key={index}>{`${
                            bid.senderName
                          }님 ${numberWithCommas(
                            bid.auctionPrice
                          )}원 입찰완료`}</Badge>
                        )
                      ) : (
                        <Badge
                          key={index}
                          variant={"secondary"}
                          className="text-gray-500"
                        >{`${bid.senderName}님 ${numberWithCommas(
                          bid.auctionPrice
                        )}원 입찰완료`}</Badge>
                      )
                    )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-end gap-5 w-full">
                  {/* {currentPrice == auctionInfo?.productInfo.startPrice && (
                    <Button data-value={0} onClick={handleOnBidSendButtonClick}>
                      현재가입찰
                    </Button>
                  )} */}

                  <Button
                    data-value={1000}
                    onClick={handleOnBidSendButtonClick}
                    disabled={
                      buttonDisableChecker(currentPrice + 1000) || endAuction
                    }
                  >
                    +1,000
                  </Button>
                  <Button
                    data-value={10000}
                    onClick={handleOnBidSendButtonClick}
                    disabled={
                      buttonDisableChecker(currentPrice + 10000) || endAuction
                    }
                  >
                    +10,000
                  </Button>
                  <Button
                    data-value={100000}
                    onClick={handleOnBidSendButtonClick}
                    disabled={
                      buttonDisableChecker(currentPrice + 100000) || endAuction
                    }
                  >
                    +100,000
                  </Button>
                  <Button
                    data-value={auctionInfo?.productInfo.endPrice}
                    onClick={(e) => handleOnBidSendButtonClick(e, true)}
                    disabled={
                      (auctionInfo?.productInfo.endPrice ?? 0) ==
                        currentPrice || endAuction
                    }
                  >
                    최고가입찰
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

export { AuctionClient };
