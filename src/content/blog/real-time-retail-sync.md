---
title: Real-time Retail Data Synchronization
date: 2024-08-15
tags:
  - golang
  - kafka
  - microservices
  - docker
excerpt: How I designed and built a real-time transaction and stock synchronization system across multiple retail outlets using Apache Kafka, Golang microservices, and Docker.
coverColor: from-orange-500 to-red-500
---

## The Problem

In a multi-outlet retail business, keeping inventory and transaction data in sync across all locations in real-time is a significant challenge. Traditional batch processing introduces delays that can lead to overselling, inaccurate stock counts, and poor customer experiences.

## Architecture Overview

I designed an event-driven architecture using **Apache Kafka** as the central message broker. Each retail outlet runs its own lightweight microservice that publishes transaction events to Kafka topics. A central consumer service processes these events and updates the master database.

### Key Components

- **Outlet Service** — Lightweight Go service running at each outlet, capturing POS transactions and publishing to Kafka
- **Central Consumer** — Processes events from all outlets, handles deduplication and conflict resolution
- **Stock Sync Engine** — Maintains real-time inventory counts across all locations
- **Dashboard API** — Provides real-time analytics and monitoring endpoints

## Implementation Details

Each outlet microservice is containerized with **Docker** and deployed independently. The services use a local SQLite database as a write-ahead log to ensure no transactions are lost even during network outages. When connectivity is restored, events are replayed to Kafka in order.

The central consumer implements **exactly-once semantics** using Kafka's transactional API combined with idempotent writes to PostgreSQL. This guarantees that even if messages are redelivered, the final state remains consistent.

## Results

The system successfully processes thousands of transactions per minute across dozens of outlets with sub-second synchronization latency. Stock accuracy improved from 94% to 99.7%, and the operations team gained real-time visibility into sales and inventory across all locations.
