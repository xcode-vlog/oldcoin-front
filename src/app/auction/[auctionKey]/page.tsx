import { AuctionClient } from "@/domain/auction/[auctionKey]";

interface PageProps {
  params: Promise<{ auctionKey: string }>;
}

async function AuctionServer({ params }: PageProps) {
  const { auctionKey } = await params;

  return <AuctionClient auctionKey={auctionKey} />;
}

export default AuctionServer;
