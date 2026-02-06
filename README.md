# WHOOP Insights Lab (Beta)

**WHOOP Insights Lab** is an interactive web simulator designed to demonstrate how daily lifestyle choices—such as sleep duration, stress, diet, and alcohol consumption—physiologically impact **Recovery** and **Sleep Performance**.

This project serves as an educational tool to visualize the "hidden costs" of lifestyle factors on autonomic health, using a UI inspired by the WHOOP dashboard.

---

## 🚀 Features

-   **Interactive Sliders**: Adjust inputs for Sleep, Alcohol, Caffeine, and Late Meals to see real-time effects.
-   **Physiological Simulation**:
    -   **Neuro-Toxicity**: Visualizes the impact of alcohol on the Central Nervous System (CNS).
    -   **Metabolic State**: Shows how late meals affect digestion and Resting Heart Rate (RHR).
    -   **CNS Stimulants**: Demonstrates how caffeine blocks adenosine and fragments sleep.
    -   **Autonomic Load**: Simulates the balance between Sympathetic (Fight/Flight) and Parasympathetic (Rest/Digest) states.
-   **Visual Feedback**:
    -   Real-time updating "Sleep" and "Recovery" rings.
    -   Dynamic status cards (Green/Yellow/Red) with detailed explanations.
    -   Educational modals defining key terms like HRV, REM, and RHR.

---

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Lucide React (Icons)
-   **Backend**: FastAPI (Python), Uvicorn
-   **State Management**: React Hooks (`useState`, `useEffect`)

---

## 📦 Installation & Setup

### Prerequisites
-   Node.js & npm
-   Python 3.8+

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Whoop
```

### 2. Backend Setup
Navigate to the backend folder and start the server:
```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```
*The backend API will run at `http://127.0.0.1:8000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and start the app:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run at `http://localhost:5173`*

---

## ⚠️ Disclaimer
This application is a **beta version** created for educational and demonstration purposes only. The calculated numbers are simulated estimates and do not reflect exact medical data or guaranteed real-world physiological effects.

---

## 📄 License
[MIT License](LICENSE)