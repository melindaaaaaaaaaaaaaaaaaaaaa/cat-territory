# 🐱 Multi-Cat Territory Simulation (Mockup)


## 📌 Description

This project is a web-based mockup application that simulates territorial behavior among multiple cats living in the same household. The system is designed using an **agent-based modeling approach**, where each cat is treated as an independent agent with behavioral parameters such as dominance, stress level, and social tolerance.

This is a **mockup prototype**, meaning the full numerical simulation is not yet implemented. Instead, it demonstrates the **user interface, workflow, and computational structure** of the intended application.

---

## 🧩 Features

- Input multiple cats and their personality traits
- Multi-step simulation process
- Visual territory representation using canvas
- Behavior analysis output (conflict & stress)
- Recommendation system for resource allocation

---

## 🧾 Input Variables

- Number of cats  
- Personality traits (dominance, stress, tolerance)  
- House size  
- Number of litter boxes  
- Number of feeding stations  

---

## ⚙️ Process (Computation Steps)

1. **Initialize Agents**  
   Each cat is initialized as an agent with its own behavioral parameters.

2. **Simulate Interaction**  
   Cats interact with each other based on proximity and personality traits.

3. **Generate Results**  
   The system produces estimated conflict levels, stress levels, and territory distribution.

---

## 📊 Output Variables

- Conflict probability  
- Stress level estimation  
- Territory overlap visualization (canvas)  
- Resource allocation recommendation  

---

## 🧠 Numerical Concepts & Algorithms

### 1. Agent-Based Modeling (ABM)
Each cat is treated as an independent agent with internal states. The overall system behavior emerges from interactions between agents.

---

### 2. Nonlinear Interaction Model
Interactions between cats depend on multiple variables:

- dominance level  
- distance between cats  
- social tolerance  

This creates a **nonlinear system**, where outcomes cannot be determined using a single equation.

---

### 3. Iterative Simulation (Time-Step Based)

The system is designed to simulate behavior over time using repeated updates:

---

### 4. Conflict Detection

Conflict probability can be estimated based on:

- overlap of territories  
- difference in dominance levels  

---

### 5. Why Simulation is Required

This problem cannot be solved using direct calculation because:

- Multiple interacting agents  
- Dynamic behavioral changes  
- Emergent system behavior  

Therefore, a **simulation-based computational approach** is required.

---

## 🚧 Future Development

- Full agent-based simulation engine  
- Real-time animation of cat movement  
- Machine learning for behavior prediction  
- Heatmap-based territory visualization  

---

## 🛠️ Technologies Used

- HTML (structure)  
- CSS (styling)  
- JavaScript (interaction logic)  

---

## 📌 Notes

This project is created as part of a **computational modeling assignment**, focusing on designing a mockup that demonstrates system workflow rather than implementing a full simulation.
