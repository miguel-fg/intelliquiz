<p align="center">
<img src="./src/components/images/logo.png" width="200" height="200" alt="Intelliquiz logo"/>
</p>
<h1 align="center">
IntelliQuiz - An AI-Powered Quiz Maker App
</h1>

![Application quiz page example](https://github.com/pfang12/CPSC-2350-Project/assets/72409412/fc61b89a-c2ee-456e-bee9-9514bf8a315c)

## 🗺️ Overview
IntelliQuiz is designed for students who wish to streamline study sessions and instructors who want to simplify quiz creation for their classes. 

This project aims to offer customizable AI-generated quizzes from direct text inputs or PDF documents. The quizzes are interactive and provide "Hint" buttons; they can be attempted directly in the application or can be downloaded as PDF files. Quiz results provide feedback and highlights areas needing further review. The final summary and results can also be downloaded as a report PDF.

### [-> Try out the site <-](https://miguel-fg.github.io/intelliquiz/)

## 🏠 Running IntelliQuiz locally
Intelliquiz is a [monorepo](https://en.wikipedia.org/wiki/Monorepo). The client of the application is located in the root `./` directory and the server-side application is in the `./server` folder.  

### Prerequisites
* `Node.js` version 18 or above

### Steps to Run Locally

1. **Clone the repository**
   
   Clone the IntelliQuiz repository from GitHub to your local machine:
   ``` bash
   git clone https://github.com/miguel-fg/intelliquiz.git
   ```
2. **Install dependencies**

   Both the client and the server require installing Node.js dependencies:

   * Navigate to the root folder (client) and run `npm install`:
      ``` bash
      cd intelliquiz
      npm install
      ```

   * Then, navigate to the `./server` folder and run the same command:
     ``` bash
     cd server
     npm install
     ```
3. **Configure environment variables**

   * **Client**
     
     In the root of the directory, create a `.env` file with the following variables:
     ``` bash
     VITE_USE_DEPLOYED_BASE=false
     VITE_LOCAL_BASE_URL=http://localhost:4000
     ```
     These variables allow you to specify whether you want to use the local server or a deployed server for your API calls. The default setup assumes you'll be using the local server at `localhost:4000`.

     If you're deploying your own backend, you can add this additional variable to specify the deployed backend URL:
     ``` bash
     VITE_DEPLOYED_BASE_URL=https://your-deployed-backend-url.com
     ```
     Make sure to change the value of `VITE_USE_DEPLOYED_BASE` to `true` if testing a deployed server.  
   * **Server**

     In the `./server` directory, create another `.env` file with the following variables:
     ``` bash
     OPENAI_KEY=your-openai-api-key
     PDF_CLIENT_ID=your-adobe-pdf-client-id
     PDF_CLIENT_SECRET=your-adobe-pdf-client-secret
     ```

     You'll need to obtain your own API keys from [OpenAI](https://platform.openai.com/) and [Adobe PDF Services](https://developer.adobe.com/document-services/).

4. **Run the applications**

   With the `.env` files in place and the dependencies installed, you can run both the client and server concurrently.

   * Open two terminals:

     * In the first terminal, navigate to the `./server` directory of the repository and run the server:
       ``` bash
       npm run dev
       ```
     * In the second terminal, navigate to the root directory `./` of the repository and run the client:
       ``` bash
       npm run dev
       ```
   The client will run on `http:localhost:5173` and the server on `http://localhost:4000`. You can adjust the ports in the `./.env` file or `./vite.config.js` file if necessary.
   
## 🧰 Tech Stack
IntelliQuiz was built using:

### Frontend 
* React
* Node.js
* Vite
* Tailwind CSS
* JavaScript (ES6)

### Backend
* Hono
* Node.js
* TypeScript

### External APIs
* Open AI
* Adobe PDF Services

### Deployment
* GitHub Pages (client)
* Render (server)

## 🧑‍💻 Authors
* Harpreet Singh
* Miguel Fierro
* Patrick Fang
* Utsav Monga
