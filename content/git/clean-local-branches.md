---
tags:
  - git
  - branch
  - clean
  - delete
---
# Clean up local branches

## Delete all local branches that are already merged.

This command is useful if you have a buch of local branches that you don't need anymore.

```bash
git branch --merged | grep -v \* | xargs git branch -D
```

[Original SO Link](https://stackoverflow.com/a/10610669)

## Delete all other local branches

This command will delete all local branches except the one you are currently on.

```bash
git branch | grep -v "$(git rev-parse --abbrev-ref HEAD)" | xargs git branch -D
```

[Source](https://dev.to/vineethtrv/how-to-delete-all-local-git-branches-except-the-current-one-5dcb)
