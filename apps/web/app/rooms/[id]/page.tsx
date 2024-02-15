"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Track } from "livekit-client";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { api } from "@repo/backend/convex/_generated/api";
import { Breadcrumbs, LoadingScreen, Text } from "@repo/ui";
import { useMe } from "../../../lib/Authorization/MeProvider";
import { PrivatePageWrapper } from "../../../lib/Authorization/PrivatePageWrapper";
import { RoomId } from "../../../lib/Rooms/types";

export default function RoomsPage() {
  const { me } = useMe();
  const router = useRouter();
  const params = useParams();

  const roomId = params.id;
  const name = `${me?.name}#${me?.id}`;
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState(null);

  const room = useQuery(api.rooms.sessionedFindById, {
    id: params.id as RoomId,
  });
  const joinRoom = useMutation(
    api.roomUsers.sessionedCreateAndJoinUserByRoomId
  );
  const leaveRoom = useMutation(api.roomUsers.sessionedDisconnectUserByRoomId);

  useEffect(() => {
    (async () => {
      if (!me) return;
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${roomId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e: any) {
        setTokenError(e.message);
      }
    })();
  }, [me, name, roomId]);

  useEffect(() => {
    return () => {
      if (me) {
        leaveRoom({ roomId: params.id as RoomId, userId: me.id });
      }
    };
  }, [leaveRoom, me, params.id]);

  async function handleConnect() {
    if (!me) return;
    await joinRoom({ roomId: params.id as RoomId, userId: me.id });
  }

  async function handleDisconnect() {
    if (!me) return;
    await leaveRoom({ roomId: params.id as RoomId, userId: me.id });
    router.push("/rooms");
  }

  if (token === "" || !me || !room) {
    return <LoadingScreen />;
  }

  if (tokenError) {
    return <Text className="text-destructive">{tokenError}</Text>;
  }

  return (
    <PrivatePageWrapper>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/rooms", label: "Rooms" },
            {
              href: `/rooms/${params.id}`,
              label: room.name,
            },
          ]}
        />
      </div>
      <div className="w-full py-4 px-8">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          // Use the default LiveKit theme for nice styles.
          data-lk-theme="default"
          style={{ height: "calc(100vh - 12rem)" }}
          onConnected={() => handleConnect()}
          onDisconnected={() => handleDisconnect()}
        >
          <VideoConference />
          <RoomAudioRenderer />
          <ControlBar variation="minimal" />
        </LiveKitRoom>
      </div>
    </PrivatePageWrapper>
  );
}

function VideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <>
      <GridLayout
        tracks={tracks}
        style={{
          height: "calc(90vh - var(--lk-control-bar-height))",
        }}
      >
        {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
        <ParticipantTile />
      </GridLayout>
    </>
  );
}
