# 🐱 CatSpace Planner: Multi-Cat Territory Simulation and Planning Tool

**CatSpace Planner** is a web-based interactive mockup designed to assist cat owners in planning an optimal living environment for multiple cats within a shared space.

This project integrates basic behavioral modeling, spatial analysis, and visualization techniques to simulate cat interactions and estimate potential conflicts based on user-provided data.

---

## 🎯 Objectives

The main objectives of this project are:

* To design an intuitive multi-step user interface for pet environment planning
* To model basic behavioral traits of cats (dominance, stress, tolerance)
* To analyze inter-cat relationships and predict potential conflicts
* To simulate cat movement within a constrained spatial environment
* To provide practical recommendations for improving multi-cat living conditions

---

## 🧠 Methodology

### 1. Data Input

Users provide:

* Number of cats
* Individual cat information:

  * Name
  * Status (new or existing cat)
  * Behavioral traits (dominance, stress, tolerance)
* Relationships between cats:

  * Best Friends
  * Roommates
  * Conflict
* House area (in square meters)

---

### 2. Behavioral Modeling

Each cat is represented as an object containing:

* Trait parameters (scaled 0–100)
* Relationship mappings with other cats
* Movement properties (position, direction)

Conflict potential is estimated using:

* Relationship type weighting
* Trait-based modifiers:

  * Higher dominance → increased conflict probability
  * Lower tolerance → increased conflict probability

---

### 3. Conflict Calculation

The system computes a **conflict percentage** by aggregating pairwise interaction scores between cats.

General interpretation:

* **< 30%** → Harmonious
* **30–60%** → Moderate tension
* **> 60%** → High conflict

---

### 4. Spatial Simulation

* The house is assumed to be a square area
* Area is converted into a 2D coordinate system using scaling
* Cats move dynamically using randomized directional vectors
* Collision detection triggers:

  * Conflict animations
  * Directional changes

---

### 5. Recommendation System

Based on the number of cats and available space, the system suggests:

* Minimum number of food bowls
* Minimum number of litter boxes
* Space adequacy (m² per cat)
* Environmental improvements (e.g., vertical space)

---

## 🖥️ Technologies Used

* **HTML5** – structure
* **CSS3** – layout and styling
* **JavaScript (Vanilla)** – application logic
* **Canvas API** – visualization and animation

---

## 📊 Discussion

This project demonstrates how simple behavioral parameters and spatial constraints can be combined to simulate interactions in a multi-agent system.

Although the model is simplified, it provides insight into:

* Resource competition
* Territory overlap
* Social compatibility among animals

The visualization component enhances user understanding by translating abstract calculations into observable behavior.

---

## ⚠️ Limitations

* Assumes house shape is always square
* Uses simplified behavioral models (not biologically accurate)
* No persistent data storage
* Limited scalability for large numbers of cats

---

## 🔮 Future Work

* Integration with real floor plan layouts
* Advanced behavioral modeling using AI or agent-based systems
* Data persistence (local storage or backend integration)
* Mobile responsiveness
* User customization for environment design
