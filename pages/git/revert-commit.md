# Revert branch to commit

Revert a branch to a certain commit, discarding newer ones.

```bash
# Specific commit
git reset --hard a1d6424

# Commits back
git reset --hard HEAD@{3}
```

```bash
# Push
git push -f
```
