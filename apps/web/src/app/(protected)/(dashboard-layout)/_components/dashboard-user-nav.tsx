'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import type { User } from '@caho/schemas';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/actions/sign-out';

type Props = {
  user: User;
};

export function DashboardUserNav({ user }: Props) {
  const [_, handleSignOut] = useActionState(signOut, null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 select-none rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl ?? undefined} alt="" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        side="left"
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings">Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings/themes">Aparência</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings/connections">Dispositivos</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* <SignOutButton> */}
        <DropdownMenuItem asChild className="w-full">
          <button type="button" formAction={handleSignOut}>
            Sair
          </button>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
        {/* </SignOutButton> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
