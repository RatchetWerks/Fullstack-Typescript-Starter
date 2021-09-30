# Typescript Starter

NOTE: WORK IN PROGRESS, DON'T FORK UNTIL THIS COMMENT IS REMOVED


To start development:
npm run dev

To do prisma migration:
npx prisma migrate dev

To view Prisma studio:
npx prisma studio

Folder Structure:

- Controllers: Maps HTTP routes to services
- Middleware: Typically executes before calling services
- Services: Does Business logic checks
- Models: Retrieves data from SQL database via Prisma calls
