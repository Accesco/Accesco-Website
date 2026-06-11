# ACCESCO Living Platform
Welcome to the **ACCESCO Living** repository. This project contains the source code, static pages, and web applications that power the ACCESCO services.
## Repository Structure
The repository is organized into the following main directories and files:
*   **[Accesco/](file:///C:/Users/21par/OneDrive/Desktop/accesco/ACCESCO-Living-/Accesco)**: The core web application built with Next.js, featuring integrated services such as Grokly marketplace, Instastyle order tracking, Swadisht services, CalcIQ, and more.
*   **[index.html](file:///C:/Users/21par/OneDrive/Desktop/accesco/ACCESCO-Living-/index.html)**: The main landing page for the ACCESCO Living web portal.
*   **[Privacy_policy.html](file:///C:/Users/21par/OneDrive/Desktop/accesco/ACCESCO-Living-/Privacy_policy.html)**: Static privacy policy document.
*   **[Refund_policy.html](file:///C:/Users/21par/OneDrive/Desktop/accesco/ACCESCO-Living-/Refund_policy.html)**: Static refund and cancellation policy document.
---
## Core Applications
### 1. Accesco Next.js Web App
The subfolder `Accesco` contains the primary dynamic application.
#### Features:
*   **Grokly**: Real-time grocery and product marketplace.
*   **Instastyle**: Custom order tracking with live Leaflet map integrations.
*   **Swadisht**: Smart dining, subscription service, and catering engine.
*   **Dinex, Localmeds, Grokly checkout/profile**: Fully responsive modules.
#### Get Started in `Accesco/`:
1.  Navigate into the directory:
    ```bash
    cd Accesco
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables (create `.env.local` based on the configuration guide in [Accesco/README.md](file:///C:/Users/21par/OneDrive/Desktop/accesco/ACCESCO-Living-/Accesco/README.md)).
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Build for production:
    ```bash
    npm run build
    npm start
    ```
---
## Git Configuration
A `.gitignore` configuration is set up at both the root directory and the `Accesco/` sub-project to ensure local build artifacts, secrets, and transient dependencies are not committed:
*   `node_modules/` (Dependencies)
*   `.next/` (Next.js build output)
*   `.env.local` (Local configuration and credentials)
