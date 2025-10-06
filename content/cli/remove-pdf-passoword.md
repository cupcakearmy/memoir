---
tags:
  - cli
  - qpdf
  - pdf
  - decrypt
---

# Remove password from PDFs

```bash
# Install qpdf
nix-shell -p qpdf

# Remove password
qpdf --password=YOUR_PASSWORD --decrypt input.pdf output.pdf
```
