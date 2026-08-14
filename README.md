# Job/Internship Application Tracker API

A backend API for tracking job and internship applications. Built with NestJS as a hands-on project to practice industry-standard backend architecture, authentication, background jobs, and CI/CD.

## Problem statement

Job seekers and students applying to multiple internships/jobs lack a simple, centralized way to track the status of each application, the people involved, and upcoming actions. This leads to missed follow-ups, lost context, and disorganized job searches.

This project solves that by letting a user:

- Record each job/internship they've applied to, along with the company and role
- Track what stage each application is at (applied, interviewing, offer, rejected, etc.)
- Store contact details for recruiters/interviewers tied to each company
- Set reminders for follow-ups and interviews, with automated email notifications
- View history of how each application has progressed over time

## Tech stack

- **Framework:** [NestJS](https://nestjs.com)
- **Language:** TypeScript
- **ORM:** [TypeORM](https://typeorm.com)
- **Database:** PostgreSQL
- **Notifications:** Scheduled jobs (`@nestjs/schedule`) + email delivery (TBD)
- **API testing:** Postman

## Entity overview

The system is built around six core entities:

| Entity                     | Purpose                                                  |
| -------------------------- | -------------------------------------------------------- |
| `User`                     | The person using the tracker (auth account)              |
| `Company`                  | A company the user has applied to                        |
| `Contact`                  | A recruiter/interviewer tied to a company                |
| `Application`              | A single job/internship application                      |
| `ApplicationStatusHistory` | Audit trail of status changes for an application         |
| `Reminder`                 | A follow-up or interview reminder tied to an application |
| `Notification`             | A delivery record (e.g. email) triggered by a reminder   |

Full entity-relationship diagram: _(to be added)_

## Project status

🚧 Early development - this project is being built incrementally as a learning exercise, following a documented, step-by-step process (proper git workflow, PRs, and CI/CD included). Not production-ready.

## Setup instructions

```bash
# install dependencies
npm install

# start the database (requires Docker)
docker compose up -d

# copy environment variables and fill in real values
cp .env.example .env
```

### Running the app

```bash
# development (watch mode)
npm run start:dev

# production mode
npm run start:prod
```

### Running tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Development workflow

This project follows a standard team-style workflow, even though it's currently maintained solo:

- All changes go through feature branches and pull requests (`main` is protected)
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- Work is tracked via Github Issues and a project board
