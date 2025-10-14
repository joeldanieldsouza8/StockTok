# CapitalPulse

> A brief one-sentence description of what CapitalPulse does."

---

## 🚀 Technology Stack

### Backend (`/backend`)
*   **Framework:** .NET 9 Web API
*   **Language:** C#

### Frontend (`/frontend`)
*   **Framework:** Next.js 15
*   **Library:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS

---

## 🔧 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need the following software installed on your computer:
*   [.NET 9 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
*   [Node.js (LTS)](https://nodejs.org/)
*   An IDE like [JetBrains Rider](https://www.jetbrains.com/rider/) or VS Code.

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd CapitalPulse
    ```

2.  **Restore .NET dependencies:**
    ```bash
    dotnet restore ./backend/CapitalPulse.sln
    ```

3.  **Install frontend dependencies:**
    ```bash
    npm install --prefix frontend
    ```
    *(The `--prefix frontend` flag tells npm to run the installation inside the `/frontend` directory without you having to `cd` into it.)*

4.  **Run the Application:**

    *   **The Easy Way (Using JetBrains Rider):**
        1.  Open the project in Rider.
        2.  Select the **`Run All (Backend + Frontend)`** Compound Run Configuration from the dropdown in the top toolbar.
        3.  Press the green Play button ▶️.

    *   **The Manual Way (Using Two Terminals):**
        Open two separate terminals in the project root.
        *   In **Terminal 1**, run the .NET backend:
          ```bash
          dotnet run --project ./backend/CapitalPulse/CapitalPulse.csproj
          ```
        *   In **Terminal 2**, run the Next.js frontend:
          ```bash
          npm run dev --prefix frontend
          ```

5.  **Access the application:**
    *   The **Frontend** will be running at: `http://localhost:3000`
    *   The **Backend API** will be running at: `https://localhost:7123` (or whatever port is configured in `launchSettings.json`)

---

## 📂 Project Structure

The repository is structured as a monorepo:

```
/
├── backend/      # Contains the .NET 9 Web API solution and source code
│   ├── CapitalPulse/ # The main C# project
│   ├── CapitalPulse.sln
│   └── Dockerfile
│
├── frontend/     # Contains the Next.js 15 frontend application
│   ├── app/      # App Router pages and components
│   ├── public/   # Static assets
│   └── package.json
│
└── .gitignore    # Root gitignore for the entire monorepo
```

---

## ✨ Available Scripts

Inside the `frontend` directory, you can run several commands:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server.