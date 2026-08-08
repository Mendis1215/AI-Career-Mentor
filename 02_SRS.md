AI Career Mentor Platform
Step 1.2 – Software Requirements Specification (SRS)
1. Introduction
1.1 Purpose

The purpose of the AI Career Mentor Platform is to help university students prepare for internships and future careers by analyzing their current profile, identifying skill gaps, and providing personalized career guidance using AI.

The platform also provides a Career Content Management System (Career CMS) that allows administrators to manage career-related data without modifying the application code.

1.2 Project Goals

The system should:

Help students evaluate their career readiness.
Identify missing technical skills.
Recommend learning resources and certifications.
Generate personalized learning roadmaps.
Improve students' professional profiles.
Provide an AI mentor for career guidance.
Allow administrators to manage all career-related content.
1.3 Intended Users
Student

University students who want to prepare for internships and jobs.

Administrator

Users responsible for maintaining career information, skills, certifications, learning resources, and AI knowledge.

2. Functional Requirements

Module 1 – Authentication

Student
The student shall be able to:

Register an account
Login
Logout
Reset password
Change password
View profile
Edit profile
Admin

The administrator shall be able to:

Login
Logout
Change password
Manage administrator profile

Module 2 – Student Profile

The system shall allow students to maintain:

Personal Information
University
Faculty
Degree Program
Academic Year
Career Goal
English Proficiency
GitHub Profile
LinkedIn Profile
Resume
Bio

Module 3 – Degree & Career Selection

The system shall:

Display available degree programs
Display career paths for the selected degree
Allow students to change career goals later
Load relevant skills based on the selected degree
Module 4 – Skill Assessment

Students shall be able to:

View all required skills
Select their current skill level
Update skill levels anytime
View assessment history (future enhancement)
Module 5 – Projects

Students shall be able to:

Add projects
Edit projects
Delete projects
Add GitHub repository links
Add project descriptions
Add technologies used
Module 6 – Certificates

Students shall be able to:

View recommended certificates
Add completed certificates
Upload certificate links (optional)
Track completed certifications
Module 7 – Dashboard

The dashboard shall display:

Internship Readiness Score
Skill Gap Summary
Learning Progress
Career Goal
Recommended Certifications
Missing Skills
AI Recommendations
Recent Activities
Module 8 – Skill Gap Analysis

The backend shall:

Compare student skills with career requirements
Identify missing skills
Identify weak skills
Calculate completion percentage
Module 9 – Learning Roadmap

The system shall:

Generate personalized learning phases
Recommend learning order
Display completed and remaining topics
Update progress automatically
Module 10 – GitHub Analysis

The system shall allow students to:

Connect GitHub profile
Analyze repositories
Review portfolio quality
Receive improvement suggestions
Module 11 – LinkedIn Analysis

The system shall allow students to:

Add LinkedIn profile
Analyze profile quality
Receive profile improvement suggestions
Module 12 – Resume Analysis

The system shall:

Accept resume uploads
Analyze resume content
Suggest improvements
Identify missing skills
Recommend resume enhancements
Module 13 – AI Career Mentor

Students shall be able to:

Ask career-related questions
Ask learning-related questions
Ask interview preparation questions
Receive personalized recommendations
View previous conversations
Module 14 – Career CMS

Administrators shall manage:

Degree Programs:
Create
Update
Delete
Activate/Deactivate

Career Paths:
Create
Update
Delete

Skills:
Create
Update
Delete

Career Skill Requirements:
Assign skills to careers
Set required level
Set importance (weight)

Certificates:
Add certificates
Edit certificates
Delete certificates

Learning Resources:
Add learning resources
Edit learning resources
Delete learning resources

Interview Questions:
Add interview questions
Update interview questions
Delete interview questions

Student Management:
View students
Search students
Activate/Deactivate accounts

3. AI Functional Requirements

The AI shall:

Generate personalized responses.
Explain skill gap analysis.
Recommend learning roadmaps.
Suggest certification paths.
Review GitHub profiles.
Review LinkedIn profiles.
Analyze resumes.
Answer career-related questions using RAG.
Use the student's profile to personalize every response.

4. Non-Functional Requirements
Performance
Dashboard should load within 3 seconds under normal conditions.
API responses should be optimized for a smooth user experience.
Security

The system shall:
Encrypt passwords using bcrypt.
Use JWT authentication.
Enforce role-based authorization (Student/Admin).
Validate all user inputs.
Protect against common web vulnerabilities.
Reliability

The platform should:
Handle invalid requests gracefully.
Prevent data corruption.
Log application errors for debugging.
Scalability

The system should support:
New degree programs.
New career paths.
Additional AI features.
More users without major redesign.
Usability

The system should provide:
Clear navigation.
Responsive layouts.
Consistent interface.
Easy-to-understand feedback messages.
Maintainability

The project should use:
Modular folder structure.
Reusable components.
Clear API separation.
Layered architecture (Routes → Controllers → Services → Models).

5. User Roles

Student - Permissions:
Manage personal profile.
Complete skill assessment.
View dashboard.
Chat with AI.
Manage projects.
Manage certificates.

Administrator - Permissions:
Manage all reference data.
Manage students.
View dashboard statistics.
Update AI knowledge content.

6. Constraints
The project will use:
Frontend
React.js
Backend
Node.js
Express.js
Database
MongoDB
Authentication
JWT
Password Encryption
bcrypt
AI
LLM
RAG
Version Control
Git
GitHub

7. Assumptions
Students have internet access.
Students can self-assess their skill levels.
Administrators maintain career-related data.
The AI relies on up-to-date knowledge provided through the CMS.