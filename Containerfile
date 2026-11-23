# WG-Easy, configuration only: writes the configuration and nothing else. No WireGuard tools,
# no shell, no package manager, no sudo. Distroless, runs as an unprivileged user.
#
#   podman build -t localhost/wg-easy:config .
#
# The image that also manages the interface: Containerfile.managed
#
# It runs nothing but `node dist/lib/main.js` and writes only to /opt/wg, so it works on a
# read-only root filesystem.

ARG NODE_VERSION=22

# ---------- Build: the web interface, and a server bundled with all its dependencies ----------
FROM docker.io/library/node:${NODE_VERSION}-alpine AS builder

WORKDIR /opt/wg-easy
COPY ./src/package*.json ./
RUN npm install

COPY ./src ./
RUN npm run build && \
    install -d -m 700 /rootfs/opt/wg

# ---------- Runtime: distroless, unprivileged ----------
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12:nonroot

ARG REPO_URL REVISION
LABEL org.opencontainers.image.title="WG-Easy" \
      org.opencontainers.image.description="WireGuard configuration UI, for hosts that run the interface themselves" \
      org.opencontainers.image.authors="Giuseppe Rocco" \
      org.opencontainers.image.licenses="CC BY-NC-SA 4.0" \
      org.opencontainers.image.source=$REPO_URL \
      org.opencontainers.image.revision=$REVISION

# COPY doesn't keep the owner: the data directory is handed to the runtime user here.
COPY --from=builder --chown=1000:1000 /rootfs/opt/wg /opt/wg
COPY --from=builder /opt/wg-easy/dist /opt/wg-easy/dist

ENV NODE_ENV=production \
    WG_PATH=/opt/wg

USER 1000:1000
WORKDIR /opt/wg-easy
EXPOSE 3000/tcp

ENTRYPOINT ["/nodejs/bin/node"]
CMD ["/opt/wg-easy/dist/lib/main.js"]
