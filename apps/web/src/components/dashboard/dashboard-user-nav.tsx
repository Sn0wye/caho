import Link from 'next/link';
import { currentUser, SignOutButton } from '@clerk/nextjs';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

export async function DashboardUserNav() {
  const user = await currentUser();

  if (!user) {
    throw new Error('Not authenticated.');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 select-none rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt="" />
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
            <p className="text-sm font-medium leading-none">
              {user.firstName + ' ' + user.lastName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {
                user.emailAddresses.find(
                  email => email.id === user.primaryEmailAddressId
                )?.emailAddress
              }
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
        <SignOutButton>
          <DropdownMenuItem>
            Sair
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
