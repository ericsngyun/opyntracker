
# Opyn DeFi Portfolio

Clean and robust DeFi Portfolio Tracker where users can manually input their DeFi asset name, amount, and platform.

This is also a submission to Opyn's takehome assessment

Built with:
- Next.js
- TypeScript
- tRPC
- TailwindCSS
- Shadcn UI
- Supabase
- Prisma
- Recharts

## How to use

This project is built with T3 stack so once you clone the repository

First install all the dependencies with 

```
npm install

```
or
```
yarn
```

Then you want to set your environment variables to connect your database in the .env file in the root directory
```
DATABASE_URL="YOUR_DATABASE_URL"

DIRECT_URL="YOUR_DATABASE_DIRECT_URL"
```
I used Supabase to build this project so that should work fine with this repository

Then you want to run this command in your terminal in order to migrate your prisma schema from the schema.prisma file to your database

```
npx prisma db push
```
or
```
yarn db:push
```

Then to run the project in your development server you would want to run the following command in your terminal
```
npm run dev
```
or
```
yarn dev
```

In order to build and start the production version of the application you would need to run these commands
```
npm run build
npm run start
```
or
```
yarn build
yarn start
```
## Notes

- The navbar on the side and top(for mobile) is mostly for show, the buttons don't serve any purpose except to show what the app would look like with all of its features implemented
- There is no authentication for this app, since it is mostly for demo use and usable by developers

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)


