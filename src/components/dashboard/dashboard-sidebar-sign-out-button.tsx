import { SignOutButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const label = 'Sair do sistema';

export function DashboardSidebarSignOutButton() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <SignOutButton>
          <Button variant="transparent" size="icon">
            <LogOut size={20} />
            <span className="sr-only">{label}</span>
          </Button>
        </SignOutButton>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={4}>
        <span>{label}</span>
      </TooltipContent>
    </Tooltip>
  );
}
