# Virtual Metal Amp

An interactive virtual amplifier based on a custom design. Dial in your tone using the knobs and use Gemini to generate a unique name and description for your sound.

This project was built with React, TypeScript, and Tailwind CSS. It uses the Gemini API for tone name and description generation.

## Features

-   Interactive amp knobs for Gain, Bass, Mid, Treble, and Volume.
-   Real-time tone name and description generation powered by the Gemini API.
-   Debounced API calls for a smooth user experience.
-   Connect a real instrument via an audio interface.
-   Audio visualizer that reacts to your playing.
-   Load custom cabinet impulse response (.wav) files (Note: audio processing is for visual effect only).
-   Sleek, responsive design.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   A [Google Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key).

## Setup and Installation

1.  **Download and extract the project files, or clone the repository.**

2.  **Navigate into the project directory:**
    ```bash
    cd virtual-metal-amp
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up your environment variables:**
    -   Create a new file named `.env` in the root of the project.
    -   Add your Gemini API key to this file:
        ```
        VITE_API_KEY="YOUR_GEMINI_API_KEY_HERE"
        ```
    -   Replace `"YOUR_GEMINI_API_KEY_HERE"` with your actual key.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the application on `http://localhost:5173` (or another port if 5173 is busy).

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the app for production.
-   `npm run preview`: Serves the production build locally.

## How It Works

The application allows you to adjust the amplifier's settings. Each time you change a knob, the new settings are sent to the Gemini API after a short delay. Gemini then returns a creative name and description for the tone you've dialed in, which is displayed on the screen.

You can also connect a microphone or an audio interface to visualize the audio input on the amp's front panel.
