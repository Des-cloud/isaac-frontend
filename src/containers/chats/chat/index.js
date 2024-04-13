import React, { useEffect, useState } from "react";

import DetailedView from "./detailedView";
import axios from "axios";

export default function Chat(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [chat, setChat] = useState({});

  useEffect(() => {
    async function initialize() {
      try {
        setIsLoading(true);
        let response;
        if (props.username) {
          response = await axios.post(
            `http://localhost:4090/api/chats`,
            {
              title: `${props.session.username} and ${props.username} chat`,
              host: props.session.username,
              members: [props.username],
            },
            {
              credentials: "same-origin",
              headers: {
                Authorization: `Bearer ${props.session.authToken}`,
              },
            }
          );
        } else {
          response = await axios.get(
            `http://localhost:4090/api/chats/${props.id}`,
            {
              credentials: "same-origin",
              headers: {
                Authorization: `Bearer ${props.session.authToken}`,
              },
            }
          );
        }

        let data = response.data;
        if (response.status !== 200) {
          throw new Error(data.message);
        }

        setChat(data);
      } catch (err) {
        console.error(
          `Failed to initialize chat- ${props.id ?? props.username}. ${err}`
        );
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, [props]);

  if (props.listView) {
    return null;
  } else {
    return (
      <DetailedView session={props.session} chat={chat} isLoading={isLoading} />
    );
  }
}
