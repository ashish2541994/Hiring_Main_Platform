# Fix Plan - MERN AI Hiring Platform

## Issues Found During Scan

### CRITICAL: JobDetailsPage.jsx is MISSING

- File `frontend/src/pages/jobs/JobDetailsPage.jsx` doesn't exist
- But `AppRoutes.jsx` imports it: `const JobDetailsPage = lazy(() => import("../pages/jobs/JobDetailsPage"));`
- Route at `jobs/:id` will cause build/runtime error

### CRITICAL: Candidate Profile Resume Upload Broken

- `CandidateService.js` calls `candidateApi.uploadResume()` which posts to `/candidate/resume`
- Backend has NO route at `/api/candidate/resume` - the resume routes are at `/api/resumes/upload`
- Resume upload from Candidate Profile will 404

### Issue 1: Resume Replacement Fixes

**Root cause**: Frontend candidateApi calls wrong endpoint for resume upload. Profile page lacks upload UI.
**Fix**: Update CandidateProfile.jsx to use resumeApi instead of candidateApi for resume uploads. Add upload button UI.

### Issue 2: Profile Completion & 404 Fixes

**Root cause**: Missing JobDetailsPage component. Companies pages use mock data instead of API.
**Fix**: Create JobDetailsPage. Update CompaniesPage and CompanyProfilePage to use actual API calls.

### Issue 3: Application Bug Fixes

**Root cause**: Backend already has unique compound index. Need to verify frontend handles error properly and shows "Applied" state on job cards.
**Fix**: Add "already applied" check in CandidateJobs.jsx job cards, show proper disabled state.

### Issue 4: Job Details Page (Create from scratch)

**Root cause**: File doesn't exist.
**Fix**: Create full JobDetailsPage with proper navbar spacing, back button, responsive layout.

### Issue 5: Dark/Light Mode

**Root cause**: ThemeContext already works with localStorage. Need to ensure all components honor dark mode CSS variables.
**Fix**: Use existing CSS variable system - already implemented correctly. Verify by checking components use `dark:` prefixes.

### Issue 6: Candidate Profile Fixes

**Root cause**: Resume upload missing from profile. The `handleSave` calls `candidateApi.updateProfile` which correctly updates profile fields but doesn't handle resume file upload.
**Fix**: Add resume upload section to profile page with proper API calls.

### Issue 7: Full Project Scan

- CompaniesPage uses hardcoded mock data instead of companyApi
- CompanyProfilePage uses hardcoded mock data instead of companyApi
- These need API integration

## Implementation Plan

1. Create `JobDetailsPage.jsx` (MISSING FILE)
2. Fix `CandidateProfile.jsx` - Add resume upload, fix API calls
3. Fix `CompaniesPage.jsx` - Use companyApi instead of mock data
4. Fix `CompanyProfilePage.jsx` - Use companyApi instead of mock data
5. Fix `CandidateJobs.jsx` - Show "Applied" state for already-applied jobs
6. Verify Dark/Light mode across all components
7. Fix any other broken routes/links found during scan
