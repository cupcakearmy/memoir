---
tags:
  - docker
  - vpn
  - transmission
  - torrent
---

# Dockerised Transmission over VPN

This setup allows to have a VPN server running, for downloading all your Linux ISOs over a VPN.

This works by using the amazing gluetun container and giving it a name `container_name:vpn` and referencing that name in all the containers where we want to go through a VPN by setting `network_mode: "container:vpn"`.
The two containers don't have to be in the same docker-compose file.

All the traffic is then routed thought the VPN container, where also the ports then are set.

Many vpn providers are supported, just look at the gluetun docs.

```yaml
version: '3.8'

services:
  vpn:
    image: qmcgaw/gluetun
    container_name: vpn
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
    ports:
      - 9091:9091
    environment:
      - VPN_SERVICE_PROVIDER=nordvpn
      - SERVER_REGIONS=Switzerland
      - OPENVPN_USER=
      - OPENVPN_PASSWORD=

  transmission:
    image: lscr.io/linuxserver/transmission:latest
    restart: unless-stopped
    network_mode: 'container:vpn'
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/London
    volumes:
      - ./data/config:/config
      - ./data/source:/watch
      - /media/storage/dl:/downloads
```
