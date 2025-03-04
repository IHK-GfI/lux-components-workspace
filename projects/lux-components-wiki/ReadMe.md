# ReadMe

## Prettier

```bash
npx prettier --write "**/*.md"
```

## Wiki lokal mit Docker ausführen

```bash
docker pull gollumwiki/gollum:v5.3.0
docker run -d --rm -p 8050:4567 -v $(pwd):/wiki gollumwiki/gollum:v5.3.0 --ref develop
```
