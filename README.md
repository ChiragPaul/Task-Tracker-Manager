#  MERN Task Tracker Pro

A beautifully designed, full-stack Task Management web application built with the MERN stack (MongoDB, Express, React, Node.js). 

This project goes beyond a standard CRUD application by delivering a **premium user experience**. It features a stunning deep-black glassmorphism UI, fluid micro-animations powered by Framer Motion, and a highly interactive, queue-based task management system.

---

##  Key Features

- **End-to-End MERN Stack**: Complete integration from a MongoDB Atlas cloud database through an Express/Node API, surfaced via a React (Vite) frontend.
- **Premium Glassmorphism UI**: A sleek, pitch-black aesthetic with subtle glowing accents and frosted glass containers for a hyper-modern look.
- **Dynamic Queue Design**: Tasks are rendered in a clean, centralized vertical queue.
- **Advanced Filtering & Sorting**: Instantly filter your queue by **Status** or **Priority**, and sort by newest first, due date, or priority level using custom pill-shaped dropdowns.
- **Interactive Animations**:
  - **Fluid Hover States**: Task cards remain compact by default. Hovering over a card smoothly expands it using Framer Motion to reveal descriptions, badges, and action buttons.
  - **Satisfying Strikethrough**: Click the completion checkbox to trigger a satisfying strikethrough animation that automatically updates the task's status in the database.
- **Visual Progress & Priority**:
  - **Circular Time-Left Progress**: A beautiful SVG radial progress bar visually indicates the time elapsed since creation versus the due date.
  - **Glowing Priority Dots**: Instantly recognize task urgency (High, Medium, Low) via glowing neon indicators directly on the compact card.
- **Robust RESTful API**: Structured backend routing and Mongoose schemas with built-in validation and error handling.

---

##  Tech Stack

### Frontend
- **React.js (Vite)**
- **Framer Motion** (For fluid layout animations and transitions)
- **Lucide React** (For crisp, modern SVG icons)
- **Axios** (For API communication)
- **date-fns** (For robust date formatting)
- **Vanilla CSS** (Custom styling without bloat)

### Backend
- **Node.js & Express.js** (Server & Routing)
- **MongoDB & Mongoose** (Database & Schema Modeling)
- **dotenv** (Environment variable management)
- **cors** (Cross-Origin Resource Sharing)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd task-tracker
\`\`\`

### 2. Backend Setup
1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a \`.env\` file in the \`backend\` directory and add your MongoDB connection string and Port:
   \`\`\`env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=TaskTracker
   \`\`\`
4. Start the backend server:
   \`\`\`bash
   npm start
   \`\`\`
   *(The server will run on http://localhost:5000)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   *(The app will be running on http://localhost:5173)*

---

##  Usage & Highlights

1. **Create a Task**: Click the "+ New Task" button, fill in the details including Due Date and Time, and hit save.
2. **Interact**: Hover over your newly created task to watch the card elegantly expand.
3. **Filter**: Use the custom pill-dropdowns at the top to filter down your list instantly.
4. **Complete**: Check the circle next to a task title to watch it strike through and automatically update its status to "Completed"!

---

*Designed and engineered to demonstrate full-stack proficiency, database management, REST API architecture, and advanced UI/UX design.*
