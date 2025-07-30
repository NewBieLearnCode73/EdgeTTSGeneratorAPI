# EdgeTTSGeneratorAPI

## Description

EdgeTTSGeneratorAPI is a RESTful API built with Node.js to integrate Microsoft Edge's Text-to-Speech (TTS) service. This API provides features for user management, authentication, quota control, and conversion history of text-to-speech.

## System Requirements

### Required Software

* **Node.js** (version 16.x or higher)
* **Python** (version 3.7 or higher)
* **MongoDB** (version 4.4 or higher)
* **npm** or **yarn**
* **BREVO API KEY**

### Install Python and Edge-TTS

1. **Install Python:**

   * Download and install Python from [python.org](https://www.python.org/downloads/)
   * Make sure Python is added to your PATH

2. **Install Edge-TTS:**

   ```bash
   pip install edge-tts
   ```

   See more details at [Edge-TTS](https://github-com.translate.goog/rany2/edge-tts?_x_tr_sl=en&_x_tr_tl=vi&_x_tr_hl=vi&_x_tr_pto=tc)

3. **Verify installation:**

   ```bash
   edge-tts --help
   ```

## Setup and Configuration

### 1. Clone the repository

```bash
git clone https://github.com/NewBieLearnCode73/EdgeTTSGeneratorAPI.git
cd EdgeTTSGeneratorAPI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# Server Configuration
SERVER_PORT=your_server_port

# MongoDB Configuration
MONGODB_URL=your_mongo_url

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (Brevo/SendinBlue)
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=your_sender_email@example.com

# Front end
FRONTEND_URL=your_front_end_url
```

### 4. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 5. Run the application

#### Development mode:

```bash
npm run start
```

The server will run at `http://localhost:` + the `SERVER_PORT` you configured.

## Project Structure

```
EdgeTTSGeneratorAPI/
├── config/                 # App configuration
├── controllers/           # Business logic controllers
├── errors/                # Global error handling
├── middlewares/           # Authentication and validation middleware
├── models/                # MongoDB models
├── routes/                # API route definitions
├── services/              # Business logic services
├── storage/               # Audio file storage, auto-generated on first run
├── utils/                 # Utility functions
├── index.js               # Entry point
├── package.json           # Dependencies and scripts
└── README.md              # Documentation
```

## API Endpoints

### Authentication

* `POST /api/v1/auth/register` - Register a new account
* `POST /api/v1/auth/login` - Login
* `PATCH /api/v1/auth/change-password` - Change password

### Voices Management

* `GET /api/v1/voices` - Get list of available voices
* `GET /api/v1/voices/:filename` - Get generated voice file
* `POST /api/v1/voices` - Convert text to speech

### User Quota

* `GET /api/v1/user-quotas` - Get all user quotas
* `GET /api/v1/today/:username` - Get remaining quota for a user today
* `GET /api/v1/user-quotas/today/reset/:username` - Reset today's quota to 0 for a user

### User Management

* `GET /api/v1/users` - Get all users
* `GET /api/v1/users/profile` - Get current user profile
* `PATCH /api/v1/users/change-role` - Change a user's role

### TTS History

* `GET /api/v1/tts-histories` - Get all TTS conversion history
* `GET /api/v1/tts-histories/username/:username` - Get history of a specific user
* `GET /api/v1/tts-histories/filename/:filename` - Get history details of a specific file

## Using Edge-TTS

### Basic commands

```bash
# List all available voices
edge-tts --list-voices

# Convert text to speech
edge-tts --voice "vi-VN-HoaiMyNeural" --text "Xin chào, đây là test" --write-media output.mp3

# Filter voices by language
edge-tts --list-voices | grep "vi-VN"
```

### Integration in code

This API uses `edge-tts` via `child_process` to convert text into speech.

## Troubleshooting

### Common Errors

1. **Edge-TTS not installed:**

   ```bash
   pip install --upgrade edge-tts
   ```

2. **MongoDB connection error:**

   * Ensure MongoDB is running
   * Check the connection string in the `.env` file

3. **JWT error:**

   * Ensure `JWT_SECRET` is properly configured in `.env`

4. **Python path issue:**

   ```bash
   # Windows
   where python

   # macOS/Linux
   which python3
   ```
## License

This project is licensed under the ISC License.

## Contact

* GitHub: [NewBieLearnCode73](https://github.com/NewBieLearnCode73)
* Email: [ndchieu73@gmail.com](mailto:ndchieu73@gmail.com)

## Additional Notes

* Make sure Python and edge-tts are installed before running the API
* Check if firewall or antivirus is blocking edge-tts
* On Windows, you may need to run PowerShell/CMD as Administrator