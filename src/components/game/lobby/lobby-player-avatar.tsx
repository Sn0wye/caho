import { Check, Crown, WifiOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';
import { getUsernameInitials } from '@/utils/name';

interface LobbyPlayerAvatarProps {
  avatarUrl: string | null;
  name: string;
  isReady: boolean;
  isHost?: boolean;
  isActive?: boolean;
}

export function LobbyPlayerAvatar({
  avatarUrl,
  name,
  isReady = false,
  isHost = false,
  isActive = true
}: LobbyPlayerAvatarProps) {
  return (
    <div className="flex w-20 flex-col items-center gap-2">
      <figure
        className={cn(
          'relative flex flex-col items-center justify-center rounded-full border-2',
          isReady ? 'border-green-600' : 'border-transparent grayscale',
          !isActive && 'opacity-40'
        )}
      >
        <Avatar size="lg">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback>{getUsernameInitials(name)}</AvatarFallback>
        </Avatar>

        {isReady && (
          <div className="absolute top-1/2 left-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green-600/50 text-white">
            <Check />
          </div>
        )}

        {isHost && (
          <div className="absolute -top-2 left-1/2 z-20 -translate-x-1/2 text-teal-500">
            <Crown size={16} fill="currentColor" />
          </div>
        )}

        {!isActive && (
          <div className="absolute -right-1 -bottom-1 z-20 rounded-full bg-zinc-200 p-1 text-zinc-500 dark:bg-zinc-900">
            <WifiOff size={12} />
          </div>
        )}
      </figure>

      <span className="w-full truncate text-center text-sm text-zinc-600 dark:text-zinc-400">
        {name}
      </span>
    </div>
  );
}
