FROM gollumwiki/gollum:6.1.0

# Build-Args für Konfiguration
ARG GIT_USER_EMAIL="wiki@example.com"
ARG GIT_USER_NAME="Wiki"

# Labels für Metadaten
LABEL maintainer="your@example.com"
LABEL version="1.0"
LABEL description="Gollum Wiki mit flacher Dateistruktur"

USER root

WORKDIR /tmp/build

# Alles kopieren
COPY . /tmp/build/

# Flache Struktur erstellen und Berechtigungen setzen
RUN mkdir -p /wiki && \
    find /tmp/build \( -name "*.md" -o -name "*.png" -o -name "*.gif" \) -exec cp {} /wiki/ \; && \
    cd /wiki && \
    git init --initial-branch=main && \
    git config user.email "${GIT_USER_EMAIL}" && \
    git config user.name "${GIT_USER_NAME}" && \
    git add . && \
    git commit -m "Initial commit" && \
    rm -rf /tmp/build && \
    chown -R www-data:www-data /wiki && \
    chmod -R 755 /wiki

# Zu unprivilegiertem Benutzer wechseln
USER www-data

WORKDIR /wiki

EXPOSE 4567

# Healthcheck hinzufügen
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4567/ || exit 1

CMD ["--ref", "main", "--lenient-tag-lookup"]
