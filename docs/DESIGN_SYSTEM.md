# Organic Synthesis Atelier

AnilineProduction Lab · RagabLabs · UI release 2.0.0

## Layout and identity

The homepage uses a journal-like composition: a large editorial title alongside an interactive reaction notebook. The calculator directory is a ruled research index organized into the five existing scientific groups. Each chapter has its own structural illustration and explanatory introduction.

The two reaction stages use actual buttons with a selected state, a live description and working links to related calculators. The full benzene → nitrobenzene → aniline route remains visible while the selected stage expands into two molecular structures and its balanced equation.

The calculator layout is the **Synthesis Research Workspace**. A searchable desktop index, numbered section navigation, a reaction plate, a wide input form and a result dossier establish a clear reading order. Assumptions, references, balances, solution steps, plots and exports remain attached to each calculation.

Tailwind class discovery is restricted to `src/` through the CSS source directive. Documentation and test reports cannot introduce additional utilities into a release build.

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| Warm Ivory | `#FAF8F2` | Page background |
| Amber Gold | `#C48A3A` | Small accents, graph marks |
| Olive Green | `#617A48` | Scientific rules, structural details |
| Deep Charcoal | `#28332D` | Main text |
| Soft Sage | `#E8EDE2` | Primary findings and selected sections |
| Laboratory White | `#FFFFFF` | Paper, fields and panels |
| Olive ink | `#445A2D` | Buttons, links and small olive text |
| Amber ink | `#80561F` | Focus indicators and small amber text |
| Muted ink | `#55604F` | Supporting text |
| Graph amber | `#A56E25` | Gold-related graph bars with non-text contrast above 3:1 |
| Control border | `#849179` | Input and button boundaries |

Gold is a decorative accent. Graph marks that need a distinct boundary use the darker graph amber. The base olive is not used for small low-contrast body text. Darker ink variants provide contrast on light surfaces. Chart groups use olive, amber, sage-related green and charcoal, with dashed secondary series as an additional distinction.

## Typography

All fonts are bundled locally. Arabic uses **IBM Plex Sans Arabic** at weights 400, 500, 600 and 700. English uses **Inter** at the same weights. **KaTeX** supplies mathematical and chemical notation. Cairo is no longer imported by the UI; its existing package and notice remain in the dependency record.

| Role | CSS size |
| --- | --- |
| Main homepage title | 48–60 px |
| Major section heading | 30–36 px, responsive variants |
| Calculator title | 29–30 px |
| Workspace panel heading | 27–30 px |
| Secondary heading | 21–24 px |
| Body text | 18 px |
| Input label | 18 px |
| Numeric input | 19 px |
| Primary finding | 36–42 px; 37–39 px on narrow phones |
| Chemical equation | 22–24 px |
| Supporting text | 15–18 px |

Chemical charges, subscripts and the decorative notebook seal use smaller scientific or logotype notation. They are not body-copy styles. Arabic headings use a larger line height to preserve marks and letterforms. The English product title has a natural word-break opportunity between Aniline and Production on narrow screens.

## Structure drawing rules

- Benzene has a six-membered ring with alternating double bonds.
- Nitrobenzene shows the charge-separated nitro group, N⁺ with one double-bonded O and one O⁻.
- Aniline shows the ring-bound nitrogen with two hydrogens.
- Nitric acid is shown as HO–N⁺(=O)–O⁻.
- Sulfuric acid is shown as HO–S(=O)₂–OH.
- Hydrogen is shown as H–H.
- All chemical SVGs and equations have an explicit LTR direction in both interface languages. Arabic labels retain Arabic shaping.
- Process arrows connect reaction stages. They are distinct from covalent bonds.

These are original code-based SVG illustrations. No raster chemistry artwork or runtime image service is required.

## Responsive behavior

| Width | Homepage | Calculator |
| --- | --- | --- |
| 1440 px | Editorial two-column hero, notebook and chapter index | Searchable sidebar, input/result columns |
| 1024 px | Two-column hero with tighter spacing | Grouped calculator picker, input/result columns |
| 768 px | Stacked hero, generous molecular drawings | Stacked workspace, two-column input fields |
| 390 px | Large title, two-stage notebook, vertical index | One-column fields; full-width primary findings |
| 360 px | Natural title breaks; readable formulas | Wide controls, two-column section navigation, single-column secondary findings |

Large scientific tables, long equations and the integrated process diagram scroll inside their own regions. They do not widen the document. Overflowing regions receive a keyboard focus stop automatically. PDF equations wrap at KaTeX expression boundaries to fit the original print width.

## Interaction and accessibility

- A keyboard-visible skip link moves focus into the laboratory without modifying SPA routing.
- Language and category choices expose their selected state.
- The active calculator has `aria-current="page"`.
- Search is available in both the homepage index and desktop workspace navigation; a grouped native picker supports narrower screens.
- Section buttons move both scroll position and focus to the target.
- Invalid fields are identified, described by the error message and focused after calculation fails.
- Existing stale-result export guards are retained.
- The offscreen PDF source is inert and excluded from the tab sequence.
- Focus indicators use a dark amber outline; controls are generous touch targets.
- Motion is limited to short feedback and scrolling. Reduced-motion preferences remove animation and smooth scrolling.

Accessibility references: [W3C contrast guidance](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) and [W3C resize-text guidance](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html). Executed automated audits and their boundaries are recorded in [TESTING.md](TESTING.md).
