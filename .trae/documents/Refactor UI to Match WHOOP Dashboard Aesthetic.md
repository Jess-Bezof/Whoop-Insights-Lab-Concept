I will upgrade the UI to match the provided WHOOP dashboard screenshot, adopting its layout, color palette, and component styling.

### **Phase 1: Design System Update (Tailwind)**
1.  **Color Palette Extraction**:
    -   **Background**: Deep dark gradient (darker at top, slightly lighter at bottom).
    -   **Cards**: Dark charcoal gray (`#1B1B1B` approx).
    -   **Accents**:
        -   **Sleep Blue**: Cyan/Light Blue (`#66CCFF`).
        -   **Recovery Green**: Vibrant Green (`#00E266`).
        -   **Strain Blue**: Deep Sky Blue (`#0099FF`).
        -   **Text**: White (primary) and Grey (secondary).
2.  **Update `tailwind.config.js`**: Add these specific custom colors.

### **Phase 2: Component Implementation**
1.  **`CircularMetric` Component**:
    -   Create a reusable SVG-based circular progress ring.
    -   Props: `label`, `value`, `color` (Sleep/Recovery/Strain), `subtext` (optional).
    -   Match the "incomplete ring" style (gap at bottom) or full ring as seen in the image.
2.  **`DashboardCard` Component**:
    -   Reusable container with rounded corners (`rounded-2xl`), dark gray background, and padding.
3.  **`Header` Component**:
    -   Replicate the top navigation: User icon, "TODAY" pill, Battery indicator.

### **Phase 3: Layout Refactoring (`App.jsx`)**
1.  **Top Section (Outputs)**:
    -   Display the 3 key metrics: **Sleep** (Input), **Recovery** (Output/Predicted), **Strain** (Placeholder/Input).
    -   Since this is a simulator, the "Recovery" ring will dynamically update based on the calculated impact (or show the simulation result).
2.  **Bottom Section (Inputs)**:
    -   Move the existing **Sliders** into styled `DashboardCards`.
    -   Group them logically (e.g., "Sleep Factors", "Dietary", "Stress") to mimic the "Health Monitor" / "Stress Monitor" grid layout.

### **Phase 4: Styling Polish**
1.  Apply the dark gradient background to the main container.
2.  Ensure typography (Inter/Roboto) matches the clean, bold look.
3.  Verify responsiveness (mobile-first, as per the screenshot).