# MyProfileSpace

**MyProfileSpace** is a dynamic portfolio builder platform where users can easily create and share personalized portfolios. The project is designed with three core components: an admin dashboard, a public user-facing website with customizable portfolio templates, and a backend powered by Supabase.

## Project Structure

- **admin/** - The admin dashboard for managing users and templates, built using React with Vite.
- **supabase/** - Contains backend logic linked with the Supabase project for authentication, database, and APIs.
- **user/** - The frontend for the landing page and portfolio templates, built with Create React App.

## Live Links

- **Admin Dashboard**: [app.myprofilespace.com](https://app.myprofilespace.com)
- **User Frontend**: [www.myprofilespace.com](https://www.myprofilespace.com)

---

## Getting Started

### Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or yarn
- [Supabase](https://supabase.com/) account and project set up
- aws bucket to upload images

---

### Running the Project

#### 1. Admin (Dashboard)

The admin panel is built using React and Vite. create .env and add the variables given in the ex.env file.

**Steps to run:**

```bash
cd admin
npm install
npm run dev
```

#### 2. User (Landing Page & Portfolio Templates)

The user-facing landing page and portfolio templates are built using Create React App. create .env and add the variables given in the ex.env file.

**Steps to run:**

```bash
cd user
npm install
npm start
```

#### 3. Supabase (Backend)

The supabase folder contains the connection and logic for the backend.

**Steps to run:**

```bash
cd supabase
supabase start
```
