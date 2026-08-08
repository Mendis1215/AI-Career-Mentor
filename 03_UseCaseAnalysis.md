Step 1.3 – Use Case Analysis

AI Career Mentor Platform

Step 1.3 – Use Case Analysis

1. Actors

system has **three primary actors**.
1. Student

The main user of the platform.

The student wants to:

* Register
* Login
* Complete profile
* Assess skills
* Track internship readiness
* Learn missing skills
* Chat with AI

Career CMS Administrator

The administrator manages all platform content.

The administrator **does not** mentor students.

Instead, they manage:

* Degree Programs
* Career Paths
* Skills
* Certificates
* Learning Resources
* Interview Questions
* Student Accounts

3. AI Career Mentor

This is an internal system actor.

It performs tasks such as:

* Skill Gap Explanation
* Resume Analysis
* GitHub Review
* LinkedIn Review
* Career Guidance
* Learning Recommendations

The AI never changes database records directly.

2. Student Use Cases

Authentication

Student can:
* Register
* Login
* Logout
* Reset Password
* Change Password

Profile Management

Student can:
* Create Profile
* Edit Profile
* View Profile
* Upload Resume
* Add GitHub URL
* Add LinkedIn URL

Degree & Career

Student can:
* Select Degree
* Select Career Goal
* Change Career Goal
* View Career Information

Skill Assessment

Student can:
* View Required Skills
* Update Skill Levels
* Save Skill Assessment
* View Skill Gap

Projects

Student can:
* Add Project
* Update Project
* Delete Project
* View Projects

Certificates

Student can:
* View Recommended Certificates
* Add Completed Certificates
* Delete Completed Certificates

Dashboard

Student can:
* View Internship Readiness Score
* View Missing Skills
* View Recommended Skills
* View Learning Roadmap
* View Dashboard Statistics

GitHub

Student can:
* Analyze GitHub Profile
* View GitHub Suggestions

LinkedIn

Student can:
* Analyze LinkedIn Profile
* View LinkedIn Suggestions

Resume

Student can:
* Upload Resume
* Analyze Resume
* View Resume Suggestions

AI Career Mentor

Student can:
* Start Chat
* Ask Career Questions
* Ask Interview Questions
* Ask Learning Questions
* View Chat History

Student Use Case Diagram

                    +-----------------------+
                    |      Student          |
                    +-----------+-----------+
                                |
      --------------------------------------------------------
      |        |        |        |        |        |          |
      ▼        ▼        ▼        ▼        ▼        ▼          ▼
 Register   Login   Profile   Skills   Projects Dashboard  AI Chat
                       |          |          |         |
                       ▼          ▼          ▼         ▼
                  Upload Resume  Skill Gap  Certificates Roadmap
                       |
                       ▼
             GitHub / LinkedIn Analysis


3. Career CMS Administrator Use Cases
Authentication

Admin can:
* Login
* Logout
* Change Password

Dashboard

Admin can:
* View Statistics
* View Student Count
* View Degree Statistics
* View Career Statistics

Degree Management

Admin can:
* Add Degree
* Edit Degree
* Delete Degree
* Activate Degree

Career Management

Admin can:
* Add Career
* Edit Career
* Delete Career

Skill Management

Admin can:
* Add Skill
* Edit Skill
* Delete Skill

Career Requirement Management

Admin can:
Assign Skills
Remove Skills
Set Required Levels
Set Skill Weights

Certificate Management

Admin can:
Add Certificate
Edit Certificate
Delete Certificate

Learning Resource Management

Admin can:
Add Resource
Edit Resource
Delete Resource

Interview Question Management

Admin can:
Add Question
Edit Question
Delete Question

Student Management

Admin can:
View Students
Search Students
Disable Student
Activate Student

Admin Use Case Diagram

                +---------------------------+
                | Career CMS Administrator  |
                +------------+--------------+
                             |
    ---------------------------------------------------------
    |         |          |         |        |       |        |
    ▼         ▼          ▼         ▼        ▼       ▼        ▼
 Dashboard Degrees Careers Skills Certificates Resources Students
                               |
                               ▼
                     Career Skill Requirements


4. AI Career Mentor Use Cases

The AI performs analysis based on student data.

The AI ca:

Generate Skill Gap Explanation
Recommend Learning Roadmap
Recommend Certificates
Analyze Resume
Analyze GitHub
Analyze LinkedIn
Answer Career Questions
Explain Internship Readiness
Suggest Next Learning Steps


AI Workflow:

Student Question
        │
        ▼
Student Profile
        │
        ▼
Retrieve Career Data
        │
        ▼
Retrieve Learning Resources
        │
        ▼
Generate Prompt
        │
        ▼
LLM + RAG
        │
        ▼
Personalized Response

5. System-Level Use Cases

These are automatic actions performed by the backend.

The system shall:
Authenticate users
Authorize access based on roles
Calculate Internship Readiness Score
Perform Skill Gap Analysis
Generate Learning Roadmap
Recommend Certificates
Store Chat History
Log System Errors
Validate User Input

6. Use Case Relationships

<<include>>

These actions are always required.

Examples:

Login → Authenticate User
Skill Assessment → Save Skill Levels
AI Chat → Retrieve Student Profile
AI Chat → Retrieve Knowledge Base

<<extend>>

These are optional or conditional.

Examples:
Dashboard → Show AI Recommendations
Dashboard → Show Roadmap
Resume Upload → Resume Analysis
GitHub Analysis → AI Suggestions

7. Overall Use Case Diagram

                          AI Career Mentor Platform

          +------------------------------------------------------+

        Student                          Career CMS Admin

            |                                      |

            |                                      |

    --------------------               -------------------------

    | Login           |               | Login                 |

    | Profile         |               | Dashboard             |

    | Skill Assessment|               | Manage Degrees        |

    | Projects        |               | Manage Careers        |

    | Certificates    |               | Manage Skills         |

    | Dashboard       |               | Manage Certificates   |

    | GitHub Analysis |               | Manage Resources      |

    | LinkedIn        |               | Manage Interviews     |

    | Resume Analysis |               | Manage Students       |

    | AI Chat         |               |                       |

    --------------------               -------------------------

                      \                     /

                       \                   /

                        \                 /

                          AI Career Mentor

                       Skill Gap Analysis

                    Internship Readiness

                     Learning Roadmap

                 Certificate Recommendation

                     Resume Analysis

                  GitHub / LinkedIn Analysis


8. Main User Journey

Student Journey:

Register
     │
     ▼
Login
     │
     ▼
Complete Profile
     │
     ▼
Select Degree
     │
     ▼
Select Career Goal
     │
     ▼
Complete Skill Assessment
     │
     ▼
Backend Analysis
     │
     ▼
Internship Readiness Score
     │
     ▼
Dashboard
     │
     ▼
Chat with AI
     │
     ▼
Improve Skills
     │
     ▼
Update Profile
     │
     ▼
Track Progress


Career CMS Journey:

Admin Login
      │
      ▼
Dashboard
      │
      ▼
Manage Degrees
      │
      ▼
Manage Careers
      │
      ▼
Manage Skills
      │
      ▼
Manage Certificates
      │
      ▼
Manage Learning Resources
      │
      ▼
Manage Interview Questions
      │
      ▼
Monitor Students
