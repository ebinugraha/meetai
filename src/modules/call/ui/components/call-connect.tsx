"use client";

import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";

import { useTRPC } from "@/trpc/client";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CallUi } from "./call-ui";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  username: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  username,
  userImage,
}: Props) => {
  const trpc = useTRPC();

  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions({})
  );

  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();

  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: username,
        image: userImage,
      },
      tokenProvider: generateToken,
    });

    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, username, userImage, generateToken]);

  useEffect(() => {
    if (!client) return;

    const _call = client.call("default", meetingId);
    _call.microphone.disable();
    _call.camera.disable();
    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
        setCall(undefined);
      }
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return <p>Loading...</p>;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUi meetingName={meetingName}/>
      </StreamCall>
    </StreamVideo>
  );
};
