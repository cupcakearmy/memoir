# Clear history

This removes all commits from the past.

```bash
# Checkout
git checkout --orphan latest_branch

# Add all the files
git add -A

# Commit the changes
git commit -am "commit message"

# Delete the branch
git branch -D main

# Rename the current branch to main
git branch -m main

# Finally, force update your repository
git push -f origin main

# Optionally clear local caches
git gc --aggressive --prune=all
```

https://stackoverflow.com/a/26000395
