import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { getUsernameInitials } from '@/utils/name';
import type { RoomPlayer } from '@/schemas';

interface GameRankingPlayerAvatarProps {
  player: RoomPlayer;
  isJudge: boolean;
  hideBadge?: boolean;
}

export function GameRankingPlayerAvatar({
  player,
  isJudge,
  hideBadge = false
}: GameRankingPlayerAvatarProps) {
  return (
    <figure
      className={cn(
        'relative flex h-16 w-16 shrink-0 flex-col items-center justify-center',
        !player.isActive && 'opacity-50'
      )}
    >
      <Avatar
        variant={player.isActive ? 'default' : 'ghost'}
        ring={isJudge ? 'orange' : player.isHost ? 'teal' : null}
      >
        <AvatarImage src={player.avatarUrl ?? ''} />
        <AvatarFallback>{getUsernameInitials(player.username)}</AvatarFallback>
      </Avatar>

      {!hideBadge && (
        <div className="absolute bottom-0 left-1/2 z-10 w-fit -translate-x-1/2">
          {player.isHost && isJudge ? (
            <Badge variant="tealOrange" className="uppercase" size="avatar">
              H+J
            </Badge>
          ) : player.isHost ? (
            <Badge variant="teal" className="uppercase" size="avatar">
              Host
            </Badge>
          ) : isJudge ? (
            <Badge variant="orange" className="uppercase" size="avatar">
              Juiz
            </Badge>
          ) : null}
        </div>
      )}
    </figure>
  );
}
