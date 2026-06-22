# DGIIR – Digital Governance Intelligence & Incident Resolution

## Overview

DGIIR (Digital Governance Intelligence & Incident Resolution) is an AI-powered grievance management and incident response platform designed to bridge the gap between citizens, field officers, operations teams, and government leadership.

The platform transforms citizen complaints into actionable intelligence using artificial intelligence, automated routing, incident clustering, real-time dashboards, SLA monitoring, and officer accountability workflows.

Instead of handling complaints as isolated tickets, DGIIR identifies patterns, groups similar complaints into incidents, and provides decision-makers with a real-time operational view of city-wide issues.

---

# Problem Statement

Government grievance systems often suffer from:

* Manual complaint categorization
* Duplicate complaints for the same issue
* Slow routing to responsible departments
* Lack of visibility for leadership
* Poor officer accountability
* Limited citizen transparency
* Absence of intelligent prioritization

DGIIR addresses these challenges through AI-driven automation and incident intelligence.

---

# Key Features

## 1. AI-Powered Complaint Classification

Citizens simply describe their issue.

The AI automatically:

* Detects complaint category
* Identifies responsible department
* Assigns priority level
* Extracts keywords
* Generates confidence score
* Produces AI reasoning

Example:

Input:

"Garbage bins have been overflowing near Lokhandwala Market for four days."

Output:

Category: Sanitation
Priority: High
Department: Municipal Corporation
Confidence: 95%

---

## 2. AI-Assisted Image Analysis

Citizens can upload images while filing complaints.

The AI can use visual evidence to:

* Improve classification accuracy
* Validate complaint descriptions
* Detect issue indicators
* Assist operations teams during review

---

## 3. Smart Incident Formation (Hero Feature)

Multiple complaints often refer to the same real-world problem.

DGIIR automatically groups similar complaints into a single Incident using:

### Text Similarity

* Complaint title analysis
* Description analysis
* Keyword matching

### Location Similarity

* Area matching
* District clustering
* Geospatial grouping

### Time Similarity

* Complaint submission window
* Incident activity timeline

Instead of:

40 separate complaints

The system generates:

Incident #42
Water Crisis – Rohini

Affected Citizens: 40

Benefits:

* Eliminates duplicate effort
* Improves operational efficiency
* Enables faster response
* Provides accurate impact estimation

---

# User Portals

## Citizen Portal

Citizens can:

* Submit complaints
* Upload images
* Share geolocation
* Record voice input
* Track complaint status
* View complaint history
* Access AI classification results
* Receive notifications

Features:

* AI-powered routing
* Real-time status tracking
* Mobile-friendly interface
* Dark mode support

---

## Operations Portal

Operations teams can:

* Review incoming complaints
* View AI recommendations
* Assign officers
* Monitor SLA compliance
* Manage escalations
* Track officer workload
* Override AI decisions
* Audit complaint routing

Dashboard includes:

* Incident Overview
* Complaint Trends
* SLA Monitoring
* High-Risk Officers
* Category Analytics
* District Analytics

---

## Field Officer Portal

Field officers can:

* View assignments
* Accept or reject tasks
* Update status
* Upload evidence
* Add field comments
* Escalate issues
* Track deadlines
* Submit closures

Modules:

* Dashboard
* Assignments
* In Progress
* SLA & Deadlines
* Reports
* Notifications
* Profile Management

---

## Chief Minister Dashboard

Provides city-wide governance visibility.

Features:

* District Risk Analysis
* Resolution Analytics
* Priority Monitoring
* Complaint Trends
* Top Concerns
* AI Intelligence Hub
* Department Performance Monitoring

Enables leadership-level decision making through real-time operational intelligence.

---

# AI Intelligence Layer

The AI Engine performs:

* Category Prediction
* Department Routing
* Priority Detection
* Keyword Extraction
* Confidence Scoring
* Similar Complaint Detection
* Incident Clustering
* AI Review Flagging

Low-confidence complaints are automatically routed to Operations for manual review.

---

# Workflow

Citizen Complaint
↓
AI Classification
↓
Department Detection
↓
Priority Assignment
↓
Operations Review
↓
Officer Assignment
↓
Field Resolution
↓
Verification
↓
Closure

For Similar Complaints:

Complaint
↓
Similarity Detection
↓
Incident Formation
↓
Unified Resolution

---

# Analytics & Reporting

The platform generates:

* Complaint Distribution
* Category Trends
* District Trends
* Resolution Rate
* SLA Compliance
* Officer Workload
* Escalation Metrics
* AI Accuracy Metrics
* Incident Impact Metrics

---

# Technology Stack

## Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* Recharts
* React Query
* React Router

## Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM

## Database

* PostgreSQL / Supabase

## AI Layer

* Google Gemini API
* AI Classification Engine
* Incident Intelligence Engine

## Storage

* Cloudinary

## Authentication

* JWT Authentication
* Role-Based Access Control

---

# Roles Supported

1. Citizen
2. Field Officer
3. Operations Team
4. Chief Minister
5. Admin (Future Expansion)

---

# Security Features

* JWT Authentication
* Password Hashing
* Protected Routes
* Role-Based Authorization
* Audit Logging
* Secure File Uploads
* Input Validation

---

# Environment Variables

Backend

PORT=5000

DATABASE_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

Frontend

VITE_API_URL=

---

# Team Workflow

Recommended Branch Structure

main

* Production-ready code

frontend

* UI and UX development

backend

* APIs and database integration

ai

* AI services and routing engine

dashboard

* Analytics and leadership dashboards

---

# Future Enhancements

* Multilingual Complaint Processing
* Predictive Incident Forecasting
* WhatsApp Integration
* IVR Complaint Registration
* GIS-Based Heatmaps
* Citizen Feedback Verification
* AI Resolution Recommendations
* Mobile Applications
* Automated SLA Escalations

---

# Vision

DGIIR aims to transform traditional grievance systems into an intelligent governance platform where every complaint becomes actionable intelligence, every incident receives timely attention, and leadership gains real-time visibility into public service delivery.

## Important

The final integrated project is available in the `main` branch.

All other branches were used during development for separate modules such as frontend, backend, AI services, and dashboards.

For evaluation, please review the `main` branch.