import { createContext, useContext, type ReactNode } from "react";
import { useTheme } from "./use-theme";
import type { EffectiveTheme, ThemePreference } from "./theme";

interface ThemeControl {
  preference: ThemePreference;
  resolved: EffectiveTheme;
  forcedDark: boolean;
  choose: (next: ThemePreference) => void;
}

/**
 * useTheme owns listeners and writes the document attribute, so it must run
 * exactly once. The nav renders in several routes and would otherwise mount a
 * second copy — hence a provider in the root and a context for everyone else.
 *
 * The default is inert rather than a thrown error: the nav is also rendered
 * by routes that mount it directly, and a missing provider should degrade to
 * a control that does nothing rather than take the page down.
 */
const ThemeContext = createContext<ThemeControl>({
  preference: "auto",
  resolved: "dark",
  forcedDark: false,
  choose: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={useTheme()}>{children}</ThemeContext.Provider>;
}

export const useThemeControl = () => useContext(ThemeContext);
