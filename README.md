# Zero Construction - Contract Generator

A web app to generate professional construction contracts in English. Fill in client details and project items, then download as PDF.

## Features

- **Client Information**: Name, address, phone, email (optional), friend referral
- **Scope of Work**: Multiple project items with:
  - Service type (dropdown)
  - Dimensions (optional)
  - Description
  - Price
  - Warranty (dropdown)
- **Discount**: Enter discount amount, auto-calculates final total
- **PDF Download**: One-click download of the contract

## Run with Docker (no Node.js needed)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for Mac
2. Open Terminal, go to this folder:
   ```bash
   cd /Users/jasminehou/Desktop/zero_construction
   ```
3. Run:
   ```bash
   docker compose up --build
   ```
4. Open http://localhost:3000 in your browser

To stop: press `Ctrl+C` in the terminal.

## Run without Docker

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.
