import { AVATAR_BASE_URL, AVATAR_SIZE } from '@/constants/app';

/** SWAPI has no images; picsum.photos returns the same image for a given seed. */
export function getAvatarUrl(characterName: string): string {
  const seed = encodeURIComponent(characterName.trim().toLowerCase());
  return `${AVATAR_BASE_URL}/${seed}/${AVATAR_SIZE}/${AVATAR_SIZE}`;
}
