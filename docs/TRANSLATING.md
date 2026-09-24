# Translation and localization

The current release is English-only. Most of the intended initial audience reads Hebrew natively and can also read English. Translation should preserve the playful tone and optional insight, not turn the experience into a textbook.

## Ready-to-copy instruction for any coding assistant

> Read AGENTS.md and docs/ARCHITECTURE.md. Visitor-facing words live in index.html (page structure and dialogs) and in each room definition, src/rooms/*/room.js. Translate all visitor-facing material into [LANGUAGE], including room labels, presets, controls, hints, explanations, dialogs, image labels, error/toast text, accessibility labels, page title and description, and shared settings descriptions. Keep program identifiers, room IDs, URL parameter keys, numeric values, and mathematical behavior unchanged. Set the HTML language correctly and choose an appropriate narration locale. Preserve a complete English copy or add a simple language selector. Explain what you changed, and check every room on desktop and mobile.

## Hebrew / Arabic and other right-to-left languages

- Set the appropriate lang and dir on the document or localized container (Hebrew: lang="he", dir="rtl").
- Replace layout-dependent left/right CSS with logical properties where appropriate. Check navigation, control alignment, dialogs, toolbars, and narrow screens rather than blindly mirroring every visual.
- Keep formulas, coordinate labels, URLs, code, and technical number expressions in isolated left-to-right spans (for example dir="ltr" and unicode-bidi:isolate).
- Keep the mathematics and motion geometry unchanged. A language switch should not reverse a simulation.
- Decide intentionally how sliders and arrow-key navigation should behave. Test that the visible value and direction remain understandable.
- Canvas labels must be translated too. Set canvas text direction/alignment explicitly where needed; document direction alone does not localize drawn text.
- Narration currently uses en-US. Update it for the language; if a suitable voice is missing, keep the text readable and handle speech failure gracefully.
- Ask a native speaker to review tone, line wrapping, mixed-direction text, and mathematical terminology.

Localization is guidance, not an implemented feature. The mathematics already lives apart from the words (src/rooms/*/model.js has no visitor-facing text). A next step is to move each room's words into per-language dictionaries and add a language selector.
