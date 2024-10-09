# Plant Wiki

A comprehensive website for plant enthusiasts to share knowledge, manage their plant collections, and connect with other plant lovers.

## Features

- User authentication and authorization with different roles (Admin, Moderator, User)
- Detailed plant database with comprehensive information
- Wikipedia-style articles for each plant species with version history
- User plant libraries with watering and fertilizing logs
- Room management for organizing plant collections
- Calendar for plant care scheduling
- Wishlist and plant graveyard tracking
- Discussion forums for articles
- Moderation system for content (5 moderator approvals required for changes)
- Search functionality for plants, articles, and users
- Image upload and hosting for plants and user profiles
- User flagging system for inappropriate content
- Friend system for connecting with other users
- Moderator request system for eligible users
- Admin dashboard for site statistics and user management
- Plant trading system for users to exchange plants
- Responsive design using Tailwind CSS

## Tech Stack

- Framework: Next.js 14 with TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: NextAuth.js
- Styling: Tailwind CSS
- Logging: Winston
- Containerization: Docker

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/plant-wiki.git
   cd plant-wiki
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/plant_wiki_db
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run database migrations:
   ```
   npx prisma migrate dev
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Deployment

### With Docker

1. Build and start the containers:
   ```
   docker-compose up -d --build
   ```

2. Run database migrations:
   ```
   docker-compose exec web npx prisma migrate deploy
   ```

The application should now be running at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## improvements:
 - [ ] Optimize performance by implementing lazy loading for components and images where appropriate
 - [ ] Implement proper error handling and loading states for components that fetch data.
 - [ ] Set up Storybook to showcase and document the common components, making it easier for developers to use them correctly.
 - [ ] Create a theme configuration file to centralize color schemes and other design tokens.