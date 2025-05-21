# SSI Agent System using NestJS & Credo

This project implements a decentralized identity (SSI) system using [NestJS](https://nestjs.com/) and [Credo (formerly AFJ)](https://github.com/hyperledger/aries-framework-javascript). It sets up two agents (e.g., **Acme** and **Bob**) that can:

- Initialize agents with AnonCreds support.
- Create and receive Out-of-Band (OOB) invitations.
- Establish DIDComm V2 connections.
- Auto-accept invitations and connections.
- Expose Swagger-based REST APIs for interaction.

---

## 🛠️ Features

- ✅ Agent initialization with Genesis transactions
- ✅ DIDComm V2 & Out-of-Band invitations
- ✅ Acme (Issuer) and Bob (Holder) architecture
- ✅ Swagger documentation with proper HTTP status codes
- ✅ Error handling for uninitialized agents and invalid invitation URLs

---

## 📦 Tech Stack

- **NestJS** – Backend Framework
- **Credo (AFJ)** – SSI Agent Framework
- **Hyperledger Indy / VDR / AnonCreds** – Ledger and credential protocols
- **Swagger (via @nestjs/swagger)** – API documentation

---

