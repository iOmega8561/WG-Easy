# Generating a bcrypt-hashed password

WG-Easy needs the bcrypt hash of your password, never the password itself. The images ship a small tool, `wgpw`, that prints it:

```sh
podman run --rm ghcr.io/iomega8561/wg-easy:config /opt/wg-easy/dist/lib/wgpw.js 'YOUR_PASSWORD'
```

```sh
PASSWORD_HASH='$2b$12$coPqCsPtcFO.Ab99xylBNOW4.Iu7OOA2/ZIboHN6/oyxca3MWo7fW'
```

The hash is the part between the quotes. The safest place for it is a Podman secret, read through `PASSWORD_HASH_FILE`:

```sh
podman secret create wg-easy-password-hash -   # paste the hash, then Ctrl-D
```

To check a password against a hash:

```sh
podman run --rm ghcr.io/iomega8561/wg-easy:config /opt/wg-easy/dist/lib/wgpw.js 'YOUR_PASSWORD' '$2b$12$…'
```

If you pass the hash through `PASSWORD_HASH` in a Compose file instead, escape every `$` as `$$`, or Compose will treat it as a variable.
