# Remove secrets after being pushed

If you accidentally pushed a secret or some file that should not be publicly available in your git repo, there are a few ways. My personal fav is [BFG](https://rtyley.github.io/bfg-repo-cleaner/).

> `--no-blob-protection` also modifies you latest commit, by default that is turned off.

```bash
bfg -D "*.txt" --no-blob-protection
```
