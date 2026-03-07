# WireGuard Easy

![Status](https://img.shields.io/badge/status-active-brightgreen.svg?logo=git)
![License](https://img.shields.io/badge/license-cc%20by--nc--sa%204.0-brightgreen.svg?logo=open-source-initiative)

A streamlined fork of [**WireGuard Easy**](https://github.com/wg-easy/wg-easy) by **WeeJeWel**, designed **solely for configuration management**.
This version does **not run WireGuard inside the container**, ideal for setups where WireGuard is already configured on the host via NetworkManager or another method.

![Screenshot](./assets/screenshot.png "Screenshot")

---

## 🚀 Why This Fork?

* **Configuration-Focused:** No active WireGuard tunnel inside the container—just the Web UI and configuration management.
* **Podman-Ready:** Works well in rootless environments where containers don’t need NET_ADMIN privileges.
* **Web UI for Clients:** List, create, edit, delete clients; download configs; view QR codes.
* **Minimal & Lightweight:** Unnecessary components removed for simpler maintenance.
* **Multilanguage & Theme Support:** Automatic light/dark mode and multiple languages.

---

## ⚠️ Quick Heads-Up

* **No VPN Traffic Handling:** This container does not handle WireGuard traffic. It assumes the host manages WireGuard.
* **Host Setup Required:** Make sure WireGuard is correctly configured on your host before using this fork.

---

## 🏁 Quick Start

```bash
docker|podman run -d \
  --name=wg-easy \
  -e LANG=en \
  -e WG_HOST=<YOUR_SERVER_IP> \
  -e PASSWORD_HASH=<YOUR_ADMIN_PASSWORD_HASH> \
  -v ~/.wg-easy:/etc/wireguard \
  -p 3000:3000/tcp \
  ghcr.io/iOmega8561/wg-easy:latest
```

* Replace `<YOUR_SERVER_IP>` with your host IP or DNS.
* Replace `<YOUR_ADMIN_PASSWORD_HASH>` with a bcrypt hash for Web UI login.

---

## 🙏 Credits & Original Repo

* Original author: **WeeJeWel**
* Source project: 👉 [WireGuard Easy on GitHub](https://github.com/wg-easy/wg-easy)