/**
 * Alt text for client website screenshots.
 *
 * Every showcase image used to read "<Client> website designed by VDT Sites",
 * which describes the frame and not the business. Image search and the AI
 * assistants that summarise us read alt text, so the trade and the town are
 * the parts worth carrying: "clinical hypnotherapy in Nanaimo, BC" tells a
 * reader something, "landing page" does not.
 *
 * The descriptor comes from the card line or case-study kicker that is already
 * authored per client ("Coffee roaster · Nanaimo, BC"), so alt text cannot
 * drift away from the visible copy.
 */

/**
 * Build alt text from a client name and its "Trade · Place" descriptor line.
 *
 * A capitalised tail is a place and reads "in Nanaimo"; a lowercase one is a
 * second descriptor ("live scoreboards") and reads as a list. CEVA is the
 * case that needs this: its line has no city in it.
 */
export function siteShotAlt(name: string, line: string, suffix = ""): string {
  const [trade, tail] = line.split("·").map((s) => s.trim());
  // Casing is left as authored: lowercasing the lead word to make it read as
  // prose turns "Japanese imports" into "japanese imports".
  const joined = !tail
    ? trade
    : /^[A-Z]/.test(tail)
      ? // You are ON an island, IN a city.
        `${trade} ${/\bIslands?\b/.test(tail) ? "on" : "in"} ${tail}`
      : `${trade}, ${tail}`;
  const base = `${name} website by VDT Sites, ${joined}`;
  return suffix ? `${base}, ${suffix}` : base;
}
