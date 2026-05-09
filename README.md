# WireGuard Easy

![Status](https://img.shields.io/badge/status-active-brightgreen.svg?logo=git)
![License](https://img.shields.io/badge/license-cc%20by--nc--sa%204.0-brightgreen.svg?logo=open-source-initiative)

A streamlined fork of [**WireGuard Easy**](https://github.com/wg-easy/wg-easy) by **WeeJeWel**, designed **solely for configuration management**. This version does **not run WireGuard inside the container**, making it ideal for setups where WireGuard is already configured on the host via NetworkManager or another method.

![Screenshot](./assets/screenshot.png "Screenshot")

---

## 🚀 Why This Fork?

This fork was created to address a specific need: managing WireGuard configurations through a clean, modern web interface without running WireGuard inside the container itself. This approach works particularly well in rootless Podman environments where containers don't need NET_ADMIN privileges.

The web UI lets you manage clients through a clean interface—create, edit, delete clients, download configs, and view QR codes. Unnecessary components were removed to keep things minimal and lightweight, and the application supports automatic light/dark mode along with multiple languages.

---

## 🛠 Tech Stack

This fork features a **complete frontend rewrite** from the ground up, replacing the original plain HTML templates with a modern, maintainable architecture. The new frontend uses **TypeScript + React** for a fully typed, component-based structure, built with **Vite** for fast development and optimized production builds. Styling is handled with **Tailwind CSS**, enabling a consistent, responsive design system throughout the application.

The new frontend is seamlessly integrated with the existing backend, addressing the maintainability issues of the previous architecture, which relied on plain HTML with static dependency injection. This modern stack makes the codebase significantly easier to extend, test, and maintain going forward.

---

## ⚠️ Quick Heads-Up

* **No VPN Traffic Handling:** This container does not handle WireGuard traffic. It assumes the host manages WireGuard.
* **Host Setup Required:** Make sure WireGuard is correctly configured on your host before using this fork.

---

## 🏁 Quick Start

```bash
podman run -d \
  --name=wg-easy \
  -e WG_HOST=<YOUR_SERVER_IP> \
  -e PASSWORD_HASH=<YOUR_ADMIN_PASSWORD_HASH> \
  -v ~/.wg-easy:/opt/wg \
  -p 3000:3000/tcp \
  --userns keep-id \ # Optional: Map the user id with podman rootless
  ghcr.io/iomega8561/wg-easy:latest
```

* Replace `<YOUR_SERVER_IP>` with your host IP or DNS.
* Replace `<YOUR_ADMIN_PASSWORD_HASH>` with a bcrypt hash for Web UI login.

---

## 🙏 Credits & Original Repo

* Original author: **WeeJeWel**
* Source project: 👉 [WireGuard Easy on GitHub](https://github.com/wg-easy/wg-easy)