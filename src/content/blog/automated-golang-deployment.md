---
title: Automated Golang Deployment to Server with GitHub Actions and Docker
date: 2024-06-20
tags:
  - golang
  - docker
  - github-actions
  - devops
excerpt: A step-by-step guide on setting up automated CI/CD pipelines for Golang applications using GitHub Actions, Docker, and SSH deployment to production servers.
coverColor: from-blue-500 to-indigo-500
---

## Why Automate Deployment?

Manual deployment is error-prone and time-consuming. Every time you SSH into a server, pull code, rebuild, and restart services, you risk introducing human errors. Automated deployment pipelines eliminate this risk and let you ship faster with confidence.

## The Pipeline

Our CI/CD pipeline consists of three stages:

1. **Build & Test** — Run unit tests and build the Go binary
2. **Docker Image** — Build and push a Docker image to a container registry
3. **Deploy** — SSH into the production server and pull the latest image

## GitHub Actions Workflow

The workflow triggers on every push to the `main` branch. It uses a multi-stage Docker build to keep the final image small (typically under 20MB for a Go binary). The deployment step uses SSH action to connect to the production server and run `docker compose pull && docker compose up -d`.

## Docker Multi-Stage Build

We use a two-stage Dockerfile: the first stage compiles the Go binary with all dependencies, and the second stage copies only the binary into a minimal `alpine` image. This reduces the attack surface and keeps deployment fast.

## Key Takeaways

- Always pin your GitHub Actions versions for reproducible builds
- Use Docker layer caching to speed up builds
- Store secrets (SSH keys, registry credentials) in GitHub Secrets
- Add health checks to your Docker containers for automatic recovery
