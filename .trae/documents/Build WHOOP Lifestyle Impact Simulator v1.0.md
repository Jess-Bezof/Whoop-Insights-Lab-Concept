I will build the **WHOOP Lifestyle Impact Simulator v1.0** by setting up a full-stack application with FastAPI and React.

### **Phase 1: Project Scaffolding**
1.  **Backend Setup (`/backend`)**:
    -   Initialize a Python environment.
    -   Create `main.py` with FastAPI.
    -   Define Pydantic models for the 6 lifestyle inputs.
    -   Set up CORS to allow frontend communication.
2.  **Frontend Setup (`/frontend`)**:
    -   Initialize a React project using Vite.
    -   Install and configure Tailwind CSS.
    -   Clean up default boilerplate.

### **Phase 2: Design System Implementation**
1.  **Tailwind Configuration**:
    -   Extend the theme with WHOOP specific colors:
        -   Background: `#000000` (Deep Black) or `#050505`.
        -   Primary Accent: `#00FF00` (WHOOP Green).
        -   Text: Sans-serif (Inter/Roboto).
2.  **Global Styles**:
    -   Apply the dark theme globally.

### **Phase 3: UI Implementation**
1.  **Component Creation**:
    -   `ImpactSlider`: A reusable slider component styled with the WHOOP aesthetic (minimal track, bold thumb/value).
    -   `StressSelector`: A specialized input for the "Low/Med/High" stress level (mapped to a discrete slider or button group).
2.  **Main Interface**:
    -   Build the "Skeleton" UI with the title "Lifestyle Impact Simulator".
    -   Implement the 6 input controls:
        -   Sleep Duration (0–12h)
        -   Alcohol (0–6+ drinks)
        -   Caffeine Amount (mg)
        -   Caffeine Timing (Hours before bed)
        -   Late Meal (0–4h before bed)
        -   Stress Level (Low/Med/High)

### **Phase 4: Integration**
1.  **Backend Endpoint**:
    -   Create a POST endpoint `/api/predict` (or similar) to receive the inputs.
    -   Return a simple acknowledgment response (e.g., echoing the data).
2.  **Frontend Logic**:
    -   Manage state for all 6 inputs.
    -   Implement a "Simulate" or auto-update mechanism to send data to the backend.
    -   Display the backend's response (or a placeholder success message).

### **Phase 5: Verification**
1.  Start the FastAPI backend server.
2.  Start the Vite frontend development server.
3.  Verify the UI matches the design requirements.
4.  Test the data flow from UI to Backend.
