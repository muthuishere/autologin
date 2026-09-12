# Contributing

A Chrome (MV3) extension, bundled with Bun, packaged as a zip you load unpacked. There is
no automated test suite today — testing means loading the built extension in a real
browser and exercising it.

## Building

```bash
bun install
bun run build      # bundles into dist/
```

`make` (`Makefile`) wraps this into `clean build zip`, producing
`releases/autologin-mv3.zip` — the same artifact the README tells users to download.
If your change affects packaging (`manifest.json`, what gets copied into `dist/`), build
the zip and load *that* unpacked, not the raw `dist/` folder — the two aren't always
equivalent, and a packaging bug can hide until you test the actual artifact a user gets.

## Testing a change

1. `bun run build`
2. `chrome://extensions` → enable Developer mode → "Load unpacked" → select `dist/`
3. Exercise the actual login flow you changed on a real site.

There's no CI here, so this manual pass is the only check a PR gets before review —
be explicit in the PR description about exactly what you tested and on which site(s).

## What a good PR looks like

- **Reproduce first.** If you're fixing a bug, say what you did to see it happen and what
  you saw — "encrypted credential storage" and "automatic login" are both places where a
  vague "it doesn't work" report is nearly unfixable without a repro.
- **Small.** This is a single-purpose extension; a PR that changes unrelated files makes
  review slower for no benefit.
- **Manifest changes need extra care.** `manifest.json` permissions are the most
  security-sensitive surface in this repo — a permissions change should explain why it's
  needed, not just that it makes something work.

## Filing an issue

Say which Chrome version and OS you're on, and whether you loaded the release zip
(`releases/autologin-mv3.zip` / `autologin-mv2.zip`) or built from source — several past
issues here turned out to be a source-vs-release-zip mixup, not a real bug.
