---
tags:
  - Github Actions
  - DRY
---

# Composite Actions

Often we reuse `steps` inside our different github actions. As we generally want to follow [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principles (and are lazy), which means every duplicated step has potential for improvement.

> There is also a [good guide/tutorial by James Wallis](https://wallis.dev/blog/composite-github-actions), which this is mainly inspired by.

## Composite Actions vs Reusable Workflows

Within Github actions there are two ways to achieve that: **Composite Actions** and **Reusable Workflows**. Here is a [good comparison by cardinalby](https://cardinalby.github.io/blog/post/github-actions/dry-reusing-code-in-github-actions/).

## Key Points of Composite Actions

- Can live in the same repository, but can also be outsourced into it's own.
- Share the same filesystem -> no build artifacts need to be passed around.
- Secrets cannot be accessed directly, need to be passed.
- Each action has to have it's own directory with an `action.yaml` file inside it.
- When executing raw commands we need to specify the `shell` we are running in.

## Example

The example will show how to extract a part of a github action to a composite action. In this case: building some LaTeX files.

```
.github/
├── actions
│   └── build
│       └── action.yaml
└── workflows
    ├── preview.yml
    └── release.yml
```

```yaml
name: 'Latex Builder'
description: 'Checkout and build LaTeX files.'

inputs:
  # As we cannot access secrets directly, they must be passed
  github-token:
    description: 'GitHub token for authentication.'
    required: true

runs:
  using: 'composite' # This is the magic
  steps:
    - uses: actions/cache@v3
      name: Tectonic Cache
      with:
        path: ~/.cache/Tectonic
        key: ${{ runner.os }}-tectonic-${{ hashFiles('**/*.tex') }}
        restore-keys: |
          ${{ runner.os }}-tectonic-
    - uses: wtfjoke/setup-tectonic@v2
      with:
        github-token: ${{ inputs.github-token }}
    - name: Run Tectonic
      run: make tectonic
      shell: bash # This would not be required in the normal action file
```

```yaml
name: 'Preview'

on:
  # ...

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: ./.github/actions/build
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload PDFs
        uses: actions/upload-artifact@v2
        with:
          name: PDFs
          path: '*.pdf'
```

```yaml
name: 'Release'

on:
  # ...

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: ./.github/actions/build
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Release
        uses: ncipollo/release-action@v1
        with:
          allowUpdates: true
          artifacts: '*.pdf'
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Gotchas

- If we use a local composite action, the `actions/checkout@v3` step cannot be inside the composite action, as the step itself is inside the repository, so it does not exist yet in the run.
