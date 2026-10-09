# 🛒 Bismillah Traders - Wholesale Order Booking & Delivery Management System

[![Frontend Stack](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue)](https://react.dev)
[![Backend Stack](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Prisma-blue)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-Active%20Development-success)]()

A mobile-first, high-performance web application designed for field sales agents and shop owners to streamline wholesale order logging, automate delivery tracking, and generate real-time financial analytics.

---

## 📖 Problem Statement & Solution Overview

**The Problem:** Traditional wholesale distribution relies heavily on paper-based invoicing, manual entry, and fragmented WhatsApp messages. This leads to lost orders, inaccurate billing calculations, delayed deliveries, and zero real-time visibility into daily revenue.

**The Solution:** Bismillah Traders digitalizes the entire supply chain workflow. 
Our system provides field agents with a lightning-fast, mobile-optimized booking interface to log orders directly from retail shops. Orders instantly sync to a centralized management dashboard where store managers can verify, edit, and dispatch deliveries. Automated financial analytics ensure every penny is tracked with precision.

---

## ⚡ Core Features Breakdown

### 📝 1. Dynamic Order Booking
*   **Shop Details Capture**: Quickly log shop names, contact info, and critical delivery notes.
*   **Real-Time Invoice Builder**: Add items, set unit prices, and adjust quantities on the fly.
*   **Auto-Calculation Engine**: Instantly calculates sub-totals per item and the grand total bill, eliminating human mathematical error.
*   **Workflow Integration**: All new bookings are automatically vaulted in a secure `Pending` state.

### 🚚 2. Delivery Management & Order Editing
*   **Pending Queue**: A centralized ledger of all orders awaiting dispatch, complete with detailed billing breakdowns.
*   **Live Order Editing**: Full flexibility to add/remove products or adjust quantities on `Pending` orders. The grand total recalculates instantly.
*   **Secure Deletion**: Cancel or delete pending orders with built-in confirmation protections.
*   **One-Tap Dispatch**: "Mark as Delivered" action automatically stamps the precise `deliveryDate` and securely archives the order.
*   **Financial Lock**: Once an order status transitions to `Delivered`, the invoice is cryptographically locked. Edits and deletions are disabled to prevent financial tampering.

### 📈 3. Analytics & Monthly Earnings Dashboard
*   **Revenue Counter**: Accurately tracks current month earnings. (Strict business rule: ONLY counts `Delivered` orders. Unfulfilled revenue is never recognized prematurely).
*   **Daily Ledger Tracker**: 
    *   Compares booking dates vs. actual delivery dates.
    *   Tracks daily booking velocity.
    *   Monitors daily completed cash revenue.
*   **Fulfillment KPI**: Real-time counter of the total backlog of pending orders.

### 🧹 4. Automated Data Lifecycle (Cron Job)
*   **Monthly Cleanup Script**: An automated background worker triggers on the 1st of every month at 00:00.
*   **Data Archival**: Automatically archives/deletes old completed (`Delivered`) orders to reset the dashboard cleanly for the new fiscal month.
*   **Strict Retention**: `Pending` orders are **NEVER** touched by the cleanup script. They remain safely in the system across monthly boundaries until fulfilled.

---

## 🏗️ System Architecture & Data Flow

The platform utilizes a modern Client-Server architecture.

1.  **Mobile Agent UI (Client)**: A React-based Progressive Web App (PWA). Field agents submit JSON payloads of invoices.
2.  **API Backend (Node.js)**: Validates incoming payloads, recalculates totals securely (ignoring client-side math to prevent spoofing), and orchestrates database transactions.
3.  **Cloud Database (PostgreSQL)**: Enforces referential integrity between orders and individual items.

### Database Schema Design (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Order {
  id            String      @id @default(uuid())
  shopName      String
  customerPhone String?
  address       String?
  status        OrderStatus @default(Pending)
  orderDate     DateTime    @default(now())
  deliveryDate  DateTime?
  totalAmount   Float       @default(0.0)
  items         OrderItem[]
}

model OrderItem {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  productName String
  quantity    Int
  unitPrice   Float
  subtotal    Float
}

enum OrderStatus {
  Pending
  Delivered
  Cancelled
}
```

---

## 🛠️ Tech Stack Recommendations

*   **Frontend**: React.js / Next.js, Tailwind CSS v4 (Mobile-Responsive, App-like UX)
*   **Backend**: Node.js, Express.js OR Next.js Server Actions
*   **Database**: PostgreSQL hosted on Supabase (Highly scalable, relational integrity)
*   **ORM**: Prisma (Type-safe database queries)
*   **Background Jobs**: `node-cron` or native Supabase `pg_cron`

---

## 👥 User Roles & Workflow Guide

| Role | Workflow Actions | Access Level |
| :--- | :--- | :--- |
| **Field Agent** | Visits shops ➔ Creates Booking ➔ Saves as Pending | Can only access the Booking Terminal. |
| **Store Admin** | Reviews Pending queue ➔ Edits discrepancies ➔ Dispatches Delivery ➔ Views Financial Dashboards | Full System Access. |

---

## 🚀 Setup & Installation Guide

### Prerequisites
*   Node.js (v18+)
*   npm or yarn
*   PostgreSQL Database (Local or Cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/bismillah-traders.git
cd bismillah-traders
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# Server
PORT=5000
NODE_ENV=development

# Database Configuration (Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/bismillah_db?schema=public"

# Security (JWT Secrets)
JWT_SECRET="super_secret_key_123"
```

### 4. Database Setup
Push the schema to your database and generate Prisma client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Start the Application
```bash
npm run dev
```
The frontend application will be available at `http://localhost:5173`.
