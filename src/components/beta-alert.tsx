import { siteConfig } from 'config/site';
import { Info } from 'lucide-react';
import { AlertTopBar } from './alert-top-bar';

const betaMessage =
  'Sim, estamos em BETA e erros são esperados. Se você encontrar algum, por favor, reporte em nosso repositório.';

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
