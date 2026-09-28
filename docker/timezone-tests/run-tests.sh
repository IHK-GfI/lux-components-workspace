#!/bin/sh
# Führt die Karma-Tests der lux-components-lib in mehreren Zeitzonen aus (Aufruf siehe Dockerfile).
set -e

TIMEZONES="${TIMEZONES:-UTC Europe/Berlin Etc/GMT+12 Pacific/Kiritimati}"
KARMA_CONFIG=/opt/lux-timezone-tests/karma.conf.js

# Farben für die Konsolenausgabe (abschaltbar mit -e NO_COLOR=1)
if [ -z "$NO_COLOR" ]; then
  GREEN=$(printf '\033[32m')
  RED=$(printf '\033[31m')
  RESET=$(printf '\033[0m')
else
  GREEN=''
  RED=''
  RESET=''
fi

if [ ! -f /src/package.json ]; then
  echo "Der Workspace muss nach /src eingebunden werden, z.B. -v \"\${PWD}:/src:ro\"." >&2
  exit 1
fi

echo "Workspace kopieren ..."
cd /src
tar --exclude=node_modules --exclude=.angular --exclude=.git \
  --exclude=./dist/lux-components-lib-coverage --exclude=./dist/demo-app --exclude=./dist/test-out \
  -cf - . | tar -xf - -C /work
cd /work

# Abhängigkeiten nur neu installieren, wenn sich package.json bzw. package-lock.json geändert haben
DEPS_HASH_FILE=node_modules/.cache/lux-timezone-tests-deps-hash
DEPS_HASH=$(cat package.json package-lock.json projects/*/package.json | sha1sum | cut -d ' ' -f 1)
if [ "$(cat "$DEPS_HASH_FILE" 2>/dev/null)" != "$DEPS_HASH" ]; then
  echo "Abhängigkeiten installieren ..."
  npm install --ignore-scripts --no-audit --no-fund
  mkdir -p "$(dirname "$DEPS_HASH_FILE")"
  echo "$DEPS_HASH" > "$DEPS_HASH_FILE"
fi

# Die Karma-Konfiguration bindet das Theme aus dist ein und die Specs importieren die test-utils aus dist
if [ ! -d dist/theme ]; then
  npm run pack:theme
fi
if [ ! -d dist/lux-components-lib ]; then
  npm run pack:components
fi

# Specs: ohne Argumente die Datums-Specs, mit "all" alle Specs, sonst die übergebenen Specs
if [ "$#" -eq 0 ]; then
  set -- 'src/lib/lux-util/**/*.spec.ts' \
    'src/lib/lux-form/lux-datepicker-ac/**/*.spec.ts' \
    'src/lib/lux-form/lux-datetimepicker-ac/**/*.spec.ts' \
    'src/lib/lux-form/lux-timepicker/**/*.spec.ts' \
    'src/lib/lux-lookup/**/*.spec.ts'
fi
INCLUDES=''
if [ "$1" != 'all' ]; then
  for spec in "$@"; do
    INCLUDES="$INCLUDES --include=$spec"
  done
fi

# Globs in INCLUDES sollen unverändert an ng test übergeben werden
set -f

FAILED=''
for tz in $TIMEZONES; do
  echo ""
  echo "${GREEN}===== Zeitzone: $tz, aktuell $(TZ="$tz" date '+%d.%m.%Y %H:%M:%S %Z (UTC%z)') =====${RESET}"
  if ! TZ="$tz" npx ng test lux-components-lib --watch=false --karma-config="$KARMA_CONFIG" $INCLUDES; then
    FAILED="$FAILED $tz"
  fi
done

echo ""
echo ""
if [ -n "$FAILED" ]; then
  echo "${RED}Fehlgeschlagen in:$FAILED${RESET}" >&2
  echo ""
  exit 1
fi

echo "${GREEN}Alle Tests erfolgreich in: $TIMEZONES${RESET}"
echo ""
