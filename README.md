# Teach Other Application

Teach other is an application for private lesson scheduling service for college students.

## How to run this website

- Create your own **.env.local** file based on **.env.example** (Create a mongoDB instance on MongoDB Atlas or docker container and paste the database url on **.env.local**, and also create an account on auth0 and paste he AUTH0 variables).

- Install all dependencies with yarn:

```bash
yarn
```

- Start dev server:

```bash
yarn dev
```

## Technologies used

- Node
- Yarn
- Typescript
- Next.js
- NextAuth (Authentication)
- Auth0
- Tailwind CSS
- SWR (Client side caching)
- MongoDB Atlas (cloud database as a service)
- Vercel (hosting)

## Features included

- Authentication (create account/login)
- List teachers by class
- Schedule a private lesson
- Spend and recieve a digital currency

## Live version

You can visit the live version of Teach Other on https://teach-other.vercel.app
