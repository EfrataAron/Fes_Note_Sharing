# 📝 Note Sharing Application

A modern, full-stack note-sharing application built with React, Node.js, and MySQL. Users can create, manage, and organize their personal notes with markdown support, search functionality, and a beautiful responsive interface.

## ✨ Features

### Core Features
- **User Authentication**: Secure login and registration system with JWT tokens
- **Note Management**: Create, read, update, and delete personal notes
- **Markdown Support**: Rich text formatting with live preview
- **Search & Filter**: Find notes quickly with real-time search
- **Responsive Design**: Beautiful UI that works on all devices
- **Data Persistence**: Notes are securely stored in MySQL database

### Advanced Features
- **Real-time Search**: Search through note titles and content
- **Sorting Options**: Sort notes by title, creation date, or last modified
- **Auto-save**: Automatic saving with keyboard shortcuts (Ctrl+S)
- **Preview Mode**: Toggle between edit and preview modes
- **Security**: Password hashing, rate limiting, and input validation
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Markdown** - Markdown rendering
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL2** - MySQL database driver
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL** - Relational database for data persistence

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Fes_Note_Sharing
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up the database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE note_sharing_db;
   ```

4. **Configure environment variables**
   ```bash
   # Copy the example config file
   cp server/config.env server/.env
   
   # Edit server/.env with your database credentials
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=note_sharing_db
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

6. **Open your browser**
   Navigate to `http://localhost:3000` to see the application.

## 📁 Project Structure

```
Fes_Note_Sharing/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/       # React context providers
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── index.js           # Main server file
│   ├── package.json
│   └── config.env         # Environment configuration
├── package.json           # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Notes
- `GET /api/notes` - Get all user notes (with search and sort)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Health Check
- `GET /api/health` - Server health status

## 🎨 UI Components

### Pages
- **Login** - User authentication
- **Register** - New user registration
- **Dashboard** - Notes overview with search and sorting
- **Note Editor** - Create and edit notes with markdown support

### Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - Clean, modern interface
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages
- **Keyboard Shortcuts** - Ctrl+S to save notes

## 🔒 Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured for production security
- **Helmet Security** - Additional security headers

## 📱 Usage Guide

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **Create** your first note by clicking "New Note"
3. **Write** your content using markdown syntax
4. **Save** your note (Ctrl+S or click Save button)
5. **Search** and **sort** your notes on the dashboard

### Markdown Support
The editor supports standard markdown syntax:
- `**bold text**` → **bold text**
- `*italic text*` → *italic text*
- `# Heading` → Large heading
- `- List item` → Bullet point
- `` `code` `` → `inline code`

### Keyboard Shortcuts
- `Ctrl+S` - Save current note
- `Escape` - Cancel current action

## 🚀 Deployment

### Production Build
```bash
# Build the frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=your_production_db_name
JWT_SECRET=your_production_jwt_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
- Ensure MySQL is running
- Check database credentials in `.env` file
- Verify database exists

**Port Already in Use**
- Change PORT in `.env` file
- Kill existing processes on ports 3000/5000

**Authentication Issues**
- Clear browser localStorage
- Check JWT_SECRET is set correctly

**Build Errors**
- Delete `node_modules` and run `npm install` again
- Ensure Node.js version is 16+

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information

---

**Happy Note Taking! 📝✨**