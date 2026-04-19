# CATAN Custom Uitbreiding Configurator

Mobile-first React web-app voor het configureren van een custom Catan-uitbreiding.

## Features

- **⚙️ Configurator** — Toggle spelregels per categorie, presets, eigen regels, QR-code deellink
- **🖨️ Printlijst** — Dynamische 3D-printlijst met STL-links en filament-schatting per kleur
- **🎲 Start Spel** — Stap-voor-stap setup wizard op basis van actieve regels
- **🎮 Speelhulp** — Bank-tracker, beurt-timer, "wat kan ik bouwen?", seizoenswissel, random events
- **📜 Spelregels** — Gegenereerd regeloverzicht met downloadbare .md export

Alle tekst in het Nederlands. Staat in localStorage.

## Ontwikkelen

```bash
npm install
npm run dev      # dev server
npm run build    # productie build
npm run preview  # serve build
```

De dynamische spelnaam past zich realtime aan op basis van welke modules actief zijn (van *CATAN: Onontdekt* tot *CATAN: De Archipel — Complete Editie*).
