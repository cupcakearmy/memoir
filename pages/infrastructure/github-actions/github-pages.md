---
tags:
  - Github Actions
  - Pages
  - Static Site
---

# Github Pages with Actions

Publish static sites to Github Pages using Actions.

## Example

The example uses `docs` as the built folder containing the static site.

```yaml
name: Docs

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Build some static assets

      - uses: actions/configure-pages@v3
      - uses: actions/upload-pages-artifact@v1
        with:
          path: './docs'
      - id: deployment
        uses: actions/deploy-pages@v1
```

## Path prefix

Note that we require a path to be set as github pages are published as: `https://<username>.github.io/<repo>/`

### Vite

For vite you can set it with the [base option](https://vitejs.dev/config/shared-options.html#base).

```bash
vite build --emptyOutDir --base=./
```
