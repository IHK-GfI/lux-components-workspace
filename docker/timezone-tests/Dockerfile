# Image zum Ausführen der Vitest-Tests der lux-components-lib in verschiedenen Zeitzonen.
#
# Hintergrund: Der CI-Runner läuft in UTC. Die Tests laufen unter Vitest in Node (jsdom), dort wirkt die
# Umgebungsvariable TZ. Dieser Container (Linux mit tzdata und vollständigen ICU-Daten) führt dieselben Tests
# nacheinander in mehreren Zeitzonen aus, sodass Zeitzonenfehler bei Datumswerten auffallen
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

# tzdata für die Zeitzonen (TZ) und icu-data-full für Intl bzw. toLocale*String()
RUN apk add --no-cache tzdata icu-data-full

ENV NG_CLI_ANALYTICS=false \
    NPM_CONFIG_UPDATE_NOTIFIER=false

COPY run-tests.sh /opt/lux-timezone-tests/

# Zeilenenden normalisieren, da ein Checkout unter Windows CRLF liefern kann
RUN sed -i 's/\r$//' /opt/lux-timezone-tests/run-tests.sh \
    && chmod +x /opt/lux-timezone-tests/run-tests.sh

WORKDIR /work

ENTRYPOINT ["/opt/lux-timezone-tests/run-tests.sh"]
