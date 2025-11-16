# v3.1.0 Deployment Checklist

## Pre-Deployment

### Code Verification
- [x] Version updated to v3.1.0 in all headers
- [x] FilterRule interface extended with new fields
- [x] matchesUnifiedFilter helper function added
- [x] matchesFilterRule updated for unified structure
- [x] Backward compatibility maintained for legacy syntax
- [x] File size: 58,651 bytes (89.5% of 65,536 limit)

### Testing
- [x] Test suite created (18 groups, 67 test cases)
- [x] OR filters tested (content, regex, username, domain)
- [x] AND filters tested (content, regex, username, domain)
- [x] NOT filters tested (content, regex, username, domain)
- [x] Mixed filter types tested
- [x] Legacy syntax verified working
- [x] COMPLEX rule integration tested

### Documentation
- [x] Unified Filter Guide created
- [x] Release Notes written
- [x] GitHub Release summary prepared
- [x] Migration examples documented
- [x] Code examples provided
- [x] Best practices documented

## Deployment Steps

### 1. Beta Testing (Recommended)
- [ ] Deploy to @betabot account first
- [ ] Monitor for 24-48 hours
- [ ] Check for any unexpected behavior
- [ ] Verify size constraints (currently 89.5%)
- [ ] Confirm legacy filters still work

### 2. Documentation Release
- [ ] Upload UNIFIED_FILTER_GUIDE_v3_2_0.md to repository
- [ ] Upload RELEASE_NOTES_v3_2_0.md to repository
- [ ] Update main README.md with v3.1.0 info
- [ ] Add test suite to TESTS/ directory
- [ ] Update EXAMPLES/ with v3.1.0 examples

### 3. Code Release
- [ ] Create example-ifttt-filter-x-xcom-3_2_0.ts in EXAMPLES/
- [ ] Update version references in documentation
- [ ] Tag release in Git: `git tag v3.1.0`
- [ ] Push tags: `git push origin v3.1.0`

### 4. GitHub Release
- [ ] Create new release on GitHub
- [ ] Use GITHUB_RELEASE_v3_2_0.md content
- [ ] Attach all documentation files
- [ ] Mark as "Latest Release"

### 5. Gradual Rollout
- [ ] Update 5-10 low-volume bots first
- [ ] Monitor for 24 hours
- [ ] Update medium-volume bots
- [ ] Monitor for 24 hours
- [ ] Update high-volume bots
- [ ] Monitor for 48 hours

### 6. Community Communication
- [ ] Post announcement on Mastodon
- [ ] Update bot status/info if relevant
- [ ] Respond to any user questions
- [ ] Gather feedback for future improvements

## Post-Deployment

### Monitoring (First Week)
- [ ] Check bot posting frequency
- [ ] Verify filters working as expected
- [ ] Monitor for any errors in IFTTT logs
- [ ] Track size usage (should stay at ~89.5%)
- [ ] Watch for community feedback

### Known Issues Check
- [ ] No known issues at this time
- [ ] Legacy syntax confirmed working
- [ ] New syntax confirmed working
- [ ] Performance appears normal

### Success Criteria
- [ ] All bots posting successfully
- [ ] No increase in error rates
- [ ] Filters working as documented
- [ ] No user complaints about missing posts
- [ ] Size remains under 65KB limit

## Rollback Plan

### If Issues Occur
1. **Identify Problem:** Check IFTTT logs and bot behavior
2. **Quick Fix:** If minor, patch and redeploy
3. **Rollback:** If major, revert to v3.1.0
   - [ ] Use previous version from repository
   - [ ] Deploy to affected bots
   - [ ] Document issue for future fix
   - [ ] Create GitHub issue for tracking

### Rollback Files
Keep these v3.1.0 files accessible:
- example-ifttt-filter-x-xcom-3_1_0.ts (backup)
- Previous bot configurations

## Version Compatibility

### Supported Versions
- v3.1.0 (current)
- v3.0.3 (previous stable)
- v3.0.2 (legacy)

### Migration Path
- v3.0.x → v3.1.0: ✅ Direct upgrade, no changes needed
- v2.x → v3.1.0: ⚠️ Review v3.0 migration guide first

## Testing Commands

### File Size Check
```bash
wc -c example-ifttt-filter-x-xcom-3_1_0.ts
# Expected: ~58,651 bytes
```

### Syntax Validation
```bash
# TypeScript compilation check (if available)
tsc --noEmit example-ifttt-filter-x-xcom-3_1_0.ts
```

### Test Suite Execution
```bash
# Test specification review
node test-v3_1_0-unified-filters.js
```

## Notes

### Size Budget
- Current: 58,651 bytes (89.5%)
- Limit: 65,536 bytes (64KB)
- Available: ~6,885 bytes (10.5%)
- Growth from v3.1.0: ~6,000 bytes (+11.4%)

### Performance
- No performance degradation expected
- New matchesUnifiedFilter function is optimized
- Caching still in place for regex patterns
- Legacy code paths unchanged

### Support
- Primary: GitHub Issues
- Secondary: Mastodon @zpravobot.news
- Documentation: Project repository

## Sign-Off

### Code Review
- [ ] Reviewed by: __________
- [ ] Date: __________
- [ ] Approved: __________

### Testing
- [ ] Tested by: __________
- [ ] Date: __________
- [ ] Passed: __________

### Deployment
- [ ] Deployed by: __________
- [ ] Date: __________
- [ ] Status: __________

---

**Version:** 3.1.0  
**Checklist Created:** November 16th, 2025  
**Last Updated:** November 16th, 2025