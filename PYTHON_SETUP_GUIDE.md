# Python Setup Guide for Face Recognition

## ✅ Issue Fixed

The code now automatically detects Python installation on Windows, including:
- Standard Python installations (`python`, `python3`, `py`)
- Anaconda Python
- Python in common Windows locations

## 🔍 How It Works

The system will try to find Python in this order:
1. `python` command (if in PATH)
2. `python3` command (if in PATH)
3. `py` command (Windows Python launcher)
4. Anaconda Python (`%USERPROFILE%\anaconda3\python.exe`)
5. Standard Python installations in common locations

## 🐍 Python Requirements

For the face recognition feature to work, you need:

1. **Python 3.8 or higher**
2. **Required Python packages** (install in the `ai/` directory):
   ```bash
   cd ai
   pip install -r requirements.txt
   ```

   Or manually install:
   ```bash
   pip install opencv-python face-recognition numpy ultralytics cvzone torch
   ```

## 🛠️ Manual Python Path Configuration

If Python is still not found automatically, you can set it manually:

### Option 1: Add Python to PATH (Recommended)

1. Find your Python installation:
   ```powershell
   where.exe python
   ```

2. Add Python to System PATH:
   - Open "Environment Variables"
   - Add Python installation directory to PATH
   - Restart terminal/server

### Option 2: Set Environment Variable

Create or update `server/.env` file:
```env
PYTHON_PATH=C:\Users\mahan\anaconda3\python.exe
```

Then update `pythonScripts.js` to use this variable if set.

### Option 3: Use Anaconda

If you have Anaconda installed (which you do), you can:
1. Use Anaconda Prompt to run the server
2. Or activate conda environment before starting server:
   ```bash
   conda activate base
   npm run server
   ```

## 🧪 Testing Python Detection

The server will now log which Python command it's using:
```
[Python] Executing: C:\Users\mahan\anaconda3\python.exe -u D:\EL\...\ai\EncodeGenerator.py
```

If you see an error, check:
1. Python is installed: `python --version`
2. Required packages are installed: `pip list`
3. Server logs for Python detection messages

## 📝 Current Status

Based on your system:
- ✅ Python 3.12.7 is installed
- ✅ Anaconda Python is available
- ✅ Multiple Python installations detected

The code should now automatically use one of these installations.

## 🚨 Troubleshooting

### Error: "Python not found"
- Check Python is installed: `python --version`
- Try running server from Anaconda Prompt
- Check server logs for detection messages

### Error: "Module not found" (when running Python scripts)
- Install required packages: `pip install -r ai/requirements.txt`
- Make sure you're in the `ai/` directory when installing

### Error: "Camera not found"
- This is a different issue (webcam access)
- Make sure webcam is connected and not used by another app

## ✅ Next Steps

1. **Restart your server** - The Python detection should now work
2. **Test face recognition** - Try marking attendance
3. **Check server logs** - You'll see which Python is being used

The face recognition feature should now work! 🎉
