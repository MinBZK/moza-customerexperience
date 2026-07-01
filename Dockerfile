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

COPY . /public

ENV SERVER_ROOT=/public \
    SERVER_HOST=0.0.0.0 \
    SERVER_PORT=8080

EXPOSE 8080
