# Outline

[Outline](https://www.getoutline.com/) does not make it suuuper easy to not pay for their hosted version. So a few things are a bit rough. Here the [official docs](https://wiki.generaloutline.com/s/hosting/doc/hosting-outline-nipGaCRBDu).

1. Copy `docker-compose.yaml` and `.env`
2. Fill in missing values
3. Manually create a bucket called `wiki` in the minio dashboard.

```yaml
version: '3.8'

networks:
  proxy:
    external: true

services:
  outline:
    image: outlinewiki/outline
    restart: unless-stopped
    env_file: .env
    command: sh -c "yarn db:migrate --env production-ssl-disabled && yarn start"
    depends_on:
      - db
      - redis
      - storage
    networks:
      - default
      - proxy
    labels:
      - traefik.enable=true
      - traefik.http.routers.outline.rule=Host(`example.org`)
      - traefik.http.routers.outline.entrypoints=secure
      - traefik.http.routers.outline.tls.certresolver=cf

  redis:
    restart: unless-stopped
    image: redis

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    volumes:
      - ./data/db:/var/lib/postgresql/data
    environment:
      # PGSSLMODE: disable
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: outline

  storage:
    image: minio/minio
    restart: unless-stopped
    command: server /data --console-address ":80"
    volumes:
      - ./data/s3:/data
    environment:
      - MINIO_ROOT_USER=user
      - MINIO_ROOT_PASSWORD=pass
      - MINIO_DOMAIN=s3.example.org
    networks:
      - proxy
    labels:
      - traefik.enable=true

      - traefik.http.routers.s3.rule=Host(`s3.example.org`)
      - traefik.http.routers.s3.entrypoints=secure
      - traefik.http.routers.s3.tls.certresolver=cf
      - traefik.http.routers.s3.service=s3-service
      - traefik.http.services.s3-service.loadbalancer.server.port=9000

      - traefik.http.routers.s3-dash.rule=Host(`s3-dash.example.org`)
      - traefik.http.routers.s3-dash.entrypoints=secure
      - traefik.http.routers.s3-dash.tls.certresolver=cf
      - traefik.http.routers.s3-dash.service=s3-dash-service
      - traefik.http.services.s3-dash-service.loadbalancer.server.port=80
```

```env
# https://github.com/outline/outline/blob/main/.env.sample

# –––––––––––––––– REQUIRED ––––––––––––––––

NODE_ENV=production

SECRET_KEY=
UTILS_SECRET=

DATABASE_URL=postgres://user:pass@db:5432/outline
PGSSLMODE=disable

REDIS_URL=redis://redis:6379

URL=https://example.org
PORT=3000

COLLABORATION_URL=

AWS_ACCESS_KEY_ID=user
AWS_SECRET_ACCESS_KEY=pass
AWS_S3_ACCELERATE_URL=https://s3.example.org/wiki
AWS_S3_UPLOAD_BUCKET_URL=https://s3.example.org/wiki
AWS_S3_UPLOAD_BUCKET_NAME=wiki
AWS_S3_FORCE_PATH_STYLE=false


# –––––––––––––– AUTHENTICATION ––––––––––––––

# Third party signin credentials, at least ONE OF EITHER Google, Slack,
# or Microsoft is required for a working installation or you'll have no sign-in
# options.

# To configure Slack auth, you'll need to create an Application at
# => https://api.slack.com/apps
#
# When configuring the Client ID, add a redirect URL under "OAuth & Permissions":
# https://<URL>/auth/slack.callback
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=

# To configure Google auth, you'll need to create an OAuth Client ID at
# => https://console.cloud.google.com/apis/credentials
#
# When configuring the Client ID, add an Authorized redirect URI:
# https://<URL>/auth/google.callback
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# To configure Microsoft/Azure auth, you'll need to create an OAuth Client. See
# the guide for details on setting up your Azure App:
# => https://wiki.generaloutline.com/share/dfa77e56-d4d2-4b51-8ff8-84ea6608faa4
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
AZURE_RESOURCE_APP_ID=

# To configure generic OIDC auth, you'll need some kind of identity provider.
# See documentation for whichever IdP you use to acquire the following info:
# Redirect URI is https://<URL>/auth/oidc.callback
OIDC_CLIENT_ID=
OIDC_CLIENT_SECRET=
OIDC_AUTH_URI=
OIDC_TOKEN_URI=
OIDC_USERINFO_URI=

# Specify which claims to derive user information from
# Supports any valid JSON path with the JWT payload
OIDC_USERNAME_CLAIM=preferred_username

# Display name for OIDC authentication
OIDC_DISPLAY_NAME=OpenID

# Space separated auth scopes.
OIDC_SCOPES=openid profile email


# –––––––––––––––– OPTIONAL ––––––––––––––––

# Base64 encoded private key and certificate for HTTPS termination. This is only
# required if you do not use an external reverse proxy. See documentation:
# https://wiki.generaloutline.com/share/1c922644-40d8-41fe-98f9-df2b67239d45
SSL_KEY=
SSL_CERT=

# If using a Cloudfront/Cloudflare distribution or similar it can be set below.
# This will cause paths to javascript, stylesheets, and images to be updated to
# the hostname defined in CDN_URL. In your CDN configuration the origin server
# should be set to the same as URL.
CDN_URL=

# Auto-redirect to https in production. The default is true but you may set to
# false if you can be sure that SSL is terminated at an external loadbalancer.
FORCE_HTTPS=false

# Have the installation check for updates by sending anonymized statistics to
# the maintainers
ENABLE_UPDATES=true

# How many processes should be spawned. As a reasonable rule divide your servers
# available memory by 512 for a rough estimate
WEB_CONCURRENCY=1

# Override the maximum size of document imports, could be required if you have
# especially large Word documents with embedded imagery
MAXIMUM_IMPORT_SIZE=5120000

# You can remove this line if your reverse proxy already logs incoming http
# requests and this ends up being duplicative
#DEBUG=http

# For a complete Slack integration with search and posting to channels the
# following configs are also needed, some more details
# => https://wiki.generaloutline.com/share/be25efd1-b3ef-4450-b8e5-c4a4fc11e02a
#
SLACK_VERIFICATION_TOKEN=your_token
SLACK_APP_ID=A0XXXXXXX
SLACK_MESSAGE_ACTIONS=true

# Optionally enable google analytics to track pageviews in the knowledge base
GOOGLE_ANALYTICS_ID=

# Optionally enable Sentry (sentry.io) to track errors and performance,
# and optionally add a Sentry proxy tunnel for bypassing ad blockers in the UI:
# https://docs.sentry.io/platforms/javascript/troubleshooting/#using-the-tunnel-option)
SENTRY_DSN=
SENTRY_TUNNEL=

# To support sending outgoing transactional emails such as "document updated" or
# "you've been invited" you'll need to provide authentication for an SMTP server
SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
SMTP_REPLY_EMAIL=
SMTP_TLS_CIPHERS=
SMTP_SECURE=true

# The default interface language. See translate.getoutline.com for a list of
# available language codes and their rough percentage translated.
DEFAULT_LANGUAGE=en_US

# Optionally enable rate limiter at application web server
RATE_LIMITER_ENABLED=true

# Configure default throttling parameters for rate limiter
RATE_LIMITER_REQUESTS=1000
RATE_LIMITER_DURATION_WINDOW=60
```
