# WG-Easy comes as two images, built from this file with --target:
#
#   config   (default)  Writes the configuration and nothing else: no WireGuard tools, no shell,
#                       no package manager, no sudo. Distroless, runs as an unprivileged user.
#   managed             Also brings the interface up with wg-quick and nftables. It runs as
#                       root inside its rootless user namespace, with only NET_ADMIN.
#
#   podman build --target config  -t localhost/wg-easy:config  .
#   podman build --target managed -t localhost/wg-easy:managed .
#
# Both run nothing but `node dist/lib/main.js`, and write only to /opt/wg: they work on a
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

# ---------- managed: wg-quick, wireguard-go and nftables, nothing else ----------
FROM docker.io/library/node:${NODE_VERSION}-alpine AS managed

ARG REPO_URL
LABEL org.opencontainers.image.title="WG-Easy (managed)" \
      org.opencontainers.image.description="WireGuard configuration UI that also manages the interface" \
      org.opencontainers.image.authors="Giuseppe Rocco" \
      org.opencontainers.image.licenses="CC BY-NC-SA 4.0" \
      org.opencontainers.image.source=$REPO_URL

# wireguard-go is the fallback wg-quick uses when the kernel can't create a WireGuard
# interface. npm and its cache are removed: the image runs node, not npm.
RUN apk add --no-cache wireguard-tools wireguard-go nftables && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
           /usr/local/lib/node_modules/corepack /usr/local/bin/corepack \
           /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg /root/.npm /tmp/* && \
    install -d -m 700 /opt/wg
COPY --from=builder /opt/wg-easy/dist /opt/wg-easy/dist

ENV NODE_ENV=production \
    WG_PATH=/opt/wg

# wg-quick refuses to run as anyone but root, and re-executes itself through sudo otherwise.
# There is no sudo here: the process is root of its user namespace, which under rootless
# Podman is the unprivileged user who started the container.
USER 0
WORKDIR /opt/wg-easy
EXPOSE 3000/tcp 51820/udp

ENTRYPOINT ["node"]
CMD ["/opt/wg-easy/dist/lib/main.js"]

# ---------- config: distroless, unprivileged, last so it is the default target ----------
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12:nonroot AS config

ARG REPO_URL
LABEL org.opencontainers.image.title="WG-Easy" \
      org.opencontainers.image.description="WireGuard configuration UI, for hosts that run the interface themselves" \
      org.opencontainers.image.authors="Giuseppe Rocco" \
      org.opencontainers.image.licenses="CC BY-NC-SA 4.0" \
      org.opencontainers.image.source=$REPO_URL

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
