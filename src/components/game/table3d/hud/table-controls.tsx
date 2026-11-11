'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Armchair, CircleHelp, Eye, Volume2, VolumeX, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { fx, useTable3D } from '../store';
import { glass, popIn } from './glass';

const CONTROLS = [
  'Botão direito + arrastar: girar a câmera',
  'Scroll: zoom',
  'Espaço: voltar ao assento',
  'T: vista de cima',
  'Arraste os dados e as fichas',
  'Duplo clique no dado: rolar'
];

const HINT_KEY = 'caho:table3d-hint-dismissed';
const HINT_VISIBLE_MS = 9000;

function IconButton({
  label,
  isActive = false,
  onClick,
  children
}: {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      onClick={() => {
        fx.emit({ type: 'ui-click' });
        onClick();
      }}
      className={cn(
        'pointer-events-auto flex size-8 items-center justify-center rounded-full transition active:scale-90',
        isActive
          ? 'bg-amber-300/20 text-amber-200'
          : 'text-zinc-400 hover:bg-white/10 hover:text-zinc-100'
      )}
    >
      {children}
    </button>
  );
}

function ControlList() {
  return (
    <ul className="flex flex-col gap-1 text-xs text-zinc-300">
      {CONTROLS.map(line => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

/** Bottom-right: mute, camera views and the controls popover. */
export function TableControls() {
  const { isMuted, toggleMuted, cameraView, setCameraView } = useTable3D();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHelpOpen) return;
    const close = (event: Event) => {
      if (
        event instanceof KeyboardEvent
          ? event.key === 'Escape'
          : !ref.current?.contains(event.target as Node)
      ) {
        setIsHelpOpen(false);
      }
    };
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', close);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', close);
    };
  }, [isHelpOpen]);

  return (
    <div ref={ref} className="absolute right-4 bottom-4">
      <AnimatePresence>
        {isHelpOpen && (
          <motion.div
            {...popIn}
            className={cn(
              glass,
              'absolute right-0 bottom-full mb-2 w-64 rounded-2xl p-3'
            )}
          >
            <h3 className="mb-1.5 text-xs font-semibold text-zinc-100">
              Controles da mesa
            </h3>
            <ControlList />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={cn(glass, 'flex items-center gap-0.5 rounded-full p-1')}>
        <IconButton
          label={isMuted ? 'Ativar som' : 'Silenciar'}
          onClick={toggleMuted}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </IconButton>
        <span className="mx-0.5 h-4 w-px bg-white/10" />
        <IconButton
          label="Vista do assento"
          isActive={cameraView === 'seat'}
          onClick={() => setCameraView('seat')}
        >
          <Armchair size={16} />
        </IconButton>
        <IconButton
          label="Vista de cima"
          isActive={cameraView === 'top'}
          onClick={() => setCameraView('top')}
        >
          <Eye size={16} />
        </IconButton>
        <span className="mx-0.5 h-4 w-px bg-white/10" />
        <IconButton
          label="Controles"
          isActive={isHelpOpen}
          onClick={() => setIsHelpOpen(open => !open)}
        >
          <CircleHelp size={16} />
        </IconButton>
      </div>
    </div>
  );
}

/** First-visit tip at the top right; dismissal is remembered. */
export function FirstVisitHint() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      setIsVisible(localStorage.getItem(HINT_KEY) !== '1');
    } catch {
      // Storage blocked: skip the tip rather than nag every time.
    }
  }, []);

  // A tip, not a fixture: it leaves on its own and stays in the "?" popover.
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setIsVisible(false), HINT_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const dismiss = () => {
    fx.emit({ type: 'ui-click' });
    setIsVisible(false);
    try {
      localStorage.setItem(HINT_KEY, '1');
    } catch {
      // Same as above.
    }
  };

  return (
    <div className="absolute top-4 right-4">
      <AnimatePresence>
        {isVisible && (
          <motion.div {...popIn} className={cn(glass, 'w-64 rounded-2xl p-3')}>
            <div className="mb-1.5 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-amber-200">
                Dicas da mesa
              </h3>
              <button
                type="button"
                aria-label="Fechar dica"
                onClick={dismiss}
                className="pointer-events-auto rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
              >
                <X size={12} />
              </button>
            </div>
            <ControlList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
