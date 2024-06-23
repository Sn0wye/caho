import { Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';

interface LobbyPlayerAvatarProps {
  avatarUrl: string | null;
  name: string;
  isReady: boolean;
}

export function LobbyPlayerAvatar({
  avatarUrl,
  name,
  isReady = false
}: LobbyPlayerAvatarProps) {
  const initials = name
    .split(' ')
    .map(name => name[0])
    .join('');

  return (
    <figure
      className={cn(
        'relative flex flex-col items-center justify-center rounded-full border-2 ',
        isReady ? 'border-green-600' : 'border-transparent grayscale'
      )}
    >
      <Avatar>
        {/* //TODO: avatar placeholder */}
        <AvatarImage src={avatarUrl ?? undefined} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {isReady && (
        <div className="absolute left-1/2 top-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green-600/50 text-white">
          <Check />
        </div>
      )}
    </figure>
  );
}
