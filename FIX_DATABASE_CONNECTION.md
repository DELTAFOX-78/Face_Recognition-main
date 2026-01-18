# Fix Database Connection Issue

## Problem
The server is connecting to the `DB` database, but your users are in the `face_recognition` database.

## Solution

### Option 1: Create .env file in server directory (Recommended)

1. **Create a file named `.env` in the `server/` directory** with this content:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/face_recognition
JWT_SECRET=your-secret-key-change-this-in-production-12345
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

2. **Restart your server**:
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run server
   ```

### Option 2: Copy existing .env file

If you already have a `.env` file in the root directory, copy it to the server directory:

```powershell
Copy-Item ".env" -Destination "server\.env"
```

Then make sure the `MONGODB_URI` in `server/.env` is:
```
MONGODB_URI=mongodb://127.0.0.1:27017/face_recognition
```

## Verify

After creating the file and restarting the server, you should see in the server logs:
```
Mongo URI: mongodb://127.0.0.1:27017/face_recognition
📦 DB Name: face_recognition
```

Then try logging in with:
- **Teacher**: username: `teacher1`, password: `password123`
- **Student**: username: `student1`, password: `password123`

The login should now work! ✅
