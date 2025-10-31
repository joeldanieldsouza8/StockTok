# StockTok 📈



![StockTok Screenshot](./docs/images/screenshot.png) 
<!-- TODO: Add a screenshot of your application and update this path -->

## ✨ Features



## 🛠️ Tech Stack

| Category        | Technology                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend**    | [**Next.js**](https://nextjs.org/), [**React**](https://reactjs.org/), [**TypeScript**](https://www.typescriptlang.org/), [**Tailwind CSS**](https://tailwindcss.com/) |
| **Backend**     | [**.NET**](https://dotnet.microsoft.com/), [**C#**](https://learn.microsoft.com/en-us/dotnet/csharp/), [**ASP.NET Core Web API**](https://learn.microsoft.com/en-us/aspnet/core/web-api/)      |
| **Authentication** | [**Auth0**](https://auth0.com/)                                                                             |
| **Database**    | _(e.g., PostgreSQL, SQL Server with Entity Framework Core)_                                                 | <!-- TODO: Update with your database -->

## 🚀 Getting Started

Follow these instructions to get the project set up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [.NET SDK](https://dotnet.microsoft.com/download) (v8.0 or later recommended)
*   [Git](https://git-scm.com/)
*   An [Auth0 Account](https://auth0.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/StockTok.git
    cd StockTok
    ```

2.  **Set up the Backend:**
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Restore the .NET dependencies:
        ```bash
        dotnet restore
        ```
    *   Run the backend server (it will typically start on `http://localhost:5266`):
        ```bash
        cd StockTok
        dotnet run
        ```

3.  **Set up the Frontend:**
    *   In a new terminal, navigate to the frontend directory:
        ```bash
        cd frontend
        ```
    *   Install the Node.js dependencies:
        ```bash
        npm install
        ```
    *   Create your local environment file from the template:
        ```bash
        cp .env.example .env.local
        ```
    *   **Important:** Open `.env.local` and fill in the required values. See the [Environment Variables](#-environment-variables) section below.
    *   Run the frontend development server (it will start on `http://localhost:3000`):
        ```bash
        npm run dev
        ```

You should now have the frontend running on `http://localhost:3000` and the backend on `http://localhost:5266`.

## ⚙️ Environment Variables

For development purposes the `.env.local` file is shared on the group Teams channel. The `.env.local` file is to never be included in any git commits for security purposes.