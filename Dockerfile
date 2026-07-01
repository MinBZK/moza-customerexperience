# Statische persona-site (MijnOverheid Zakelijk) achter een non-root nginx.
# nginx-unprivileged serveert standaard op poort 8080 als niet-root gebruiker,
# wat aansluit op de ZAD-component "cx" (Inbound: 8080) en op clusters die
# non-root / read-only afdwingen.
FROM nginxinc/nginx-unprivileged:alpine

COPY --chown=nginx:nginx . /usr/share/nginx/html/

EXPOSE 8080
