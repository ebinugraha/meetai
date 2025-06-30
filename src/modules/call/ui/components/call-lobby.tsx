import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatar } from "@/lib/avatar";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { LogIn } from "lucide-react";
import Link from "next/link";

interface Props {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          image:
            data?.user.image ??
            generateAvatar({
              seed: data?.user.name ?? "",
              variant: "initials",
            }),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBroserPermission = () => {
  return (
    <p className="text-sm">
      please grant your browser a permission to access your camera and
      microphone
    </p>
  );
};

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserPermission = hasCameraPermission && hasMicPermission;

  return (
    <div className="flex flex-col items-center justfy-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join ?</h6>
            <p className="text-sm">Set up your setting before join</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserPermission
                ? DisabledVideoPreview
                : AllowBroserPermission
            }
          />
          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className="flex gap-x-2 justify-between w-full">
            <Button variant={"ghost"}>
              <Link href={"/meetings"}>Cancel</Link>
            </Button>
            <Button onClick={onJoin}>
              <LogIn/>
              Join
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
