# pi-exit-resume

`pi-exit-resume` copies a Pi resume command to your clipboard when the current Pi session shuts down with `reason: "quit"`.

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

On `session_shutdown` with `reason: "quit"`, it copies:

```bash
pi --session <session-id>
```

The session id comes from Pi's current `ctx.sessionManager`. If no resume command can be built, nothing is copied.

## Disable

Remove `pi-exit-resume` from Pi packages.

## Development

```bash
npm run typecheck
npm run lint
npm run format:check
```
