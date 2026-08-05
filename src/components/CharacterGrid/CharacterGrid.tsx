import { AnimatePresence } from 'framer-motion';
import { CharacterCard } from '@/components/CharacterCard/CharacterCard';
import { extractIdFromUrl } from '@/utils/resource';
import type { SwapiPerson } from '@/types/swapi';

interface CharacterGridProps {
  people: SwapiPerson[];
  speciesNameByPersonUrl: Map<string, string>;
  onOpen: (person: SwapiPerson) => void;
  /** Optional prefetch trigger, fired when a card is hovered/focused. */
  onHoverCharacter?: (person: SwapiPerson) => void;
}

export function CharacterGrid({
  people,
  speciesNameByPersonUrl,
  onOpen,
  onHoverCharacter,
}: CharacterGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <AnimatePresence mode="popLayout">
        {people.map((person) => (
          <CharacterCard
            key={extractIdFromUrl(person.url)}
            person={person}
            speciesName={speciesNameByPersonUrl.get(person.url) ?? 'Human'}
            onOpen={onOpen}
            onHover={onHoverCharacter}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
