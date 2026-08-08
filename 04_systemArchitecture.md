AI Career Mentor Platform
Phase 2 – System Design
Step 2.1 – System Architecture
1. Purpose of the System Architecture

The purpose of this document is to answer these questions:

What are the major components of the system?
How do they communicate?
Where does AI fit?
Where is business logic executed?
Where is data stored?
Which component is responsible for each task?


2. Technology Stack
Layer -          Technology   -       Reason
Frontend -       React.js     -       Modern SPA, reusable components
Backend -        Node.js + Express.js - REST API development
Database -       MongoDB      -            Flexible document database
Authentication-  JWT + bcrypt -       Secure authentication
AI -             LLM + RAG    -       Personalized AI responses
Version Control - Git & GitHub -      Source code management
IDE -            Visual Studio Code - Development

3. High-Level Architecture
                    AI Career Mentor Platform

+---------------------------------------------------------------+
|                        React Frontend                         |
+---------------------------------------------------------------+
            │
            │ HTTPS (REST API)
            ▼
+---------------------------------------------------------------+
|                    Express Backend API                        |
+---------------------------------------------------------------+
│
├──────────────── Authentication
├──────────────── Student Module
├──────────────── Career CMS Module
├──────────────── Business Logic Module
├──────────────── AI Module
│
└──────────────── Database Layer
            │
            ▼
+---------------------------------------------------------------+
|                         MongoDB                               |
+---------------------------------------------------------------+
            ▲
            │
            │
+---------------------------------------------------------------+
|                  LLM + RAG AI Engine                          |
+---------------------------------------------------------------+

4. Overall System Components

Main five major components.

Component 1 — React Frontend

Purpose: Provides the user interface.

Two portals:

Student Portal:
Login
Dashboard
Skill Assessment
Roadmap
AI Chat
GitHub Analysis
LinkedIn Analysis
Resume Analysis

Career CMS:
Dashboard
Degree Management
Career Management
Skill Management
Certificate Management
Learning Resource Management
Student Management

Component 2 — Express Backend

This is the brain of the system.

Responsibilities:

Authentication
Authorization
Business Logic
Validation
API Responses
AI Integration
Database Operations

Component 3 — MongoDB Database

Stores all system data.

Examples:

Users
Student Profiles
Degrees
Careers
Skills
Certificates
Projects
Chat History

Component 4 — Business Logic Engine

This is NOT AI. This is one of the most important design decisions.

Responsibilities:

Internship Readiness Calculation
Skill Gap Analysis
Learning Roadmap Generation
Certificate Recommendation Rules
Dashboard Statistics

This module works using predefined rules and algorithms.

Example:

Student knows Python but not SQL.

Business Logic:

Missing Skill = SQL

No AI involved.

Component 5 — AI Engine (LLM + RAG)

This component explains results.

Responsibilities:

Career Guidance
Resume Feedback
GitHub Suggestions
LinkedIn Suggestions
Interview Preparation
Learning Advice

The AI does not calculate readiness.

Instead, It explains the readiness.

5. System Layers

Our backend follows a layered architecture.

React
↓
Routes
↓
Controllers
↓
Services
↓
Business Logic
↓
Models
↓
MongoDB

React - Displays data.

Routes - Receive HTTP requests.

Controllers - Receive request, Call services, Return response, Controllers should contain almost no business logic.

Services - This is where business logic starts.

Services:

Read database
Validate data
Call Business Logic
Call AI
Save results
Business Logic

Calculates:

Readiness
Skill Gap
Learning Order
Models

Interact with MongoDB.

MongoDB - Stores data.

6. Student Request Flow

Example: Student logs in.

Student
↓
React Login Page
↓
POST /login
↓
Auth Controller
↓
Auth Service
↓
User Model
↓
MongoDB
↓
JWT Generated
↓
React Dashboard

7. AI Request Flow

Example: Student asks, "Am I ready for a Data Scientist internship?"

Student
↓
React Chat
↓
AI Controller
↓
AI Service
↓
Load Student Profile
↓
Load Career Requirements
↓
Load Skill Gap
↓
Load Readiness Score
↓
Retrieve Knowledge (RAG)
↓
Build Prompt
↓
LLM
↓
AI Response
↓
React

The AI does not query MongoDB directly. Everything goes through the backend.

8. Career CMS Flow

Ex: Admin adds New Certificate

Admin
↓
React CMS
↓
POST /certificates
↓
Certificate Controller
↓
Certificate Service
↓
MongoDB
↓
Success

Now, Student Dashboard Automatically sees New Certificate.

9. Authentication Flow

Register
↓
Password Hash
↓
MongoDB
↓
Login
↓
Verify Password
↓
JWT
↓
Protected APIs

10. Authorization Flow - Every protected request

Student Request
↓
JWT Verification
↓
Extract Role
↓
Role Middleware
↓
Student Route

OR

CMS Route

Students cannot access CMS. Admins cannot access Student-only functions that don't apply to them.

11. Data Flow Diagram
                 Student
                     │
                     ▼
             React Frontend
                     │
                     ▼
             Express Backend
                     │
        ┌────────────┼─────────────┐
        │            │             │
        ▼            ▼             ▼
 Authentication  Business Logic   AI Engine
        │            │             │
        └────────────┼─────────────┘
                     │
                     ▼
                  MongoDB

12. Separation of Responsibilities

Component        - Responsibility
React	         - User Interface
Express	         - APIs
Services	     - Business Logic Coordination
Business Logic	 - Calculations & Rules
MongoDB	         - Data Storage
AI               - Personalized Explanation
Career CMS	     - Content Management

13. Why This Architecture?

This architecture follows these software engineering principles:

Scalability - You can add new AI features or CMS modules without redesigning the whole system.

Maintainability - Business logic, AI, frontend, and database remain independent.

Testability - You can test business logic separately from AI responses.

Security - Only the backend communicates with MongoDB and the AI service.

14. Architecture Diagram (Final)
                          AI Career Mentor Platform

                        ┌──────────────────────────┐
                        │      React Frontend      │
                        │──────────────────────────│
                        │ Student Portal           │
                        │ Career CMS               │
                        └─────────────┬────────────┘
                                      │ REST API
                                      ▼
                ┌─────────────────────────────────────────┐
                │         Node.js + Express Backend       │
                │─────────────────────────────────────────│
                │ Authentication                          │
                │ Student Module                          │
                │ Career CMS Module                       │
                │ Business Logic Engine                   │
                │ AI Integration Module                   │
                └─────────────┬───────────────┬───────────┘
                              │               │
                              ▼               ▼
                     ┌────────────────┐   ┌─────────────────┐
                     │    MongoDB     │   │  LLM + RAG      │
                     │                │   │  AI Engine      │
                     └────────────────┘   └─────────────────┘
