# Build-time arguments
ARG REPO_URL

# Stage 1 -- Build
FROM docker.io/library/node:alpine AS builder

WORKDIR /opt/wg-easy
COPY ./src/package*.json ./
RUN npm install

COPY ./src ./
RUN npm run build

# Stage 2
FROM docker.io/library/node:alpine as base

# Metadata according to OCI standards
LABEL org.opencontainers.image.title="WG-Easy"
LABEL org.opencontainers.image.description="Easiest way to configure WireGuard"
LABEL org.opencontainers.image.authors="Giuseppe Rocco"
LABEL org.opencontainers.image.licenses="CC BY-NC-SA 4.0"
LABEL org.opencontainers.image.source=$REPO_URL

# 1. wireguard-tools: provides wg and wg-quick commands for WireGuard
# 2. cleanup: remove temporary files to keep image lean
# 3. create directories for configuration and application
# 4. sudoers.d drop-in for no-password use by user node
# 5. create wrapper script /usr/local/bin/wgpw for password management
RUN apk update && \
    apk add --no-cache --update \
    wireguard-tools \
    nftables \
    sudo && \
    rm -rf /tmp/* /var/tmp/* /var/cache/apk/* && \
    install -o 1000 -g 1000 -d /opt/wg-easy -m 700 && \
    install -o 1000 -g 1000 -d /opt/wg -m 700 && \
    echo "node ALL=NOPASSWD: ALL" > /etc/sudoers.d/node && \
    echo -e '#!/bin/sh\nset -e\nnode /opt/wg-easy/wgpw.mjs "$@"' > /usr/local/bin/wgpw && \
    chmod +x /usr/local/bin/wgpw

# Expose the WG-Easy web management interface
EXPOSE 3000/tcp
ENV WG_PATH /opt/wg

# Switch to non-root user
USER node

# Install Node.js dependencies
WORKDIR /opt/wg-easy
COPY ./src/package*.json ./
RUN npm install --omit=dev && \
    npm cache clean --force

# Copy only the strictly necessary files from Stage 1
COPY --from=builder --chown=node /opt/wg-easy/lib       /opt/wg-easy/lib
COPY --from=builder --chown=node /opt/wg-easy/services  /opt/wg-easy/services
COPY --from=builder --chown=node /opt/wg-easy/www/dist  /opt/wg-easy/www/dist
COPY --from=builder --chown=node /opt/wg-easy/config.js /opt/wg-easy/
COPY --from=builder --chown=node /opt/wg-easy/server.js /opt/wg-easy/
COPY --from=builder --chown=node /opt/wg-easy/wgpw.mjs  /opt/wg-easy/

ENTRYPOINT ["/usr/local/bin/npm", "run", "serve"]