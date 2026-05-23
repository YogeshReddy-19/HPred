# HPred — House Price Prediction Web App

HPred is a full-stack web application that predicts house prices in real-time. Users can log in, input 15 different features of a house (like bedrooms, square footage, and location coordinates), and get an instant price estimation powered by a machine learning model.

🚀 **Live Link:** [https://h-pred.vercel.app]

> 💡 **Tip to bypass loading delay:** This project is hosted on Render's free tier, which goes to sleep after inactivity. To wake up the servers instantly and avoid a 50-second delay when clicking "Predict", open these two links in a new tab first:
> - 🟢 [Wake up Node.js Backend API](https://hpred.onrender.com)
> - 🐍 [Wake up Python ML Engine](https://hpred-ml.onrender.com)

---

## 🏗️ How it Works (Architecture)

The app is split into three simple parts:
1. **Frontend (React):** A clean, responsive dashboard where users input house details and view their calculation history.
2. **Backend Gateway (Node.js & Express):** Handles user authentication, hashes passwords safely, tracks user history, and talks to the machine learning server.
3. **ML Microservice (Python & FastAPI):** A lightweight server dedicated entirely to running the prediction model.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Axios (for API calls)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (stores user accounts and their prediction histories)
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt (for secure password hashing)
- **Machine Learning:** Python, FastAPI, XGBoost Regression, Joblib

---

## ⚙️ Real-World Constraints

* **Geographical Boundary (Kaggle Dataset):** The underlying machine learning model was trained on a structural King County housing dataset from Kaggle. Because regression models rely heavily on the exact area they were trained on, **the model will not give accurate answers for locations away from Seattle**. To make testing easy, I added preset buttons in the UI that automatically fill in valid Seattle coordinates with one click.
* **Cloud Hosting Delay (Render Free Tier):** Since the Node.js API and Python microservice are on Render's free tier, they take **about 50 seconds each to wake up** if they haven't been used in a while. I built loading indicators into the frontend UI to keep the user informed while the servers spin back up.
* **Session Persistence:** Fixed a common issue where refreshing the page logs the user out. I implemented Axios request/response interceptors to automatically attach JWT tokens to headers on every refresh, and seamlessly redirect users to the login screen if their token expires.

---

## 🚀 Local Setup

### 1. Clone the repository
```bash
git clone [https://github.com/YogeshReddy-19/HPred.git](https://github.com/YogeshReddy-19/HPred.git)
cd HPred 
```

### Start the Node.js Backend
```bash
cd backend
npm install
npm start
```
### Start the Python FastAPI Server
```bash
cd ml
pip install fastapi uvicorn xgboost pandas numpy joblib
uvicorn main:app --reload --port 8000
```

### Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```