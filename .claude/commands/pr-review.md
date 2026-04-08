# /pr-review

Review current branch changes before creating a PR.

## Steps
1. `git diff main...HEAD` — review all changes
2. Check each modified page follows Page + Layout + Components pattern
3. Check backend changes follow DAO pattern
4. Verify no secrets, no hardcoded values, no `console.log` left behind
5. Check VND formatting consistency
6. Summarize: changes, potential issues, PR title suggestion
