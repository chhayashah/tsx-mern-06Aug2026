import { motion } from 'framer-motion';
import { memo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { favoriteToggled } from '@/features/favorites/favoritesSlice';
import { getAvatarUrl } from '@/utils/avatar';
import { getSpeciesColor } from '@/utils/species';
import { extractIdFromUrl } from '@/utils/resource';
import type { SwapiPerson } from '@/types/swapi';

interface CharacterCardProps {
  person: SwapiPerson;
  speciesName: string;
  onOpen: (person: SwapiPerson) => void;
  /** Optional prefetch trigger — fired on hover/focus, before the modal opens. */
  onHover?: (person: SwapiPerson) => void;
}

function CharacterCardImpl({ person, speciesName, onOpen, onHover }: CharacterCardProps) {
  const dispatch = useAppDispatch();
  const id = extractIdFromUrl(person.url);
  const isFavorite = useAppSelector((state) => state.favorites.ids.includes(id));
  const speciesColor = getSpeciesColor(speciesName);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      whileHover={{ y: -6, scale: 1.025, rotate: -0.6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="group relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-sm transition-shadow duration-200 hover:shadow-[0_18px_40px_-14px_var(--card-shadow-color)]"
      style={{ '--card-shadow-color': speciesColor } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={() => onOpen(person)}
        onMouseEnter={() => onHover?.(person)}
        onFocus={() => onHover?.(person)}
        aria-label={`View details for ${person.name}`}
        className="block w-full text-left"
      >
        {/* HUD corner brackets — the card's signature framing device */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 opacity-0 transition-opacity duration-200 group-hover:opacity-80"
          style={{ borderColor: speciesColor }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 opacity-0 transition-opacity duration-200 group-hover:opacity-80"
          style={{ borderColor: speciesColor }}
        />

        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={getAvatarUrl(person.name)}
            alt=""
            loading="lazy"
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent opacity-90" />

          {/* Scanline sweep on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/25 to-transparent opacity-0 [animation-play-state:paused] group-hover:animate-scanline group-hover:opacity-100"
          />
        </div>

        <div className="space-y-2 p-4">
          <h3 className="truncate font-[family-name:var(--font-display)] text-base font-semibold tracking-wide text-[var(--ink-primary)]">
            {person.name}
          </h3>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
            style={{ borderColor: speciesColor, color: speciesColor }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: speciesColor }} />
            {speciesName}
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          dispatch(favoriteToggled(id));
        }}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite ? `Remove ${person.name} from favorites` : `Add ${person.name} to favorites`
        }
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-lg text-[var(--color-signal-400)] backdrop-blur transition-transform hover:scale-110"
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </motion.article>
  );
}

export const CharacterCard = memo(CharacterCardImpl);
