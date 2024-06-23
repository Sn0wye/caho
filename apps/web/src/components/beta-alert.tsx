import { siteConfig } from 'config/site';
import { Info } from 'lucide-react';
import { betaMessage } from '@/helpers/beta';
import { AlertTopBar } from './alert-top-bar';

export function BetaAlert() {
  return (
    <AlertTopBar
      label={betaMessage}
      variant="warning"
      icon={<Info size={16} />}
      actionLabel="Github"
      actionHref={siteConfig.links.github}
      isExternal
    />
  );
}
