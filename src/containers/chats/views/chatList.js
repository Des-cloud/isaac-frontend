import React, { useEffect, lazy, useState } from "react";
import axios from "axios";
import { Col, FluidContainer, Row } from "../../../components/layout";
import { List, ListItem } from "../../../components/lists";
import { AutoLoader } from "../../../components/loaders";
import { Link } from "react-router-dom";

const SearchPhysiciansView = lazy(() =>
  import("../../users/views/searchPhysicians")
);

function DefaultItem(props) {
  return (
    <Row className='justify-content-center'>
      <Col className='col-auto align-items-center'>
        <h6 className='my-0 py-3 text-muted'>{props.message}</h6>
      </Col>
    </Row>
  );
}

export default function ChatList(props) {
  const session = props.session;
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Get the list of chats
    async function initialize() {
      try {
        const response = await axios.get(
          `http://localhost:4090/api/chats/specific`,
          {
            credentials: "same-origin",
            headers: {
              Authorization: `Bearer ${session.authToken}`,
            },
            params: {
              username: session.username,
            },
          }
        );
        let data = response.data;
        if (response.status !== 200) {
          throw new Error(data.message);
        }

        setChats(data);
      } catch (err) {
        console.error(`Failed to initialize chat list. ${err}`);
      }
    }

    initialize();
  }, [session]);

  return (
    <>
      <SearchPhysiciansView {...props} session={session} />
      <FluidContainer>
        <Row>
          <Col className='px-0'>
            <List className='md-list'>
              {chats.map((chat, index) => (
                <ListItem key={index} className='p-0 my-1'>
                  <h3 className='my-0'>
                    <Link
                      to={`/chats/${chat._id}`}
                      className='text-truncate font-weight-bold'>
                      {chat.title}
                    </Link>
                  </h3>
                </ListItem>
              ))}
              {chats.length === 0 && <DefaultItem message='No chats found' />}
            </List>
            {chats.length > 0 && <AutoLoader callback={null} />}
          </Col>
        </Row>
      </FluidContainer>
    </>
  );
}
