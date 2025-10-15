# 📝 Fes Note Sharing Application
A web app where users can log in, create, view, and delete their personal notes.
A secure, personal note-sharing web application built to allow users to create, manage, and access their private notes from anywhere. Each user's data is isolated and stored persistently to ensure **privacy and reliability**.

---

## ✨ Core Features

| Feature | Description |
| :--- | :--- |
| **User Login / Identification** | Users must sign in to access their unique, personal collection of notes. |
| **Create Notes** | Simple functionality for users to add and save new text notes. |
| **List Notes** | Displays all saved notes specifically belonging to the logged-in user. |
| **Delete Notes** | Allows users to permanently remove notes they no longer need. |

---

## 🚀 Recommended Stack

This application is built using a modern and scalable stack focused on performance and persistence:

| Component | Technology | Why This Choice? |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | For building a fast, interactive, and modern user interface. |
| **Backend** | **Node.js (Express)** | A lightweight and flexible framework for building the application's RESTful API. |
| **Database** | **MySQL** | A robust SQL database to ensure notes are stored securely and retrieved reliably (persistent storage). |

---

## 💡 Optional Future Enhancements

We plan to implement the following features to improve the user experience:

* **Markdown Input**: Support formatted text within notes (e.g., bold, lists, headings) for better organization.
* **Search / Filter**: Enable users to quickly locate notes by keyword or custom filters.
* **Public API**: Provide an external API interface to allow multiple users or external applications to interact with their notes programmatically.

---

## 🛠️ Local Setup (Getting Started)

### Prerequisites

* **Git** installed on your system.
* **Node.js** and **npm** installed.
* A running **MySQL** server instance.

### Installation

1.  **Clone the Repository**
    git clone [https://github.com/EfrataAron/Fes_Note_Sharing.git](https://github.com/EfrataAron/Fes_Note_Sharing.git)
    cd Fes_Note_Sharing
    

2.  **Install Dependencies**
    Navigate to the project directory 
    # Install root dependencies (if any)
    npm install
    # Navigate to the backend directory and install
    cd server # or backend, depending on your structure
    npm install
    # Navigate to the frontend directory and install
    cd ../client # or frontend, depending on your structure
    npm install
    

3.  **Database Configuration**
    * Create a database named `fes_note_sharing` in your MySQL instance.
    * Configure your database credentials (host, user, password) in a **`.env`** file in the backend directory.
    * Run any database migration or setup scripts included in the project.

4.  **Run the Application**
    npm run dev 
    
    
