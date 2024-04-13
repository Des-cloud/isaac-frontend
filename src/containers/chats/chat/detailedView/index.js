import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FluidContainer } from "../../../../components/layout";
import { Loader } from "../../../../components/loaders";

import TitleBar, { TitleBarLink, TitleBarLinks } from "../../../home/titleBar";
import MessageWindow from "./messageWindow";
import SendMessageBar from "./sendMessage";

export default function DetailedView(props) {
  const channelRef = useRef(null);

  useEffect(() => {
    // async function reconnect() {
    //   console.log("Reconnecting chat");
    //   try {
    //     if (channel && !channel.connected) {
    //       connect();
    //     } else if (!channel) {
    //       console.log("No channel already connected.");
    //     } else {
    //       console.log("Channel already connected.");
    //     }
    //   } catch (err) {
    //     console.error(`Failed to reconnect to server. ${err}`);
    //   }
    // }

    async function connect() {
      try {
        const newChannel = io("http://localhost:4090/");

        newChannel.on("connect", () => {
          console.log(`Channel connection status: ${newChannel.connected}`);
        });

        // newChannel.on("disconnect", reconnect);

        newChannel.emit("join", props.chat._id, (response) => {
          if (response.status === "ok") {
            console.log("Joined chat session.");
          } else {
            console.log("Failed to join chat session.");
          }
        });
        channelRef.current = newChannel;
      } catch (err) {
        console.error(`Failed to connect to server. ${err}`);
      }
    }

    connect();
    return () => {
      try {
        if (channelRef.current) {
          channelRef.current.emit("leave", props.chat._id, (response) => {
            if (response.status === "ok") {
              console.debug("Left chat session.");
            } else {
              console.log("Failed to leave chat session.");
            }
          });

          channelRef.current.close();
          console.debug(
            `Channel connection status: ${channelRef.current.connected}`
          );
        }

        channelRef.current = null;
      } catch (err) {
        console.error(`Failed to disconnect from server. ${err}`);
      }
    };
  }, [props.chat._id]);

  return (
    <FluidContainer className='d-flex flex-column md-chat h-100 px-0'>
      {props.isLoading ? (
        <>
          <Loader isLoading={true} />
        </>
      ) : (
        <>
          <TitleBar title={props.chat.title}>
            <TitleBarLinks>
              <TitleBarLink path={`/chats`} title='Chat List' icon='event' />
            </TitleBarLinks>
          </TitleBar>
          <MessageWindow
            session={props.session}
            chat={props.chat}
            channel={channelRef.current}
          />
          <SendMessageBar
            session={props.session}
            chat={props.chat}
            channel={channelRef.current}
          />
        </>
      )}
    </FluidContainer>
  );
}
