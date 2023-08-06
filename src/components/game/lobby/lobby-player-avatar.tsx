import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';
import { type MockPlayer } from 'types';

interface LobbyPlayerAvatarProps {
  player: MockPlayer;
  isReady?: boolean;
}

export function LobbyPlayerAvatar({
  player,
  isReady = false
}: LobbyPlayerAvatarProps) {
  return (
    <figure
      className={cn(
        'relative flex flex-col items-center justify-center rounded-full border-2 ',
        isReady ? 'border-green-600' : 'border-transparent grayscale'
      )}
    >
      <Avatar>
        <AvatarImage src={player.avatarSrc} />
        <AvatarFallback>{player.initials}</AvatarFallback>
      </Avatar>

      {isReady && (
        <div className="absolute left-1/2 top-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green-600/50 text-white">
          <Check />
        </div>
      )}
    </figure>
  );
}
