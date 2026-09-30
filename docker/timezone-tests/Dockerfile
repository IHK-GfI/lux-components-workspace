# Image zum Ausführen der Karma-Tests der lux-components-lib in verschiedenen Zeitzonen.
#
# Hintergrund: Chrome unter Windows ignoriert die Umgebungsvariable TZ und der CI-Runner läuft in UTC.
# In diesem Container (Linux + Chromium) wirkt TZ, sodass Zeitzonenfehler bei Datumswerten auffallen
# (z.B. lokale Zeit statt UTC, Umstellung auf Sommer- bzw. Winterzeit).
#
# Das Image enthält nur die Umgebung. Der Workspace wird beim Start eingebunden, sodass immer der aktuelle
# Stand getestet wird. Ein Neubau des Images ist nur bei Änderungen in diesem Verzeichnis nötig.
#
# Bauen (im Workspace-Verzeichnis):
#   podman build -t lux-timezone-tests docker/timezone-tests
#
# Starten (im Workspace-Verzeichnis, PowerShell):
#   podman run --rm -v "${PWD}:/src:ro" -v lux-timezone-tests-node-modules:/work/node_modules lux-timezone-tests
#
# Optionen:
#   -e TIMEZONES="Europe/Berlin Etc/GMT+12"                   Zeitzonen (Standard: UTC Europe/Berlin Etc/GMT+12 Pacific/Kiritimati)
#   lux-timezone-tests "src/lib/lux-util/**/*.spec.ts" ...    nur die angegebenen Specs (Standard: die Datums-Specs)
#   lux-timezone-tests all                                    alle Specs
#   -e NO_COLOR=1                                             Ausgabe ohne Farben
#
# Das Volume "lux-timezone-tests-node-modules" speichert die Abhängigkeiten zwischen den Läufen. Sie werden nur
# neu installiert, wenn sich package.json oder package-lock.json ändern. Der erste Lauf dauert daher länger.
# Fehlen dist/theme bzw. dist/lux-components-lib im Workspace, werden sie im Container gebaut.

ARG BASE_IMAGE=node:24-alpine
FROM ${BASE_IMAGE}

# Chromium für Karma, tzdata für die Zeitzonen (TZ) und icu-data-full für Intl bzw. toLocale*String()
RUN apk add --no-cache chromium tzdata icu-data-full

ENV CHROME_BIN=/usr/bin/chromium-browser \
    NG_CLI_ANALYTICS=false \
    NPM_CONFIG_UPDATE_NOTIFIER=false

# Unter Podman auf Windows läuft der Container im WSL-Kernel der Podman-Maschine. Die Karma-Launcher erkennen
# dadurch fälschlicherweise WSL und rufen wslpath auf. Der Stub gibt die Pfade unverändert zurück.
RUN printf '#!/bin/sh\nfor a in "$@"; do case "$a" in -*) ;; *) echo "$a" ;; esac; done\n' > /usr/local/bin/wslpath \
    && chmod +x /usr/local/bin/wslpath

COPY karma.conf.js run-tests.sh /opt/lux-timezone-tests/

# Zeilenenden normalisieren, da ein Checkout unter Windows CRLF liefern kann
RUN sed -i 's/\r$//' /opt/lux-timezone-tests/run-tests.sh \
    && chmod +x /opt/lux-timezone-tests/run-tests.sh

WORKDIR /work

ENTRYPOINT ["/opt/lux-timezone-tests/run-tests.sh"]
