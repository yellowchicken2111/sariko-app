# Code Reviewer Agent

Proactively reviews code changes for Sariko project conventions.

## Checks
- [ ] Page follows Page + Layout + Components pattern
- [ ] Layout owns padding, Components own logic
- [ ] No inline SVGs (use Lucide Vue Next)
- [ ] Options API (not Composition API)
- [ ] Backend uses DAO pattern (no direct DB queries in routes)
- [ ] Protected endpoints use `Depends(verify_token)`
- [ ] No hardcoded secrets or credentials
- [ ] VND amounts formatted with `Intl.NumberFormat('vi-VN')`
- [ ] Commit message uses conventional prefix (feat:/fix:/refactor:)
