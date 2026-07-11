# Reeme Guest House Digital Presence — Project Rules

This document outlines the project-scoped design rules, color scheme variables, and coding standards for Reeme Guest House. All updates to code files must adhere to these directives.

---

## 🎨 Theme: Warm Earth & Terracotta (Option A)

To create a cozy, premium, welcoming atmosphere appropriate for a high-end guest house, the site is designed with organic warm tones:

* **Base Surface (`background` / `surface`):** `#F5F2EB` — Warm, luxurious sand-clay tone. All neomorphic surfaces share this exact hex value.
* **Main Text (`on-surface`):** `#2D2722` — Deep espresso charcoal for optimal readability and high-end contrast.
* **Secondary Text (`on-surface-variant`):** `#6E6259` — Muted earth grey for subtitles and decorative texts.
* **Primary Accent (`primary`):** `#A76B46` — Rich terracotta. Used for primary focus elements, tag backgrounds, and main CTAs.
* **Secondary Accent (`secondary`):** `#C5A059` — Satin gold / brushed brass. Used for highlights, stars, specific icons, and decorative subtitles.

### Neomorphic Shadow Tokens
For the neomorphic effect to remain warm and cohesive on the `#F5F2EB` sand surface:
* **Raised Shadows:** 
  `box-shadow: 6px 6px 12px rgba(140, 110, 80, 0.08), -6px -6px 12px rgba(255, 255, 255, 0.85);`
* **Inset Shadows:** 
  `box-shadow: inset 4px 4px 8px rgba(140, 110, 80, 0.06), inset -4px -4px 8px rgba(255, 255, 255, 0.8);`
* **Contrast Borders:** 
  All neomorphic interactive elements (buttons, inputs, sliders) must have a subtle border (`1px solid rgba(167, 107, 70, 0.15)`) to improve accessibility.

---

## 🏛️ Code & Layout Rules
1. **Multi-Page Architecture:** Separate the website sections into dedicated pages (index.html for home, about.html for About Us, rooms.html for Accommodations, and contact.html for Contact Us). Each page must import the shared navigation header and footer.
2. **Clean Syntax:** Never permit stray Markdown code fences (e.g., ````html` or ```` `) in final HTML code files.
3. **Typography:** Use the font `Plus Jakarta Sans` across all headings, body copies, and button labels. Avoid pure bold weights; favor medium and semibold weights.
4. **Tailwind Config:** Maintain the tailwind config object dynamically inside the index.html head. Overwrite the colors in the `extend` block.
