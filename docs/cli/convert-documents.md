---
tags:
  - pandoc
  - find
  - xargs
---

# Convert documents

```bash
find . -name "*.odt" | xargs -I % pandoc % -o %.md
```

You can add the `-p` flag to `xargs` to confirm before executing, useful for testing if what your are doing is actually correct.
