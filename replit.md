# Overview

ShrinkEarn is a full-stack URL shortening application with monetization capabilities. It allows users to shorten URLs and earn money from clicks through integrated advertising. The platform features both user and admin interfaces, with comprehensive analytics, fraud detection, and a referral system. Built with modern web technologies, it provides a complete solution for URL shortening services with revenue generation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and better developer experience
- **Routing**: Wouter for lightweight client-side routing with role-based navigation (admin vs user)
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring a "royal" color scheme (royal-black, royal-gold, royal-purple)
- **UI Components**: Radix UI components with shadcn/ui for consistent, accessible design system
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture  
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Authentication**: Replit-based OpenID Connect authentication with Passport.js strategies
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Database Access**: Drizzle ORM with Neon serverless PostgreSQL for type-safe database operations
- **API Design**: RESTful endpoints with proper error handling and request logging middleware

## Database Design
- **Primary Database**: PostgreSQL with Neon serverless hosting for scalability
- **ORM**: Drizzle ORM with schema-first approach and automatic TypeScript generation
- **Schema Structure**: 
  - Users table with authentication data, earnings tracking, and referral codes
  - Links table with URL mappings, analytics, and user associations
  - Analytics tables for click tracking and revenue calculation
  - CPM rates table for dynamic pricing based on geography and device type
  - Withdrawals and referrals tables for monetization features
- **Migrations**: Drizzle Kit for database schema migrations and version control

## Authentication & Authorization
- **Provider**: Replit OpenID Connect for seamless integration with Replit environment
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL (7 days default)
- **Role-based Access**: User and admin roles with different interface access
- **Security**: HTTP-only cookies, CSRF protection, and secure session management

## Revenue & Analytics System
- **Monetization**: CPM-based earnings with country and device-specific rates
- **Analytics**: Comprehensive click tracking with geographic and device information
- **Fraud Detection**: Built-in systems to prevent click fraud and abuse
- **Reporting**: Real-time analytics dashboards for both users and administrators
- **Withdrawal System**: Automated payout processing with minimum thresholds

# External Dependencies

## Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling
- **Replit Platform**: Integrated hosting, authentication, and development environment
- **WebSocket Support**: For real-time features using 'ws' library

## Frontend Libraries
- **Radix UI**: Comprehensive accessible component primitives for complex UI interactions
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **React Hook Form**: Form handling with validation using Zod schemas
- **Wouter**: Lightweight routing solution optimized for modern React applications

## Backend Libraries
- **Express.js**: Web application framework with middleware ecosystem
- **Passport.js**: Authentication middleware supporting multiple strategies
- **Drizzle ORM**: Modern TypeScript ORM with excellent developer experience
- **OpenID Client**: OAuth 2.0 and OpenID Connect client implementation
- **Connect-PG-Simple**: PostgreSQL session store for Express sessions

## Development Tools
- **TypeScript**: Static type checking across the entire application stack
- **Vite**: Fast build tool with hot module replacement for development
- **ESBuild**: Fast JavaScript bundler for production builds
- **Drizzle Kit**: Database migration tool and schema management