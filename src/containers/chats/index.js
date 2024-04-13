import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Loader } from "../../components/loaders";

const ChatView = lazy(() => import("./views/chatView"));

export default function ChatApp(props) {
  const session = useSelector((s) => s.session);
  return (
    <Suspense fallback={<Loader isLoading={true} />}>
      <Switch>
        <Route
          path={`${props.match.path}/:id`}
          exact
          render={(props) => (
            <ChatView
              {...props}
              id={props.match.params.id}
              session={session}
              isList={false}
              isCreate={false}
            />
          )}
        />
        <Route
          path={`${props.match.path}/create/:username`}
          render={(props) => (
            <ChatView
              {...props}
              isList={false}
              session={session}
              isCreate={true}
              username={props.match.params.username}
            />
          )}
        />
        <Route
          path=''
          render={(props) => (
            <ChatView
              {...props}
              isList={true}
              session={session}
              isCreate={false}
            />
          )}
        />
      </Switch>
    </Suspense>
  );
}
