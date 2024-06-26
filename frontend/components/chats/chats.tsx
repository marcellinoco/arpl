"use client";

import { FC, useEffect, useState, Suspense } from "react";
import ChatsHistoryList from "./history/chats-history-list";
import {
  Chat,
  EmailMessage,
  History,
  Mood,
  Priority,
  User,
} from "@/models/model";
import { getChatsDetails } from "@/app/action";
import ChatsDetailsList from "./details/chats.details-list";
import WebSocketConnection from "./websocket-connection";
import { useSearchParams } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import RelatedSidebar from "./related/related-sidebar";

interface ChatsProps {
  histories: History[];
}

const ChatsComponent: FC<ChatsProps> = ({ histories }) => {
  const [curHistory, setCurHistory] = useState<History[] | null>(histories);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [chats, setChats] = useState<EmailMessage[] | null>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const searchParams = useSearchParams();
  const uidActive = searchParams.get("uid");
  const nameActive = searchParams.get("name");
  const { user } = useAuthStore();

  const onMessage = (event: MessageEvent) => {
    const { chat, history }: { chat: Chat; history: History } = JSON.parse(
      event.data
    );

    setCurHistory((cHistory) => {
      let newHistory =
        cHistory?.filter((hs) => {
          return true;
        }) ?? [];

      return [history, ...newHistory];
    });

    setActiveUser((currentUser) => {
      if (!currentUser) return null;

      if (
        chat?.sender_uid === currentUser?.uid ||
        chat?.receiver_uid === currentUser?.uid
      ) {
        // setChats((cChats) => {
        //   if (!cChats) return [chat];

        //   const chatExists = cChats?.some((c) => c?.id === chat?.id);
        //   return chatExists ? cChats : [chat, ...cChats];
        // });
      }
      return currentUser;
    });
  };

  const onClose = () => {
    console.log("WebSocket connection closed");
  };

  const onOpen = () => {
    console.log("WebSocket connection established");
  };

  const historyRowClickedHandler = async (id: string) => {
    const { messages } = await getChatsDetails(id);
    setChats(messages);
  };

  const sendMessage = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.log("WebSocket is not connected.");
    }
  };

  useEffect(() => {
    if (!uidActive) return;

    setCurHistory((cHistory) => {
      const newHs: History = {
        id: new Date().toString(),
        subject: "",
        from: "",
        date: new Date(),
        threadId: new Date().toString(),
        content: "",
        summary: "",
        products: [],
        priority: Priority.HIGH,
        mood: Mood.ANGRY,
      } as unknown as History;

      let idx: number = -1;

      if (!cHistory) {
        return [newHs];
      }

      let newHistory =
        cHistory?.filter((hs, id) => {
          if (cHistory) {
            idx = id;
            return false;
          }
          return true;
        }) ?? [];

      if (idx >= 0) {
        return [cHistory?.[idx], ...newHistory];
      } else {
        return [newHs, ...newHistory];
      }
    });

    const url = new URL(window.location.href);
    url.searchParams.delete("uid");
    url.searchParams.delete("name");

    window.history.pushState({}, "", url);

    historyRowClickedHandler(uidActive);
  }, [uidActive, nameActive, user?.name, user?.id]);

  return (
    <>
      <ChatsHistoryList
        histories={curHistory}
        onChatHistoryRowClicked={historyRowClickedHandler}
      />
      <ChatsDetailsList
        activeUser={activeUser}
        chats={chats}
        sendMessage={sendMessage}
      />
      <RelatedSidebar />
      <WebSocketConnection
        socket={socket}
        url={`${process.env.NEXT_PUBLIC_WEBSOCKET_BACKEND}/ws/chats`}
        setSocket={setSocket}
        onMessage={onMessage}
        onClose={onClose}
        onOpen={onOpen}
      />
    </>
  );
};

const Chats: FC<ChatsProps> = (props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <ChatsComponent {...props} />
  </Suspense>
);

Chats.displayName = "Chats";
export default Chats;
