---
title: Building Email Verification for User Registration using Golang
date: 2024-04-10
tags:
  - golang
  - backend
  - security
  - smtp
excerpt: Implementing a secure email verification flow for user registration in Go, covering token generation, SMTP integration, and database design.
coverColor: from-emerald-500 to-teal-500
---

## Overview

Email verification is a critical security feature for any application that handles user registration. It ensures that users provide valid email addresses and helps prevent spam accounts. In this article, I walk through building a complete email verification system in Go.

## Token Generation

We generate cryptographically secure verification tokens using Go's `crypto/rand` package. Each token is a 32-byte random value encoded as a URL-safe base64 string. Tokens are stored in the database with an expiration time (typically 24 hours).

## Database Design

The verification system requires two key tables: `users` with an `email_verified` boolean field, and `email_verifications` storing the token, associated user ID, expiration timestamp, and usage status.

## SMTP Integration

We use Go's `net/smtp` package to send verification emails. The email contains a unique verification link that, when clicked, hits our verification endpoint. For production use, I recommend using a service like SendGrid or AWS SES for better deliverability.

## Security Considerations

- Tokens should be single-use and expire after a reasonable time
- Rate-limit verification email requests to prevent abuse
- Use HTTPS for all verification links
- Hash tokens before storing in the database
- Implement account lockout after too many failed attempts
