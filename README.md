# 🛒 Bismillah Traders - Wholesale Order Booking & Delivery Management System

[![Frontend Stack](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue)](https://react.dev)
[![Status](https://img.shields.io/badge/Status-Active%20Development-success)]()

A modern, high-performance web application designed for field sales agents and shop owners to streamline wholesale order logging, automate delivery tracking, and generate financial analytics. 

*Note: This is a fully functional frontend prototype built with React. All data is managed via in-memory React Context state for demonstration and testing purposes, requiring zero backend setup.*

---

## 📖 Problem Statement & Solution Overview

**The Problem:** Traditional wholesale distribution relies heavily on paper-based invoicing, manual entry, and fragmented WhatsApp messages. This leads to lost orders, inaccurate billing calculations, delayed deliveries, and zero real-time visibility into daily revenue.

**The Solution:** Bismillah Traders digitalizes the entire supply chain workflow. 
Our system provides field agents with a lightning-fast, mobile-optimized booking interface to log orders directly from retail shops. Orders instantly sync to a centralized management dashboard where store managers can verify, edit, and dispatch deliveries. Automated financial analytics ensure every penny is tracked with precision.

---

## ⚡ Core Features Breakdown

### 📝 1. Secure Role-Based Authentication
*   **Encrypted Gateway:** Secure email and strong password authentication flow.
*   **Role-Based Access Control (RBAC):** Strict isolation between `Agent` (Field workers) and `Admin` (Store owners). 
*   **Admin Access:** Full system control, including sensitive Financial Analytics.
*   **Agent Access:** Restricted to order logging and viewing deliveries. Dashboard is completely hidden and inaccessible.

### 📝 2. Dynamic Order Booking
*   **Shop Details Capture**: Quickly log shop names and details.
*   **Real-Time Invoice Builder**: Add items, set unit prices, and adjust quantities on the fly.
*   **Auto-Calculation Engine**: Instantly calculates sub-totals per item and the grand total bill, eliminating human mathematical error.
*   **Workflow Integration**: All new bookings are automatically vaulted in a secure `Pending` state.

### 🚚 3. Delivery Management & Order Editing
*   **Pending Queue**: A centralized ledger of all orders awaiting dispatch, complete with detailed billing breakdowns.
*   **Live Order Editing**: Full flexibility to add/remove products or adjust quantities on `Pending` orders. The grand total recalculates instantly.
*   **Secure Deletion**: Cancel or delete pending orders with built-in confirmation protections.
*   **One-Tap Dispatch**: "Mark as Delivered" action securely archives the order and stamps it for revenue recognition.
*   **Financial Lock**: Once an order status transitions to `Delivered`, the invoice is cryptographically locked. Edits and deletions are disabled to prevent financial tampering.

### 📈 4. Analytics & Time-Travel Earnings Dashboard (Admin Only)
*   **Monthly Historical Filtering**: Easily jump between the "Current Month", "Previous Month", and older ledgers using a dropdown selector.
*   **Revenue Counter**: Accurately tracks earnings for the selected month. (Strict business rule: ONLY counts `Delivered` orders. Unfulfilled revenue is never recognized prematurely).
*   **Daily Ledger Tracker**: 
    *   Tracks daily booking velocity.
    *   Monitors daily completed cash revenue.
    *   Expandable rows to view the exact shop deliveries that generated the revenue for that specific day.
*   **Fulfillment KPI**: Real-time counter of the total system-wide backlog of pending orders.

---

## 🏗️ Technical Implementation

The platform utilizes a purely frontend React architecture for maximum prototyping speed:

1.  **State Management**: `React Context API` is used to create a global, mock database (`OrderContext.tsx` and `AuthContext.tsx`).
2.  **Routing & Views**: React state manages the active page view without complex routing overhead.
3.  **Styling**: `Tailwind CSS` provides a responsive, mobile-first design system with premium glassmorphism and shadow aesthetics.
4.  **Tooling**: Powered by Vite for lightning-fast HMR and building.



## 🚀 Setup & Installation Guide

### Prerequisites
*   Node.js (v18+)
*   npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/ZainMurtaza3532/Order-booking-project-.git
cd order-booking
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
The application will instantly launch and be available at `http://localhost:5173`.
