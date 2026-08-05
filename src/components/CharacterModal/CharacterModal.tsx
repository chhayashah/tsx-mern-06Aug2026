import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { HomeworldPanel } from '@/components/CharacterModal/HomeworldPanel';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { getAvatarUrl } from '@/utils/avatar';
import { getSpeciesColor } from '@/utils/species';
import {
  formatBirthYear,
  formatCreatedDate,
  formatHeightInMeters,
  formatMassInKg,
} from '@/utils/format';
import type { SwapiPerson } from '@/types/swapi';

interface CharacterModalProps {
  person: SwapiPerson | null;
  speciesName: string;
  onClose: () => void;
}

export function CharacterModal({ person, speciesName, onClose }: CharacterModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = person !== null;

  useFocusTrap(dialogRef, isOpen, onClose);
  useBodyScrollLock(isOpen);

  return createPortal(
    <AnimatePresence>
      {person && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="character-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-raised)] shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close character details"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-lg text-[var(--ink-primary)] transition-colors hover:bg-black/50"
            >
              ✕
            </button>

            <div className="relative h-48 w-full overflow-hidden">
              <img src={getAvatarUrl(person.name)} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-raised)] via-transparent to-black/20" />
            </div>

            <div className="space-y-5 p-6 pt-0">
              <div className="-mt-8 space-y-1">
                <h2
                  id="character-modal-title"
                  className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-wide"
                >
                  {person.name}
                </h2>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    borderColor: getSpeciesColor(speciesName),
                    color: getSpeciesColor(speciesName),
                  }}
                >
                  {speciesName}
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <dt className="text-[var(--ink-muted)]">Height</dt>
                <dd className="font-[family-name:var(--font-data)]">
                  {formatHeightInMeters(person.height)}
                </dd>

                <dt className="text-[var(--ink-muted)]">Mass</dt>
                <dd className="font-[family-name:var(--font-data)]">
                  {formatMassInKg(person.mass)}
                </dd>

                <dt className="text-[var(--ink-muted)]">Birth Year</dt>
                <dd className="font-[family-name:var(--font-data)]">
                  {formatBirthYear(person.birth_year)}
                </dd>

                <dt className="text-[var(--ink-muted)]">Created</dt>
                <dd className="font-[family-name:var(--font-data)]">
                  {formatCreatedDate(person.created)}
                </dd>

                <dt className="text-[var(--ink-muted)]">Films</dt>
                <dd className="font-[family-name:var(--font-data)]">{person.films.length}</dd>
              </dl>

              <div className="border-t border-[var(--border-hairline)] pt-4">
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-widest text-[var(--ink-muted)]">
                  Homeworld
                </h3>
                <HomeworldPanel homeworldUrl={person.homeworld} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
