# Home dummy data

The Home screen reads its editable sample content from this folder.

- `home-user.json` controls the greeting, location, and notification dot.
- `home-sports.json` controls the horizontal sport selector.
- `home-open-matches.json` controls the **Open matches nearby** cards.
- `home-arenas.json` controls the **Nearby arenas** cards.

Each record has an `id`. Keep IDs unique, and ensure each arena or match
`sportId` exists in `home-sports.json`. Save the JSON, then reload Expo to see
the change. Prices are plain numbers in PKR, such as `6000`.
