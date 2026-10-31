# identityOS MCP server

Give any AI assistant the identityOS reading tools: **cardology** (birth cards, spreads, daily pulls, compatibility) today, with **astrology, Human Design, Gene Keys, numerology, feng shui and BaZi** on the same server as they launch.

- Hosted MCP server: `https://identityos.xyz/mcp` (Streamable HTTP, no key needed for the free tier)
- Docs: https://identityos.xyz/docs
- REST API and OpenAPI 3.1: https://identityos.xyz/docs/rest

All readings are computed by the hosted identityOS service. This repository is only a small, dependency-free bridge for clients that run local (stdio) MCP servers. It contains no engine code.

## Connect

Most clients can use the hosted URL directly. No install needed.

**Claude Code**
```bash
claude mcp add --transport http identityos https://identityos.xyz/mcp
```

**Cursor** (`~/.cursor/mcp.json`) / **Windsurf** (`serverUrl`) / **VS Code** (`.vscode/mcp.json`, `"type": "http"`)
```json
{ "mcpServers": { "identityos": { "url": "https://identityos.xyz/mcp" } } }
```

**Claude and ChatGPT apps**: add a custom connector with the URL `https://identityos.xyz/mcp`.

**Clients that only run local servers**: use this package.
```json
{
  "mcpServers": {
    "identityos": {
      "command": "npx",
      "args": ["-y", "identityos-mcp"],
      "env": { "IDENTITYOS_API_KEY": "optional" }
    }
  }
}
```

Setup for every client: https://identityos.xyz/docs/mcp

## Tools

| Tool | What it does | Status |
|---|---|---|
| `cardology_birth_card` | Birth card and planetary ruling card from month and day | Live |
| `cardology_card_meaning` | Meaning of any playing card | Live |
| `cardology_card_pull` | Card of the day, week or month by a three-cut pull | Live |
| `cardology_spreads` | Life, spiritual and cosmic spreads, karma cards, yearly spreads | Live |
| `cardology_compatibility` | Two birthdays or two cards, both directions | Live |
| `natal_chart`, `sky_now`, `astro_transits` | Astrology | Planned |
| `hd_chart`, `hd_gate`, `hd_center`, `hd_transits` | Human Design | Planned |
| `gene_keys_profile`, `gene_keys_text` | Gene Keys | Planned |
| `numerology_profile`, `numerology_personal_year` | Numerology | Planned |
| `feng_shui_kua`, `feng_shui_flying_stars` | Feng shui | Planned |
| `bazi_chart`, `bazi_luck_pillars` | BaZi (Four Pillars) | Planned |
| `polarity_profile`, `elemental_balance` | Analysis across systems | Planned |

Every tool is read-only (`readOnlyHint: true`). Full reference: https://identityos.xyz/docs/tools

## Keys and limits

No key: 20 calls per minute. A free key: 60. A standard key: 600. Send it as `Authorization: Bearer <key>` (or set `IDENTITYOS_API_KEY` for this bridge). Ask for a key at hello@identityos.xyz.

## Privacy

Send only what a tool needs (a birth card needs month and day). The gateway does not log the inputs to a call. Readings are for reflection and entertainment, not medical, legal, financial or psychological advice. Privacy: https://identityos.xyz/privacy · Terms: https://identityos.xyz/terms

## Environment

| Variable | Default | |
|---|---|---|
| `IDENTITYOS_API_KEY` | none | Optional; raises the rate limit |
| `IDENTITYOS_MCP_URL` | `https://identityos.xyz/mcp` | Override for testing |

## License

MIT
