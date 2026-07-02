# Statische persona-site (MijnOverheid Zakelijk).
#
# Het ODCN/OpenShift-cluster draait containers met een read-only root
# filesystem en een willekeurige non-root UID. nginx faalt daar omdat het bij
# het opstarten wil schrijven (/var/cache/nginx, pid, temp). static-web-server
# is een enkele Rust-binary die niets naar schijf schrijft, onder elke UID
# draait en correcte MIME-types levert (text/javascript voor de ES-module,
# font/woff2 voor de fonts) — nodig omdat de browser modules met een verkeerd
# MIME-type weigert.
FROM ghcr.io/static-web-server/static-web-server:2

# Zet de standaard cache-control van static-web-server (dagenlang) om naar
# 60s voor .html, zodat een gemerged fix niet pas na een harde refresh
# zichtbaar wordt. Losse COPY naar /config.toml zodat SERVER_CONFIG_FILE
# hierheen kan wijzen; config.toml mag NIET in .dockerignore staan, anders
# is het voor geen enkele COPY-instructie beschikbaar (zie fix-commit).
# static-web-server heeft geen shell om 'm na COPY . /public weer te
# verwijderen — hij komt dus ook mee als (onschuldig) statisch bestand.
COPY config.toml /config.toml
COPY . /public

ENV SERVER_ROOT=/public \
    SERVER_HOST=0.0.0.0 \
    SERVER_PORT=8080 \
    SERVER_CONFIG_FILE=/config.toml

EXPOSE 8080
