#############################
# Stage 1: Dependencies
# Ziel: Deterministische Installation (npm ci) mit Cache-Effekt
#############################
FROM node:24-alpine AS deps
LABEL maintainer="thomas.dickhut@gfi.ihk.de"

WORKDIR /app

## Nur Manifest-Dateien für Cache-Effizienz
COPY package.json package-lock.json ./
# Workspaces (nur relevante package.json Dateien für Cache):
COPY projects/lux-components-lib/package.json projects/lux-components-lib/
COPY projects/lux-components-theme/package.json projects/lux-components-theme/
COPY projects/lux-components-update/package.json projects/lux-components-update/

RUN npm ci --ignore-scripts

#############################
# Stage 2: Build
#############################
FROM node:24-alpine AS build
WORKDIR /app

# node-gyp / build toolchain minimal (nur falls benötigt). Entfernen wenn überflüssig:
RUN apk add --no-cache python3 make g++

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Entferne ggf. prepare-Skript (wie im alten Dockerfile)
RUN npm pkg delete scripts.prepare || true

# Build der Demo-App (Production-Konfiguration) – direkter CLI-Aufruf
RUN set -eux; \
    ls -l node_modules/.bin | grep ng || true; \
    chmod +x node_modules/.bin/ng || true; \
    head -n1 node_modules/.bin/ng || true; \
    node node_modules/@angular/cli/bin/ng build demo-app --configuration production;

#############################
# Stage 3: Runtime
#############################
FROM nginx:stable-alpine3.23-slim
LABEL maintainer="thomas.dickhut@gfi.ihk.de"
EXPOSE 8080

# Sicherheitsupdates für Alpine Basis
# alpine-baselayout wird ausgeschlossen: Das Upgrade versucht /var/run in einen Symlink
# umzuwandeln, was in Kubernetes-Pods mit gemounteten Service-Account-Tokens fehlschlägt.
RUN apk update \
    && apk upgrade --no-cache --ignore alpine-baselayout --ignore alpine-baselayout-data

# Nginx-Verzeichnisse erstellen und Berechtigungen setzen (kombiniert für weniger Layer)
RUN mkdir -p /run/nginx /var/www/html /var/cache/nginx /var/log/nginx /var/lib/nginx/logs \
    && chown -R 1000:1000 /var/lib/nginx /var/cache/nginx /var/log/nginx /run/nginx

# Konfiguration kopieren
COPY nginx.conf /etc/nginx/nginx.conf

# Statischer Build-Output (Ownership direkt setzen, spart separates chown)
COPY --chown=1000:1000 --from=build /app/dist/demo-app/browser /var/www/html/
COPY --chown=1000:1000 --from=build /app/dist/demo-app/3rdpartylicenses.txt /var/www/html/

USER 1000:1000
WORKDIR /var/www/html

# Healthcheck für Kubernetes/Container-Orchestrierung
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q -O /dev/null http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]