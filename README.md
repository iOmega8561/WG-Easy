# WireGuard Easy

![Status](https://img.shields.io/badge/status-active-brightgreen.svg?logo=git)
![License](https://img.shields.io/badge/license-cc%20by--nc--sa%204.0-brightgreen.svg?logo=open-source-initiative)

A streamlined fork of [**WireGuard Easy**](https://github.com/wg-easy/wg-easy) by **WeeJeWel**, designed to facilitate configuration management-only use cases. This version does **not run WireGuard inside the container by default**, making it ideal for setups where WireGuard is already configured on the host via NetworkManager or another method. It can still spin up WG by itself if needed, more on that below.

![Screenshot](./assets/screenshot.png "Screenshot")

---

## 🚀 Why This Fork?

This fork was created to address a specific need: managing WireGuard configurations through a clean, modern web interface, while retaing the ability to **NOT** run WireGuard inside the container itself. This approach works particularly well in rootless Podman environments where containers don't need NET_ADMIN privileges.

The web UI lets you manage clients through a clean interface—create, edit, delete clients, download configs, and view QR codes. The application is minimal and lightweight, and the new **React** front-end supports automatic light/dark mode along with multiple languages.

---

## 🛠 Tech Stack

This fork features a **complete frontend rewrite** from the ground up, replacing the original plain HTML templates with a modern, maintainable architecture. The new frontend uses **TypeScript + React** for a fully typed, component-based structure, built with **Vite** for fast development and optimized production builds. Styling is handled with **Tailwind CSS**, enabling a consistent, responsive design system throughout the application.

The new frontend is seamlessly integrated with the existing backend, addressing the maintainability issues of the previous architecture, which relied on plain HTML with static dependency injection. This modern stack makes the codebase significantly easier to extend, test, and maintain going forward.

---

## 🏁 Quick Start

To deploy `wg-easy`, choose the configuration that matches your networking requirements.

### 1. Standard Deployment (No internal WireGuard tunnel)

Use this configuration if WireGuard is managed externally or if the container is only acting as a configuration UI.

```bash
podman run -d \
  --name=wg-easy \
  -e WG_HOST=<YOUR_SERVER_IP> \
  -e PASSWORD_HASH=<YOUR_ADMIN_PASSWORD_HASH> \
  -v ~/.wg-easy:/opt/wg \
  -p 3000:3000/tcp \
  --userns keep-id \
  ghcr.io/iomega8561/wg-easy:latest

```

### 2. Full WireGuard Tunnel Deployment

Use this configuration to enable internal WireGuard tunnel management. This requires elevated networking capabilities and kernel parameters.

```bash
podman run -d \
  --name=wg-easy \
  --cap-add=NET_ADMIN \
  --cap-add=NET_RAW \
  --cap-add=SYS_MODULE \
  --sysctl net.ipv4.ip_forward=1 \
  --sysctl net.ipv4.conf.all.src_valid_mark=1 \
  -e WG_HOST=<YOUR_SERVER_IP> \
  -e WG_MANAGED=true \
  -e PASSWORD_HASH=<YOUR_ADMIN_PASSWORD_HASH> \
  -v ~/.wg-easy:/opt/wg \
  -p 3000:3000/tcp \
  -p 51820:51820/udp \
  --userns keep-id \
  ghcr.io/iomega8561/wg-easy:latest

```

* **`<YOUR_SERVER_IP>`**: Public IP or FQDN of your host.
* **`<YOUR_ADMIN_PASSWORD_HASH>`**: Bcrypt hash for the Web UI.
* **Port 51820/udp**: Must be exposed to accept incoming WireGuard client connections.

---

## 🙏 Credits & Original Repo

* Original author: **WeeJeWel**
* Source project: 👉 [WireGuard Easy on GitHub](https://github.com/wg-easy/wg-easy)
