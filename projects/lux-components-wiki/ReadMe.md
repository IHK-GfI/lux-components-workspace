# ReadMe

## Prettier

```bash
npx prettier --write "**/*.md"
```

## Wiki lokal mit Podman ausführen

```bash
podman build -f projects/lux-components-wiki/Dockerfile -t lux-components-wiki projects/lux-components-wiki
podman run --rm -p 8050:4567 lux-components-wiki
http://localhost:8050/
```
