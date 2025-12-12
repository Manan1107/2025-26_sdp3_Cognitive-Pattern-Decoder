# 🧠 **COGNITIVE PATTERN DECODER**  
## *AI-BASED CODING BEHAVIOR ANALYSIS SYSTEM*

---

# 📌 **OVERVIEW**
The **COGNITIVE PATTERN DECODER** is an **AI-powered system** that analyzes a programmer’s **CODING BEHAVIOR**, not code quality.  
A custom **VS CODE EXTENSION** tracks developer behavior like typing rhythm, error patterns, switching habits, and thinking time.

A **MACHINE LEARNING MODEL** then classifies the developer into:

- 🧩 **ANALYTICAL**  
- ⚡ **INTUITIVE**  
- 🎨 **CREATIVE**  
- 🧐 **DETAIL-ORIENTED**

A **REACT DASHBOARD** displays all insights using clean visual charts.

---

# ⭐ **KEY FEATURES**

## 🔹 **REAL-TIME BEHAVIOR TRACKING**
- Typing speed  
- Backspace/error frequency  
- Idle / thinking time  
- File switching patterns  
- Save/compile events  
- Burst typing patterns  

## 🔹 **COGNITIVE STYLE CLASSIFICATION**
- ML-based behavior analysis  
- Outputs cognitive style + confidence score  

## 🔹 **INTERACTIVE ANALYTICS DASHBOARD**
- Typing speed graph  
- Error trend visualization  
- Focus consistency  
- File-switch heatmap  
- Session comparison  
- Final cognitive summary  

## 🔹 **PRIVACY-FIRST DESIGN**
- NO source code is collected  
- Only behavioral metrics are stored  

---

# 🏗️ **SYSTEM ARCHITECTURE**

```
VS CODE EXTENSION  
        ↓  
NODE.JS BACKEND (PREPROCESSING + API)  
        ↓  
PYTHON ML MODEL (FEATURE ENGINEERING + CLASSIFICATION)  
        ↓  
MONGODB (DATA STORAGE)  
        ↓  
REACT DASHBOARD (VISUALIZATION)
```

---

# 🔄 **PROJECT FLOW**

### **1️⃣ USER STARTS CODING IN VS CODE**  
Extension records behavioral events.

### **2️⃣ EXTENSION SENDS DATA TO BACKEND**  
Behavior metrics → JSON packets.

### **3️⃣ BACKEND PREPROCESSES + STORES DATA**  
Calculates metrics like speed, error rate, idle time.

### **4️⃣ BACKEND SENDS METRICS TO ML MODEL**  

### **5️⃣ ML MODEL PREDICTS COGNITIVE STYLE**  
Returns a category + confidence value.

### **6️⃣ BACKEND SAVES PREDICTION**  

### **7️⃣ DASHBOARD FETCHES INSIGHTS**  

### **8️⃣ USER SEES ANALYTICS & COGNITIVE REPORT**

---

# 🧰 **TECHNOLOGY STACK**

| COMPONENT | TECHNOLOGY |
|----------|-------------|
| **IDE EXTENSION** | TypeScript (VS Code API) |
| **BACKEND API** | Node.js, Express.js |
| **DATABASE** | MongoDB |
| **ML MODEL** | Python, FastAPI/Flask, Scikit-learn |
| **DASHBOARD** | React.js, Recharts / Chart.js |

---

# 🧩 **PROJECT MODULES**

## **1️⃣ VS CODE EXTENSION**
- Captures keystrokes  
- Backspace & save events  
- File switching  
- Sends behavior metrics  

## **2️⃣ BACKEND (NODE.JS)**
- REST API  
- Data preprocessing  
- MongoDB storage  
- Communicates with ML model  

## **3️⃣ MACHINE LEARNING MODULE**
- Feature engineering  
- Cognitive classification  
- Outputs cognitive profile  

## **4️⃣ REACT ANALYTICS DASHBOARD**
- Visual charts  
- Behavior trends  
- Cognitive insights  
- Multi-session comparison  

---

# 🧠 **MACHINE LEARNING FEATURES**

| FEATURE | DESCRIPTION |
|---------|-------------|
| **AVG TYPING SPEED** | Pace of code writing |
| **SPEED VARIANCE** | Rhythm & stability |
| **ERROR RATE** | Backspace usage |
| **IDLE TIME RATIO** | Thinking pauses |
| **FILE SWITCH SCORE** | Navigation pattern |
| **BURST TYPING SCORE** | Creativity bursts |
| **STABILITY INDEX** | Structured vs chaotic coding |

These features help classify behavior accurately.

---

# ⚙️ **INSTALLATION GUIDE**

## **1️⃣ CLONE REPOSITORY**
```bash
git clone https://github.com/your-repo/cognitive-pattern-decoder.git
cd cognitive-pattern-decoder
```

## **2️⃣ BACKEND SETUP**
```bash
cd backend
npm install
npm start
```

## **3️⃣ ML SERVICE SETUP**
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

## **4️⃣ DASHBOARD SETUP**
```bash
cd dashboard
npm install
npm start
```

## **5️⃣ INSTALL & RUN VS CODE EXTENSION**
Load the extension → Run extension host.

---

# 📁 **FOLDER STRUCTURE**

```
/backend
   /routes
   /controllers
   /models
   server.js

/ml-service
   /models
   /features
   app.py

/vscode-extension
   extension.js
   package.json

/dashboard
   /src
      /components
      /charts
      App.js
```

---

# 📜 **SRS SUMMARY**

## **FUNCTIONAL REQUIREMENTS**
- Real-time behavior capture  
- Preprocessing & storage  
- ML-based classification  
- Dashboard analytics  

## **NON-FUNCTIONAL REQUIREMENTS**
- Lightweight extension  
- Fast response backend  
- Secure data processing  
- Easy-to-understand UI  

## **USER TYPES**
- Students  
- Developers  
- Teachers & Researchers  

---

# 🔮 **FUTURE ENHANCEMENTS**
- Eye-tracking integration  
- Stress-level detection  
- Deep learning cognitive profiling  
- Support for IntelliJ, PyCharm, Eclipse  
- Real-time productivity suggestions  

---

# 👥 **CONTRIBUTORS**
- **MEMBER 1:** VS Code Extension + Backend  
- **MEMBER 2:** ML Model + Dashboard  
