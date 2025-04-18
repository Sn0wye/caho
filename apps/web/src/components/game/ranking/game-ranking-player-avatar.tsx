import type { Player } from '@caho/schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getUsernameInitials } from '@/utils/name';

interface GameRankingPlayerAvatarProps {
  player: Player;
  hideBadge?: boolean;
}

export function GameRankingPlayerAvatar({
  player,
  hideBadge = false
}: GameRankingPlayerAvatarProps) {
  return (
    <figure className="relative flex h-16 w-16 flex-col items-center justify-center">
      <Avatar ring={player.isHost ? 'teal' : player.isJudge ? 'orange' : null}>
        <AvatarImage src={player.avatarUrl ?? ''} />
        <AvatarFallback>{getUsernameInitials(player.username)}</AvatarFallback>
      </Avatar>

      <div className="absolute bottom-0 left-1/2 z-10 w-fit -translate-x-1/2">
        {player.isHost && !hideBadge && (
          <Badge variant="teal" className="uppercase" size="avatar">
            Host
          </Badge>
        )}
        {player.isJudge && !hideBadge && (
          <Badge variant="orange" className="uppercase" size="avatar">
            Juiz
          </Badge>
        )}
      </div>
    </figure>
  );
}
