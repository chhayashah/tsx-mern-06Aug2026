/**
 * SWAPI resources are identified only by their URL, e.g.
 * "https://swapi.dev/api/people/4/" -> "4". Every list item, cache tag and
 * React key derives its identity from this helper so the id logic lives in
 * exactly one place.
 */
export function extractIdFromUrl(url: string): string {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? match[1] : url;
}
