# 🧠 EduNexus – AI-Powered Learning & Career Platform

EduNexus is a full-stack application designed to help **students** learn anything, **teachers** generate content easily, and **job seekers** prepare for careers using AI and RAG-based systems.
Detailed feature descriptions for each can be found [here](https://github.com/haadirakhangi/Edunexus/blob/main/EduNexus-Server/README.md). 

**Watch the demo video [here](https://youtu.be/bBiEBwCm4q0).**

---
## 🚀 Installation & Setup Guide

### ✅ Prerequisites

Make sure you have:
- Node.js (v16+)
- Python 3.9+
- MongoDB (local or Atlas)
- Git
- pip / virtualenv / pipenv

---

### 🔧 Backend Setup (Flask)

1. **Navigate to backend directory:**
   ```bash
   cd EduNexus-Server/server-side
   ```

2. **Create & activate virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate   # macOS/Linux
   venv\Scripts\activate      # Windows
   ```

3. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables:**

   Create a `.env` file in `server-side/`:

   ```env
   GEMINI_API_KEY=your_gemini_key
   GOOGLE_SERP_API_KEY=your_google_serp_key
   SERPER_API_KEY=your_serper_key
   TAVILY_API_KEY1=your_tavily_key_1
   TAVILY_API_KEY2=your_tavily_key_2
   TAVILY_API_KEY3=your_tavily_key_3
   SECRET_KEY=your_flask_secret_key
   MONGO_PASS=your_mongodb_password
   ```

5. **Run the Flask server:**

   ```bash
   python app.py
   ```

---

### 🌐 Frontend Setup (React + Vite)

1. **Navigate to frontend directory:**

   ```bash
   cd EduNexus-Client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set environment variables:**

   ```bash
   VITE_GEMINI_API_KEY=your_gemini_key
   ```
   
4. **Run the frontend dev server:**

   ```bash
   npm run dev
   ```

   App will run at `http://localhost:5173`

---

### 🧪 Optional Scripts

* **To Generate Course Recommendations Dataset:**

  ```bash
  python create_csv.py
  ```

---
## ⚙️ Project Structure Overview

```

haadirakhangi-edunexus/
├── EduNexus-Client/         # Frontend (React + Vite)
└── EduNexus-Server/         # Backend (Flask)

````

### 📁 EduNexus-Client (Frontend)

- `src/components/` – Reusable React components (cards, navbar, dashboard widgets, etc.)
- `src/pages/` – Page-level components for each major section (Student, Teacher, Job Seeker)
- `src/contexts/` – React context for shared state (e.g., Live API context)
- `src/hooks/` – Custom React hooks (webcam/audio stream, screen capture, etc.)
- `src/assets/` – Static assets: fonts, images, styles
---

### 📁 EduNexus-Server (Backend)

- `app.py` – Entry point for the Flask server
- `create_csv.py` – Script to generate recommendation dataset for student-side engine
- `requirements.txt` – Python dependencies

#### 🔌 api/

Handles all external API integrations:
- `gemini_client.py` – Google Gemini integration
- `serper_client.py` – SERPER (Google Search)
- `tavily_client.py` – Tavily web search API

#### 🧠 core/

Contains core logic modules:
- `rag.py` – Retrieval-Augmented Generation pipeline
- `content_generator.py` – Main content generation logic
- `lesson_planner.py` – Syllabus to lessons generator
- `lab_manual_generator.py` – Automated lab manual creation
- `ppt_generator.py` – Presentation generator
- `skills_analyzer.py` – Skill gap and analysis engine
- `recommendation_generator.py` – Recommendation pipeline for student courses
- `pdf_generator.py` – PDF export functions

#### 🧱 models/

- `student_schema.py`, `teacher_schema.py` – MongoDB schema models
- `data_loader.py` – Loads and preprocesses training or static content
- `data_utils.py` – Utility functions for handling embeddings, preprocessing

#### 🌐 server/

Contains Flask route logic for each user type:
- `student/routes.py` – APIs for student course generation & access
- `teacher/routes.py` – APIs for course creation, lab manual, presentation
- `job_seeker/routes.py` – Job seeker flow (survey, quiz, simulations)
- `config.py` – Flask configuration (secret key, DB URIs)
- `utils.py` – Shared backend utilities
- `constants.py` – Shared constants
- `downloads/` – Generated pdfs for download in student side
---
