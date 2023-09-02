import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { type MockPlayer } from 'types';

// TODO: Refactor to match server data
interface GameRankingPlayerAvatarProps {
  player: MockPlayer;
  hideBadge?: boolean;
}

export function GameRankingPlayerAvatar({
  player,
  hideBadge = false
}: GameRankingPlayerAvatarProps) {
  return (
    <figure className="relative flex h-16 w-16 flex-col items-center justify-center">
      <Avatar
        variant={!player.isConnected ? 'ghost' : null}
        ring={
          !player.isConnected
            ? 'ghost'
            : player.isHost
            ? 'teal'
            : player.isJudge
            ? 'orange'
            : null
        }
      >
        <AvatarImage src={player.avatarSrc} />
        <AvatarFallback>{player.initials}</AvatarFallback>
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
        {!player.isConnected && !hideBadge && (
          <Badge variant="ghost" className="uppercase" size="avatar">
            Offline
          </Badge>
        )}
      </div>
    </figure>
  );
}
