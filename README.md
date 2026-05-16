# pi-exit-resume

`pi-exit-resume` copies the current Pi resume command to your clipboard when Pi exits.

## Install

```bash
pi install npm:pi-exit-resume
```

Or add it directly to Pi settings:

```json
{
  "packages": ["npm:pi-exit-resume"]
}
```

## What it does

When the current session quits, `pi-exit-resume` copies:

```bash
pi --session <session-id>
```

It also prints the copied command before Pi exits.

## Behavior

- Runs only on normal Pi quit shutdowns.
- Does not intercept `Ctrl+C`.
- Does not show a prompt.
- Does not copy anything for `/new`, `/resume`, `/fork`, `/clone`, or extension reload.

## Disable

Remove `pi-exit-resume` from Pi packages.

## Development

```bash
npm run typecheck
npm run lint
npm run format:check
```
