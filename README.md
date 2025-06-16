TypeRacer Pro 🎯
A modern, feature-rich typing test application built with React. Test your typing speed and accuracy with multiple game modes, difficulty levels, and real-time statistics.
✨ Features
🎮 Multiple Game Modes

Single Player: Classic typing test with personal stats
Race Mode: Compete against AI opponents with customizable WPM settings
Challenge Mode: Advanced typing challenges (Coming Soon)

🎯 Difficulty Levels

Easy: Simple sentences and common words
Medium: Technical content and longer paragraphs
Hard: Code snippets and programming syntax

⏱️ Flexible Time Settings

30 seconds
1 minute
2 minutes
5 minutes

📊 Real-Time Statistics

Words Per Minute (WPM)
Accuracy percentage
Error count
Live progress tracking
Character-by-character highlighting

🏁 Race Mode Features

Compete against up to 3 AI opponents
Customizable AI typing speeds (20-150 WPM)
Real-time race progress visualization
Final standings and results

🚀 Getting Started
Prerequisites

Node.js (v14 or higher)
npm or yarn

Installation

Clone the repository

bashgit clone https://github.com/yourusername/typeracer-pro.git
cd typeracer-pro

Install dependencies

bashnpm install
# or
yarn install

Start the development server

bashnpm start
# or
yarn start

Open http://localhost:3000 to view it in the browser

🎯 How to Use

Select Your Settings

Choose game mode (Single Player or Race)
Pick difficulty level (Easy, Medium, Hard)
Set time limit (30s, 1min, 2min, 5min)


Start Typing

Click in the text area or start typing to begin
Follow the highlighted text character by character
Correct characters turn green, errors turn red


Track Your Progress

Monitor your WPM, accuracy, and errors in real-time
In Race Mode, see your progress against AI opponents


View Results

Get detailed statistics when the test completes
See final standings in Race Mode
Click Reset to try again with new settings



🎨 Customization
Adding New Text Content
Edit the textSets object in the component to add new typing content:
javascriptconst textSets = {
  easy: [
    "your easy text here...",
    // more easy texts
  ],
  medium: [
    "your medium difficulty text here...",
    // more medium texts
  ],
  hard: [
    "your hard/code text here...",
    // more hard texts
  ]
};
