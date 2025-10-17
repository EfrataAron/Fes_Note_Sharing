# Fes Notes 📝

A beautiful, modern note-taking application built with React and Node.js. Organize your thoughts with colorful, intuitive notes that sync seamlessly across your devices.

## ✨ Features

### 🎨 **Beautiful Design**
- Modern, clean interface with purple theme
- Responsive design that works on all devices
- Smooth animations and hover effects
- Sticky notes background on login/register pages

### 📝 **Note Management**
- Create, edit, and delete notes
- Rich text content support
- Real-time search functionality
- Click anywhere on a note to open it

### 🌈 **Color Coding**
- 6 beautiful color options for notes
- Visual organization with colored backgrounds
- Easy color selection in note editor
- Automatic color fallback system

### 🔐 **User Authentication**
- Secure user registration and login
- JWT token-based authentication
- Password encryption with bcrypt
- Protected routes and user sessions

### 🔍 **Search & Organization**
- Real-time search through note titles and content
- Debounced search for optimal performance
- Clean, organized dashboard view
- Animated note cards with staggered loading

### 💫 **User Experience**
- Custom delete confirmation modals
- Loading states and error handling
- Smooth navigation between pages
- Intuitive click-to-edit functionality

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher) - JavaScript runtime
- **MySQL** - Local MySQL server installation
- **npm** - Node package manager ( Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fes-notes
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Database Setup**
   - Ensure MySQL is running on your local machine
   - Create a MySQL database named `fes_notesdb`
   - The application will automatically create the required tables on first run

4. **Environment Configuration**
   Create a `.env` file in the server directory with your local MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=fes_notesdb
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```
 JWT_SECRET can be generated from https://generate-secret.vercel.app/32 
5. **Start the development servers**
   
   **Terminal 1 - Start Backend Server:**
   ```bash
   cd server
   npm start
   # Server will run on http://localhost:5000
   ```
   
   **Terminal 2 - Start Frontend Development Server:**
   ```bash
   cd client
   npm start
   # React app will open automatically at http://localhost:3000
   ```

6. **Access the application**
   - **Frontend**: http://localhost:3000 (React development server)
   - **Backend API**: http://localhost:5000 (Node.js/Express server)
   - **Database**: Local MySQL on default port 3306

## 🏗️ Project Structure

```
fes-notes/
├── client/                 # React frontend
│   ├── public/
│   │   └── images/         # Static images
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── NoteEditor.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Navbar.js
│   │   ├── context/        # React context
│   │   │   ├── AuthContext.js
│   │   │   └── NotesContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   ├── .env               # Environment variables
│   └── package.json
└── README.md
```

## 🎯 How to Use

### **Getting Started**
1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View all your notes in a beautiful grid layout

### **Creating Notes**
1. Click the "New Note" button in the navbar or dashboard
2. Choose a color for your note (6 options available)
3. Add a title and content
4. Click "Save Note" to store your note

### **Managing Notes**
- **View/Edit**: Click anywhere on a note card to open the editor
- **Search**: Use the search bar to find notes by title or content
- **Delete**: Click the trash icon and confirm in the modal
- **Color Change**: Edit a note and select a different color

### **Navigation**
- **Dashboard**: Overview of all your notes
- **Note Editor**: Create or edit individual notes
- **User Profile**: Shows in the navbar with logout option

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

### **Development Tools**
- **Create React App** - React development setup with hot reload
- **nodemon** - Auto-restart server during development (if configured)
- **dotenv** - Environment variable management
- **MySQL Workbench** - Optional GUI for database management

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### **Notes**
- `GET /api/notes` - Get all user notes (with optional search)
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update existing note
- `DELETE /api/notes/:id` - Delete note

### **Utility**
- `GET /api/health` - Server health check

## 🎨 Color Options

The application supports 6 beautiful color themes for notes:
- **Yellow** - Classic sticky note color
- **Pink** - For personal or important notes
- **Blue** - Professional or work-related notes
- **Green** - Ideas or creative thoughts
- **Purple** - Matches the app theme
- **Orange** - Urgent or action items

## 🔒 Security Features

- **Password Hashing**: All passwords encrypted with bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: API endpoints require valid tokens
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Prevents abuse with request limits
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet Security**: Additional security headers

## 💻 Local Development

This application is designed to run locally on your development machine using Node.js and MySQL.

### **Development Setup**
- **Frontend**: React development server on `http://localhost:3000`
- **Backend**: Node.js/Express server 
- **Database**: Local MySQL database
- **Hot Reload**: Both frontend and backend support hot reloading during development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request



## 👨‍💻 Author

Created with ❤️ by EFRATA ARON

---

**Fes Notes** - Where your thoughts become beautifully organized! ✨
