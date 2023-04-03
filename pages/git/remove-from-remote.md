# Remove files from repository

How to remove files from the repository, without deleting them locally. [Original SO](https://stackoverflow.com/a/1143800)

```bash
# File
git rm --cached file_to_remove.txt

# Dir
git rm --cached -r directory_to_remove
```
