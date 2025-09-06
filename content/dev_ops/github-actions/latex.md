---
tags:
  - LaTeX
  - Github Actions
  - CD
  - Pipeline
  - Tectonic
---

# Building LaTeX in Github Actions

This pipeline uses [tectonic](https://tectonic-typesetting.github.io) as the build system for LaTeX. Covered here are:

- Custom fonts
- Pipeline
- Upload generated files as artifacts

## Fonts

If we are using custom fonts, we need to make them available first. This means checking them into the repo (or downloading them remotely). In this case I chose storing them as LFS files.

In most Linux systems you can install custom fonts under `~/.fonts`.

```
./fonts/
├── Open_Sans.zip
├── Roboto_Mono.zip
└── install.sh
```

```sh
#!/bin/sh

TARGET=~/.fonts
mkdir -p $TARGET
unzip -o -d "$TARGET/roboto_mono" "./fonts/Roboto_Mono.zip"
unzip -o -d "$TARGET/open_sans" "./fonts/Open_Sans.zip"
```

## Pipeline

```yaml
name: 'Build LaTeX'

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # Optional Cache of downloaded Tex packages
      - uses: actions/cache@v3
        name: Tectonic Cache
        with:
          path: ~/.cache/Tectonic
          key: ${{ runner.os }}-tectonic-${{ hashFiles('**/*.tex') }}
          restore-keys: |
            ${{ runner.os }}-tectonic-

      # Install tectonic
      - uses: wtfjoke/setup-tectonic@v2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Install fonts
        run: ./fonts/install.sh

      - name: Build
        run: tectonic src/main.tex

      - name: Upload PDFs
        uses: actions/upload-artifact@v2
        with:
          name: PDFs
          path: '*.pdf'
```
