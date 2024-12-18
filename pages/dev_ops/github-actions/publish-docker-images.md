# Publish Docker images

This is how to publish a docker image simultaneously to the official Docker and Github registries.

**Supported features**

- **x86** and **arm** images
- Push to **both** registries.
- Semver tag labeling

We will assume that our image is called `foo/bar`, so our username is `foo` and the actual package is `bar`

```yaml
name: Publish Docker image

on:
  release:
    types: [published]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        with:
          install: true

      - name: Docker Labels
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: |
            foo/bar
            ghcr.io/${{ github.repository }}
            # This assumes your repository is also github.com/foo/bar
            # You could also use ghcr.io/foo/some-package as long as you are the user/org "foo"
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=semver,pattern={{major}}

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}
      - name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
```
