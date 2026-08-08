AI Career Mentor Platform
Phase 2 – System Design
Step 2.2 – Database Design (Conceptual ERD & Collections)

1. Database Design Principles

Before creating collections, let's define our rules.

Rule 1 - Reference data must be managed by Career CMS.

Examples:
Degrees
Skills
Careers
Certificates

Rule 2 - Student data belongs to the student.

Examples:
Profile
Projects
Skill Assessment
Resume

Rule 3 - AI never owns data.

AI only:
Reads data
Analyzes data
Generates responses

Rule 4 - Business Logic calculates results, Database stores results.

2. Collection Categories

Module A — Authentication

Users:
Purpose - Stores login information.

Contains:
Email
Password
Role
Status

Owner
System

Module B — Student Module

Collections:
StudentProfiles
StudentSkills
Projects
StudentCertificates
ChatHistory
ResumeAnalysis
GithubAnalysis
LinkedinAnalysis
LearningProgress

These collections belong only to students.

Module C — Career CMS

Collections:
Degrees
Careers
Skills
DegreeSkillMappings
CareerSkillRequirements
Certificates
LearningResources
InterviewQuestions

These are managed only by administrators.

Module D — AI Module

Collections:
PromptTemplates
KnowledgeDocuments
Embeddings (Optional)
AIConfigurations

Later, RAG uses these.

3. Collection Responsibilities

Users - Stores: authentication. Nothing else.

StudentProfiles - Stores: Everything about the student.

StudentSkills - Stores: Current skill levels.

Projects - Stores: Portfolio projects.

StudentCertificates - Stores: Certificates completed by the student.

ChatHistory - Stores: AI conversations.

Degrees - Stores: Degree programs.
Example:
Data Science
Computer Science
Software Engineering

Careers - Stores: Career paths.
Example:
Data Scientist
AI Engineer
Software Engineer
Backend Developer

Skills - Stores: All possible skills.
Example:
Python
SQL
Git
React
Docker
TensorFlow

Notice, Python exists only once.

DegreeSkillMappings (Very important)

Relationship:
Degree
↓
Required Skills

Example:
Degree
↓
Data Science
↓
Python
SQL
Statistics
Machine Learning

CareerSkillRequirements

Relationship:
Career
↓
Required Skills
↓
Required Level
↓
Weight

Example:
Machine Learning Engineer
↓
Python
↓
Advanced
↓
10

Certificates - Stores: Recommended certificates.

LearningResources - Stores:
Courses
Books
Videos
Documentation

InterviewQuestions - Stores:
Questions
Answers
Difficulty

4. High-Level ERD
                         Users
                           │
                           │ 1
                           │
                           ▼
                   StudentProfiles
                           │
         ┌─────────────────┼──────────────────┐
         │                 │                  │
         ▼                 ▼                  ▼
 StudentSkills         Projects      StudentCertificates
         │
         ▼
       Skills
         ▲
         │
 DegreeSkillMappings
         │
         ▼
      Degrees
         │
         ▼
      Careers
         │
         ▼
CareerSkillRequirements
         │
         ▼
 InterviewQuestions
 Certificates
 LearningResources
 ChatHistory

5. Relationship Types
One User
↓
One Student Profile

One Degree
↓
Many Careers

One Degree
↓
Many Skills

One Career
↓
Many Required Skills

One Student
↓
Many Skills

Student
↓
StudentSkills

One Student
↓
Many Projects

One Student
↓
Many Certificates

One Student
↓
Many AI Chats

6. Master Data vs Transaction Data

This is a concept many students miss.

Master Data: Rarely changes. Managed by Admin.

Degrees
Careers
Skills
Certificates
Learning Resources
Interview Questions

Transaction Data: Created every day. Managed by Students.

Student Skills
Projects
Certificates
Chat History
Resume Analysis
GitHub Analysis
LinkedIn Analysis

7. Database Ownership
Collection	            |  Owner
Users	                |  System
StudentProfiles	        |  Student
StudentSkills	        |  Student
Projects	            |  Student
StudentCertificates	    |  Student
ChatHistory	            |  Student
Degrees	                |  Career CMS
Careers	                |  Career CMS
Skills	                |  Career CMS
DegreeSkillMappings	    |  Career CMS
CareerSkillRequirements	|  Career CMS
Certificates	        |  Career CMS
LearningResources	    |  Career CMS
InterviewQuestions	    |  Career CMS

8. Normalization Strategy

Instead of:
Degree
↓
Python
↓
Stored inside Degree

We use:
Degree
↓
Mapping
↓
Skill

Why? Because Python belongs to

Data Science
Computer Science
Software Engineering
Information Technology, We store it once.

9. Future Scalability

With this design, can easily add:

New degree programs
New career paths
New certifications
New skills
New AI features

without changing the database structure.

10. Final Conceptual Database Diagram
                           USERS
                              │
                              ▼
                     STUDENT PROFILES
                              │
      ┌──────────────┬────────┴───────────┬───────────────┐
      ▼              ▼                    ▼               ▼
STUDENT SKILLS   PROJECTS      STUDENT CERTIFICATES   CHAT HISTORY
      │
      ▼
    SKILLS
      ▲
      │
DEGREE SKILL MAPPINGS
      ▲
      │
   DEGREES
      │
      ▼
   CAREERS
      │
      ▼
CAREER SKILL REQUIREMENTS
      │
      ▼
INTERVIEW QUESTIONS

CERTIFICATES