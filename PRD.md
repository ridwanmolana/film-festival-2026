# PRODUCT REQUIREMENTS DOCUMENT
## FILM FESTIVAL AWARDS 2026

**Version:** 1.1  
**Project:** Interactive Event Website  
**School:** SMP Global Prestasi Bekasi  
**Event Date:** 8–9 December 2026  
**Venue:** GPS Theater

---

## 1. PROJECT OVERVIEW

Film Festival Awards 2026 is an interactive event website designed to showcase ten student-produced films and create an engaging digital experience for students, teachers, and event visitors.

The website provides movie showcases, public Best Picture predictions, community comments, and event information.

## 2. PROJECT OBJECTIVES

- Create a premium cinematic digital identity.
- Showcase ten participating films.
- Display movie posters, descriptions, and crew photographs.
- Provide public Best Picture voting.
- Display live voting statistics.
- Allow visitors to submit comments.
- Provide a dashboard for event administrators.

## 3. USER ROLES

**Public Visitors**
- Browse the website.
- Explore all ten films.
- Participate in Best Picture predictions.
- Submit and read approved comments.
- View event information.

**Administrators**
- Manage film information.
- Upload posters and crew photographs.
- Manage comments.
- Open and monitor voting.
- View voting statistics.
- Manage event information.

## 4. WEBSITE STRUCTURE

### A. HOME
- Official event logo.
- Cinematic hero section.
- Event title and tagline.
- Event countdown.
- Event date and venue.
- Featured movie posters.
- Explore Films button.
- Predict the Best Picture button.

### B. FILM SHOWCASE
Display all ten participating films on one page.

Each film card contains:
- Movie poster.
- Film title.
- Genre and duration, if available.
- Short description.
- Crew photographs.

No separate Film Detail page is required.

There must be no individual film detail route or separate film detail navigation.

### C. AUDIENCE PREDICTION
- One category: Best Picture.
- Display all ten nominated films.
- Allow visitors to choose one film.
- Allow public voting without account registration.
- Display total votes.
- Display percentage for each film.
- Display current ranking.
- Support live result updates.
- Display voting status: Open or Closed.

### D. COMMUNITY
- Public comment submission.
- Display name and comment message.
- Comments require administrator approval.
- Display approved comments.
- Administrators can approve, hide, or delete comments.

### E. EVENT INFORMATION
- Event title.
- Event date: 8–9 December 2026.
- Venue: GPS Theater.
- Event description.
- Official event identity.

## 5. PUBLIC VOTING RULES

Voting category: Best Picture Only.

Access: Public Voting.

- No account registration is required.
- Voting opens automatically when the event website is officially published.
- The publication timestamp is recorded automatically.
- Voting closes on 4 December 2026 at 23:59 WIB.
- One active prediction is permitted per anonymous browser token.
- Visitors can update their prediction before the voting deadline.
- Duplicate submissions from the same token must not increase the total vote count.
- CAPTCHA verification is required.
- Voting requests must be validated server-side.
- Voting results are displayed as aggregate statistics.
- Voting cannot be submitted after the closing deadline.

Voting is an audience prediction and does not determine the official jury winner.

## 6. VOTING SCHEDULE

**Opening:** When the event website is officially published.

**Closing:** 4 December 2026, 23:59:59 WIB.

The system uses the Asia/Jakarta timezone.

Voting is automatically disabled after the closing timestamp.

The opening and closing status must be calculated using the server/database clock, not the visitor's device clock.

## 7. COMMENT MODERATION

- New comments are stored as Pending.
- Only approved comments appear publicly.
- Administrators can approve, hide, and delete comments.
- Comment forms must include basic spam protection.

## 8. ADMIN DASHBOARD

**Dashboard Overview**
- Total films.
- Total approved and pending comments.
- Total predictions.
- Voting statistics.

**Film Management**
- Add, edit, and delete films.
- Upload and replace posters.
- Edit descriptions.
- Manage crew information.
- Upload crew photographs.
- Set display order.

**Voting Management**
- View voting status.
- Open or close voting manually.
- View total votes.
- View percentages and rankings.
- Export voting data.
- View voting opening and closing timestamps.

**Comment Management**
- Review pending comments.
- Approve, hide, and delete comments.

**Event Management**
- Edit event information.
- Publish or unpublish the event.
- Manage homepage content.

## 9. DESIGN REQUIREMENTS

Visual concept: Grand Cinematic Awards.

- Midnight navy background.
- Gold accents.
- Elegant typography.
- Cinematic lighting and spotlight effects.
- Premium award-themed interface.
- Film-inspired visual elements.
- Custom event identity.
- Smooth and subtle animations.
- Responsive desktop, tablet, and mobile layouts.

## 10. TECHNOLOGY STACK

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Motion

Backend:
- Supabase
- PostgreSQL
- Supabase Storage

Security:
- Row Level Security.
- Server-side voting validation.
- CAPTCHA protection.
- Admin authentication and authorization.

Hosting:
- Vercel

Development:
- Google Antigravity
- GitHub

## 11. SUCCESS CRITERIA

- Homepage displays event information correctly.
- Ten films appear in the Film Showcase.
- Posters, descriptions, and crew photographs display correctly.
- No separate Film Detail page exists.
- Public visitors can participate in Best Picture predictions.
- Voting automatically opens at official publication.
- Voting closes automatically on 4 December 2026.
- Voting statistics update correctly.
- Duplicate browser submissions are restricted.
- Comments can be submitted and moderated.
- Administrators can manage content without modifying source code.
- Website works on mobile and desktop.
- Security and deployment tests pass.