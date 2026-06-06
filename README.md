# <p align="center"><img src="./public/favicon.ico" width="32" height="32" alt="pulseIQ Logo" style="vertical-align: middle; margin-right: 10px;"/> pulseIQ</p>

<p align="center">
  <strong>Next-Generation AI-Powered Cardiovascular Risk Assessment</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.7-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Three.js-0.184.0-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js"/>
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/HuggingFace-Spaces-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="HuggingFace"/>
</p>

---

## 📋 Overview

**pulseIQ** is a clinical-grade, highly interactive web application designed to predict cardiovascular disease risk using advanced Machine Learning. By analyzing 13 key physiological and clinical markers, the platform computes a probabilistic risk score and categorizes results into **Low**, **Moderate**, or **High** risk levels in real time. 

Built with **Next.js (App Router)** and **React 19**, the application combines a premium, high-fidelity dark-mode aesthetic with a state-of-the-art **React Three Fiber (R3F)** interactive 3D heart model. The 3D model adapts dynamically to the user's risk profile (scaling, pulsating, and color-shifting) to provide an engaging and intuitive visual experience.

---

## ✨ Features

- **🩺 Guided 4-Step Clinical Assessment**
  A responsive wizard interface powered by `react-hook-form` and `zod` for real-time validation of patient vitals and symptoms.
- **🧠 AI-Powered Risk Engine**
  Integrates with a HuggingFace space hosting a machine learning model trained on the gold-standard **UCI Heart Disease dataset**.
- **❤️ Real-time 3D Heart Simulation**
  A custom-extruded 3D heart model featuring interactive mouse-parallax tracking, stars/nebula backdrop, and a dual-phase (systole/diastole) realistic pulse animation.
- **📊 Interactive Results Dashboard**
  Detailed risk reports with animated SVG gauges, model confidence metrics, and custom probability meters.
- **🖨️ Clinical PDF Report Export**
  Formatted print layouts enabling users to download, print, or share their generated clinical analysis reports.
- **🔒 Stateless & Privacy-First Architecture**
  All vitals and patient metrics are kept in-memory and in local/session storage (`zustand` with persistent storage middleware) and never persisted in database environments.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Core Framework:** [Next.js 16.2](https://nextjs.org/) (App Router, Server Components) & [React 19](https://react.dev/)
- **State Management:** [Zustand 5.0](https://github.com/pmndrs/zustand) (with partial session persistence)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod Validation](https://zod.dev/)
- **Animations:** [Framer Motion 12.0](https://www.framer.com/motion/) (smooth transitions, step slides, page loaders)
- **Styling:** TailwindCSS v4 & vanilla CSS variables for fluid dark-mode colors

### 3D Graphics & Data Visualization
- **3D Engine:** [Three.js](https://threejs.org/)
- **React Bindings:** [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber) & [React Three Drei](https://github.com/pmndrs/drei)
- **Visual Effects:** Canvas point lights, custom particle fields, starfields, and ambient environmental mapping
- **Charts & Gauges:** Custom SVG math-based arc paths for the gauge and tailwind progress bars

### Backend & Machine Learning
- **API Proxy Route:** Next.js API route (`/api/predict`) with server-side validation
- **ML Engine API:** Hugging Face Space running a Logistic Regression trained on UCI heart metrics.
- **Model Endpoint:** `https://akshatkumar1001-pulseiq.hf.space/predict`

---

## 📁 Repository Structure

```text
├── app/
│   ├── api/predict/route.ts   # Next.js API router proxy to HuggingFace
│   ├── assessment/            # Assessment wizard page layout & entry
│   ├── results/               # Results visualization dashboard
│   ├── globals.css            # Base Tailwind and global styling variables
│   ├── layout.tsx             # Root template & custom nextjs metadata
│   └── page.tsx               # Main Landing page (Hero, Features, How it works)
├── components/
│   ├── assessment/            # Multi-step wizard layout and progress bars
│   │   └── steps/             # Individual step components (1 to 4)
│   ├── heart/
│   │   └── HeartScene.tsx     # Three.js R3F Canvas and 3D heart mesh
│   ├── hero/
│   │   └── HeroSection.tsx    # Responsive interactive landing layout
│   ├── layout/                # Shared Navbar and Footer navigation
│   └── results/
│       └── ResultsDashboard.tsx # Risk score charts, breakdown & action plan
├── features/
│   ├── assessment/            # Zustand state store, types & Zod schemas
│   └── prediction/            # HF API integration adapters and models
├── lib/
│   └── utils.ts               # Core formatting, mapping, and math utilities
├── public/                    # Static image and branding assets
├── next.config.ts             # Next.js bundler settings
├── tsconfig.json              # TypeScript compilation rules
└── tailwind.config.ts         # Tailwind theme customizations
```

---

## 🧬 Clinical Markers Analyzed

The predictive assessment maps directly to the standard features from the **UCI Heart Disease database**:

| Step | Marker | API Field | Data Type | Description / Accepted Range |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1** | **Age** | `age` | `int` | Patient age (18 - 120 years) |
| **Step 1** | **Biological Sex** | `sex` | `M` \| `F` | Assigned biological sex at birth |
| **Step 2** | **Resting Blood Pressure** | `resting_bp` | `number` | Systolic pressure in mmHg (60 - 250) |
| **Step 2** | **Serum Cholesterol** | `cholesterol` | `number` | Cholesterol level in mg/dL (100 - 600) |
| **Step 2** | **Max Heart Rate** | `max_hr` | `number` | Maximum heart rate achieved in bpm (60 - 220) |
| **Step 3** | **Fasting Blood Sugar** | `fasting_bs` | `boolean` | Sugar level > 120 mg/dL (True: 1, False: 0) |
| **Step 3** | **Chest Pain Type** | `chest_pain_type` | `enum` | ASY (Asymptomatic), ATA (Atypical), NAP (Non-Anginal), TA (Typical) |
| **Step 3** | **Resting ECG** | `resting_ecg` | `enum` | Normal, ST (ST-T wave abnormality), LVH (Left Ventricular Hypertrophy) |
| **Step 3** | **Exercise Angina** | `exercise_angina` | `Y` \| `N` | Exercise-induced angina pectoris |
| **Step 3** | **ST Depression** | `oldpeak` | `number` | ST depression induced by exercise relative to rest (0 - 10) |
| **Step 3** | **ST Slope** | `st_slope` | `enum` | Up, Flat, Down (Slope of peak exercise ST segment) |

---

## 🧮 Under the Hood: 3D Visualization

The **`HeartScene`** utilizes specialized mathematical formulas and R3F components to represent cardiac kinetics:

1. **Heart Shape Extrusion:** Built by defining 2D bezier paths in three dimensions and extruding them using `THREE.ExtrudeGeometry`:
   ```typescript
   shape.moveTo(0, 0.4);
   shape.bezierCurveTo(0.15, 0.75, 0.7, 0.75, 0.7, 0.2);
   shape.bezierCurveTo(0.7, -0.3, 0.15, -0.65, 0, -0.9);
   ```
2. **Cardiac Rhythm Simulation:** Inside R3F’s render loop (`useFrame`), the model tracks relative time offsets to replicate realistic **Systole** (contraction) and **Diastole** (relaxation) phases:
   ```typescript
   const heartbeatPhase = (time.current % 1.0);
   let scale = 1.0;
   if (heartbeatPhase < 0.12) {
     // Systole — quick contraction phase
     scale = 1.0 + Math.sin((heartbeatPhase / 0.12) * Math.PI) * 0.08;
   } else if (heartbeatPhase < 0.28) {
     // Diastole — brief rebound & relaxation
     scale = 1.0 + Math.sin(((heartbeatPhase - 0.12) / 0.16) * Math.PI) * 0.04;
   }
   ```
3. **Responsive Color States:** The heart's glow and emissive lights automatically align with clinical risk categories using radial color mappings:
   - 🟢 **Low Risk:** `#10B981` (Emerald Green)
   - 🟡 **Moderate Risk:** `#F59E0B` (Amber Yellow)
   - 🔴 **High Risk:** `#EF4444` (Coral Red)

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
Make sure you have Node.js (version 18 or above recommended) installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Akshat-Kumar07/pulseIq.git
   cd pulseIq
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to interact with the platform.

---

## 🛡️ Medical Disclaimer

> [!WARNING]
> This application is for **educational, demonstrative, and informational purposes only**. The machine learning models and risk outputs are generated from statistical patterns within the UCI heart database and **do not** represent diagnostic medical opinions. 
> Always consult a qualified physician or cardiologist for any clinical diagnoses or treatment regimens.
