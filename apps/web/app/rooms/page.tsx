"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex";
import { Button, Text } from "@repo/ui";
import { PrivatePageWrapper } from "../../lib/Authorization/PrivatePageWrapper";
import { CreateRoomForm } from "../../lib/Rooms/CreateRoomForm";
import { Page } from "../../lib/layout/Page";

export default function RoomsPage() {
  const router = useRouter();
  const allRooms = useQuery(api.rooms.sessionedFindAll);
  const [selectedRoomId, setSelectedRoomId] = useState<Id<"rooms"> | null>();
  const selectedRoom = allRooms?.find((room) => room._id === selectedRoomId);

  const selectedRoomUsersArgs = selectedRoomId
    ? { roomId: selectedRoomId }
    : "skip";
  const selectedRoomUsers = useQuery(
    api.roomUsers.sessionedFindAllByRoomId,
    selectedRoomUsersArgs
  );

  useEffect(() => {
    if (selectedRoomId) return;
    setSelectedRoomId(allRooms?.[0]?._id);
  }, [allRooms, selectedRoomId]);

  return (
    <PrivatePageWrapper>
      <Page className="flex flex-row">
        <div className="w-1/4 pr-4 sticky">
          <CreateRoomForm
            onSuccess={(newRoomId) => {
              setSelectedRoomId(newRoomId);
            }}
          />
          <Text className="py-4 font-bold">Rooms</Text>
          {allRooms?.map((room) => (
            <Button
              key={room._id}
              onClick={() => {
                setSelectedRoomId(room._id);
              }}
              className="w-full mb-4"
              variant={selectedRoomId === room._id ? "default" : "outline"}
            >
              {room.name}
            </Button>
          ))}
        </div>
        <div className="w-3/4 pl-4">
          {Boolean(selectedRoom) && (
            <>
              <div className="flex flex-row items-center justify-between pb-8">
                <Text className="text-xl">{selectedRoom?.name}</Text>
                <Button
                  variant="default"
                  onClick={() => {
                    router.push(`/rooms/${selectedRoomId}`);
                  }}
                >
                  Join room
                </Button>
              </div>
              <Text className="font-bold">Participants</Text>
              {selectedRoomUsers?.map((roomUser) => (
                <Text key={roomUser._id}>
                  {roomUser.user?.name} - {roomUser.status}
                </Text>
              ))}
            </>
          )}
        </div>
      </Page>
    </PrivatePageWrapper>
  );
}
