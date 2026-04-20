# Linky Design QA Checklist

## Visual Consistency
- [ ] All primary CTA buttons use `colors.primary` and high-contrast text.
- [ ] Screen backgrounds use `colors.background` and card surfaces use `colors.surface` or `colors.surfaceElevated`.
- [ ] Header typography hierarchy is consistent (title + supportive subtitle).
- [ ] Border radii are consistent by level (cards: 14-18, chips: 20+, icons: 12-22).
- [ ] Tag/chip style is consistent across Capture, Board, Search, and Settings.

## Light / Dark Mode
- [ ] `StatusBar` style switches correctly by color scheme.
- [ ] Text contrast meets readability in both light and dark mode.
- [ ] Empty state and onboarding remain readable with no washed-out tokens.
- [ ] Bottom sheet fields and controls are visually clear in both themes.

## Interaction Quality
- [ ] Capture empty state CTA opens idea input sheet.
- [ ] Header sparkles button opens onboarding.
- [ ] Onboarding progress bar and step transitions work end-to-end.
- [ ] Board search mode has clear open/close behavior and reset.
- [ ] Search filters remain responsive and visually distinct when active.

## Content & UX Clarity
- [ ] Brand promise appears clearly on first capture entry.
- [ ] The 3 key value props are visible: derived ideas, SEO titles, auto categorization.
- [ ] Empty states give actionable next steps.
- [ ] Settings labels are concise and easy to scan.

## Accessibility Baseline
- [ ] Interactive icons have accessibility labels.
- [ ] Tap targets are at least ~44px on key actions.
- [ ] Important controls are keyboard-safe inside bottom sheet.
- [ ] Color is not the only indicator for selected/active state.

## Release Smoke Test
- [ ] iOS simulator: tabs, onboarding, sheet, search, and category flow.
- [ ] Android emulator: bottom sheet keyboard behavior and tab safe area.
- [ ] No lint errors in modified files.
