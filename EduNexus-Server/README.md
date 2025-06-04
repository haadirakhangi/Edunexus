# EduNexus

## 👩‍🏫 Teacher Side – Features

The Teacher Side of **Edunexus** is designed to empower educators by automating and enhancing the process of creating and delivering structured educational content. Below is a comprehensive list of features:

### 📘 Course & Lesson Planning

* **Syllabus-Based Course Creation**
  Teachers can upload a complete syllabus (as PDF or via URLs) to auto-generate a structured lesson plan.
* **Custom Lesson Setup**
  Specify lesson count, names, style (e.g. theoretical, mathematical, analytical), and preferred content focus (e.g. include examples, problems, formulae).

---

### 🧠 Multimodal RAG-Based Content Generation

* **Dynamic Knowledge Extraction**
  Uses a Multimodal Retrieval-Augmented Generation (RAG) pipeline to extract relevant knowledge from documents, web links, and live web searches.
* **Document Preprocessing**
  Supports multilingual documents; uses language detection and automatic translation for non-English content.
* **Parallel Text & Image Processing**

  * **Text Vector DB:** Documents are chunked and embedded using Google’s Generative AI embeddings and stored in FAISS.
  * **Image Vector DB:** Extracted images are processed with CLIP embeddings for semantic search.
* **Web & Link Support**
  Teachers can input article links or use integrated web search (via Tavily API) to dynamically pull relevant content.

---

### ✍️ Submodule Generation & Editing

* **Submodule Creation**
  Course modules are automatically divided into submodules using AI-based segmentation.
* **Content Synthesis**
  Combines top-matching text and images via similarity search and LLM-based synthesis.
* **Visual Enhancements**

  * Integrates images from documents, web, or AI-generated visuals using SDXL-Turbo.
  * Teachers can edit or replace images manually.

---

### 🧪 Lab Manual Generator

* **Component-Based Lab Creation**
  Teachers select elements like Apparatus, Theory, Procedure, Observations, Results, and Conclusion.
* **Editable Output**
  Generated lab manual is displayed in Markdown format and can be downloaded as a Word (.docx) file.

---

### 📊 Presentation Generator

* **Slide Suggestion via AI**
  Generates slide titles using LLMs based on lesson content.
* **Content Embedding & Mapping**
  Retrieves relevant submodule content using vector similarity for each slide.
* **Image Integration**

  * Auto-generates images using SDXL-Turbo (via image prompts).
  * If no image is needed, relevant images are scraped from the web.

---

### ☁️ Course Publishing & Sharing

* **Cloud Storage**
  All created content is stored in MongoDB.
* **Course Sharing**
  Courses are shareable with students using a **unique course code**.

---

### 🖼️ Interactive Markdown Editor

* View, edit, and preview lesson material and generated content in real-time using a live Markdown interface.

---

Absolutely! Below are the detailed feature lists in **Markdown format** for both the **Student Side** and **Job Seeker Side** of **Edunexus**, designed to be added directly to your GitHub README.

---

## 🎓 Student Side – Features

The Student Side of **Edunexus** is built to provide inclusive, personalized, and on-demand learning experiences for students of all backgrounds.

### 📚 AI-Powered Course Generation

* **Topic-Based Course Creation**
  Students can input any topic (technical or non-technical) and generate a full course, including syllabus, lesson plans, and structured content.
* **Web-Supported Generation**
  If the AI model lacks specific training data, advanced web scraping fills in gaps to create a comprehensive course.
* **Multi-Domain Coverage**
  Supports a wide range of domains—from STEM to humanities, business, and niche topics.

---

### 🧠 Personalized Recommendation System

* **AI-Generated Initial Recommendations**
  Initial courses are recommended using generative AI and stored in the database.
* **Contextual Similarity Matching**
  Uses DistilRoBERTa embeddings + cosine similarity to match students' learning interests with relevant modules.
* **Search-Aware Suggestions**
  Learning behavior and search queries are tracked to generate smarter, real-time suggestions.

---

### 💬 Context-Aware Virtual Assistant

* **Real-Time Help**
  Integrated virtual assistant understands the current lesson/module and offers contextual doubt-solving.
* **Topic-Aware Query Resolution**
  The assistant is trained to answer lesson-specific queries with clarity and relevance.

---

### 📥 Course Access via Code

* **Teacher-Generated Course Import**
  Students can enter a unique course code to instantly access and enroll in teacher-generated structured content.

---

### 🎯 Inclusive & Accessible Learning

* **Free & Personalized**
  Caters to economically weaker sections by offering generative educational content at no cost.
* **Dynamic Curriculum**
  Personalized and non-static curriculum adapts to each learner's goals and pace.

---

## 💼 Job Seeker Side – Features

The Job Seeker Side of **Edunexus** is designed to guide students from learning to employability by analyzing skills and providing personalized upskilling paths.

### 📝 Intelligent Onboarding

* **Welcome Survey**
  Collects data on user’s background, current skills, interests, motivations, and long-term career goals.

---

### 🧪 Skill Assessment Engine

* **Hard Skill Evaluation**
  Topic-based quizzes test technical and domain-specific knowledge.
* **Soft Skill Simulation**
  Real-world scenarios assess communication, leadership, crisis handling, and interpersonal skills.

---

### 🧩 AI-Powered Skill Gap Analysis

* **Role Matching Engine**
  Identifies suitable job roles based on current skills, career goals, and market trends.
* **Gap Identification**
  Compares existing vs. required skills and creates a personalized upskilling journey.

---

### 🎓 Learning Path Generation

* **Modular Course Roadmaps**
  Breaks required skills into manageable modules tailored to the user's goals.
* **Content Curation**
  Recommends top-rated courses from Coursera, Udemy, UpGrad, etc., and includes mentor-created content from Edunexus creators.

---

### 🧪 Job-Role Simulations

* **Real-World Role Practice**
  Simulates day-to-day tasks in specific job roles to help students gain hands-on, experiential knowledge.
* **Interview Preparedness**
  Familiarizes students with responsibilities and expectations before they enter the workforce.
