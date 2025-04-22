import * as StompJs from "@stomp/stompjs";

export function useStompClient() {
  const stompClient = new StompJs.Client({
    brokerURL: `${process.env.NEXT_PUBLIC_SOCKET_URL}/stomp/auction`,
  });

  stompClient.onStompError = (frame: StompJs.IFrame) => {
    console.log("stomp error");
    console.log(frame);
  };
  stompClient.onWebSocketError = (e) => {
    console.log("stomp websocket error");
    console.log(e);
  };
  stompClient.onConnect = (frame: StompJs.IFrame) => {
    console.log("stomp connect");
    console.log(frame);
  };
  stompClient.onDisconnect = (frame: StompJs.IFrame) => {
    console.log("stomp disconnect");
    console.log(frame)
    
  };

  return { stompClient };
}
