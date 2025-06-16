import React, { useState, useEffect, useRef, useCallback } from "react";
import "./wpm.css";

const Wpm = () => {
  const [gameMode, setGameMode] = useState("single"); // 'single', 'race', 'challenge'
  const [difficulty, setDifficulty] = useState("medium");
  const [timeLimit, setTimeLimit] = useState(60);
  const [currentText, setCurrentText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [totalChars, setTotalChars] = useState(0);

  // Race mode settings
  const [aiWpmSettings, setAiWpmSettings] = useState([65, 70, 75]);
  const [opponents, setOpponents] = useState([]);
  const [raceProgress, setRaceProgress] = useState({});

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const textSets = {
    easy: [
      "the quick brown fox jumps over the lazy dog and runs through the forest with great speed",
      "hello world this is a simple typing test for beginners who want to improve their skills",
      "coding is fun when you practice every day and learn new programming languages like javascript",
      "artificial intelligence is changing the world in many ways and making our lives easier",
      "web development requires knowledge of html css and javascript to create amazing websites",
      "machine learning algorithms can process large amounts of data to find patterns and insights",
      "social media platforms connect people from all around the world and share information instantly",
      "mobile applications have revolutionized how we communicate work and entertain ourselves daily",
      "cloud computing allows businesses to store and access data from anywhere with internet connection",
      "cybersecurity is crucial for protecting personal information and preventing data breaches online",
    ],
    medium: [
      "JavaScript is a versatile programming language that powers modern web development and enables interactive user experiences across browsers worldwide",
      "React components allow developers to build reusable UI elements that manage their own state and lifecycle methods efficiently for complex applications",
      "The evolution of web technologies has transformed how we create applications from simple static pages to complex interactive platforms with real-time features",
      "Modern software development practices include version control systems like Git continuous integration deployment pipelines and automated testing frameworks",
      "Database management systems store organize and retrieve vast amounts of information using structured query language and advanced indexing techniques",
      "Application programming interfaces facilitate communication between different software systems enabling seamless data exchange and third-party integrations",
      "User experience design focuses on creating intuitive interfaces that prioritize accessibility usability and aesthetic appeal for diverse user demographics",
      "Agile development methodologies emphasize iterative progress collaborative teamwork and adaptive planning to deliver high-quality software products efficiently",
      "Cloud architecture patterns leverage distributed computing resources to build scalable resilient applications that can handle varying workloads automatically",
      "Artificial intelligence and machine learning technologies are revolutionizing industries by automating complex tasks and providing data-driven insights for decision making",
    ],
    hard: [
      "const fibonacci = (n) => { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }; console.log(fibonacci(10));",
      "async function fetchData() { try { const response = await fetch('/api/data'); return await response.json(); } catch (error) { console.error('Error:', error); } }",
      "class BinarySearchTree { constructor() { this.root = null; } insert(value) { this.root = this._insertNode(this.root, value); return this; } }",
      "const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func.apply(this, args), delay); }; };",
      "function quickSort(arr) { if (arr.length <= 1) return arr; const pivot = arr[Math.floor(arr.length / 2)]; return [...quickSort(arr.filter(x => x < pivot)), ...arr.filter(x => x === pivot), ...quickSort(arr.filter(x => x > pivot))]; }",
      "const memoize = (fn) => { const cache = new Map(); return (...args) => { const key = JSON.stringify(args); return cache.has(key) ? cache.get(key) : cache.set(key, fn(...args)).get(key); }; };",
      "export default function useLocalStorage(key, initialValue) { const [storedValue, setStoredValue] = useState(() => { try { return window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : initialValue; } catch (error) { return initialValue; } }); }",
      "const createStore = (reducer, initialState) => { let state = initialState; const listeners = []; return { getState: () => state, dispatch: (action) => { state = reducer(state, action); listeners.forEach(listener => listener()); }, subscribe: (listener) => { listeners.push(listener); return () => listeners.splice(listeners.indexOf(listener), 1); } }; };",
      "function* fibonacci() { let [prev, curr] = [0, 1]; while (true) { yield curr; [prev, curr] = [curr, prev + curr]; } } const fib = fibonacci(); console.log([...Array(10)].map(() => fib.next().value));",
      "const compose = (...functions) => (arg) => functions.reduceRight((acc, fn) => fn(acc), arg); const pipe = (...functions) => (arg) => functions.reduce((acc, fn) => fn(acc), arg);",
    ],
  };

  const generateOpponents = useCallback(() => {
    const names = [
      "CodeMaster",
      "TypeRacer",
      "KeyboardNinja",
      "SpeedDemon",
      "FastFingers",
      "QuickTyper",
      "RapidFire",
      "SwiftKeys",
      "TurboTypist",
      "LightningBolt",
    ];
    const newOpponents = [];

    for (let i = 0; i < 3; i++) {
      const targetWpm = aiWpmSettings[i] || 60 + Math.random() * 20;

      newOpponents.push({
        id: i,
        name:
          names[Math.floor(Math.random() * names.length)] +
          Math.floor(Math.random() * 1000),
        targetWpm: targetWpm,
        progress: 0,
        finished: false,
      });
    }

    setOpponents(newOpponents);

    const initialProgress = {};
    newOpponents.forEach((opponent) => {
      initialProgress[opponent.id] = 0;
    });
    setRaceProgress(initialProgress);
  }, [aiWpmSettings]);

  const selectRandomText = useCallback(() => {
    const texts = textSets[difficulty];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(randomText);
  }, [difficulty]);

  const resetGame = useCallback(() => {
    // Clear timer immediately
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setUserInput("");
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setStartTime(null);
    setTimeLeft(timeLimit);
    setIsActive(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTotalChars(0);
    selectRandomText();

    if (gameMode === "race") {
      generateOpponents();
    }

    // Focus input after a small delay to ensure state is updated
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, [timeLimit, selectRandomText, gameMode, generateOpponents]);

  const updateOpponentProgress = useCallback(() => {
    if (gameMode !== "race" || !isActive) return;

    setRaceProgress((prev) => {
      const newProgress = { ...prev };

      opponents.forEach((opponent) => {
        if (!opponent.finished) {
          // More realistic AI typing simulation
          const baseSpeed = opponent.targetWpm / 60; // characters per second
          const randomVariation = (Math.random() - 0.5) * 0.3; // ±15% variation
          const actualSpeed = baseSpeed * (1 + randomVariation);
          const progressIncrement = (actualSpeed / currentText.length) * 100;

          newProgress[opponent.id] = Math.min(
            100,
            (newProgress[opponent.id] || 0) + progressIncrement
          );

          if (newProgress[opponent.id] >= 100) {
            opponent.finished = true;
          }
        }
      });

      return newProgress;
    });
  }, [gameMode, isActive, opponents, currentText.length]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (isActive && timeLeft > 0 && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft, isFinished]);

  useEffect(() => {
    if (gameMode === "race" && isActive) {
      const opponentTimer = setInterval(updateOpponentProgress, 100);
      return () => clearInterval(opponentTimer);
    }
  }, [gameMode, isActive, updateOpponentProgress]);

  const calculateStats = useCallback(() => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = userInput
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
    const currentAccuracy =
      totalChars > 0
        ? Math.round(((totalChars - errors) / totalChars) * 100)
        : 100;

    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
  }, [startTime, userInput, errors, totalChars]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!isActive && !isFinished) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    if (isFinished) return;

    // Don't allow input longer than the current text
    if (value.length > currentText.length) {
      return;
    }

    setUserInput(value);
    setTotalChars(value.length);

    // Calculate errors by comparing character by character
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Check if test is completed
    if (value === currentText) {
      setIsActive(false);
      setIsFinished(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Update word and character indices
    const typedText = value;
    const words = currentText.split(" ");
    let charCount = 0;
    let wordIndex = 0;
    let charInWordIndex = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wordEndIndex =
        charCount + word.length + (i < words.length - 1 ? 1 : 0); // +1 for space

      if (typedText.length <= wordEndIndex) {
        wordIndex = i;
        charInWordIndex = Math.max(0, typedText.length - charCount);
        break;
      }

      charCount = wordEndIndex;
    }

    setCurrentWordIndex(wordIndex);
    setCurrentCharIndex(charInWordIndex);
  };

  const getUserProgress = () => {
    if (!currentText) return 0;
    return Math.min(100, (userInput.length / currentText.length) * 100);
  };

  const handleAiWpmChange = (index, value) => {
    const newWpm = Math.max(20, Math.min(150, parseInt(value) || 0));
    const newSettings = [...aiWpmSettings];
    newSettings[index] = newWpm;
    setAiWpmSettings(newSettings);
  };

  const renderText = () => {
    if (!currentText) return null;

    return (
      <div className="text-display">
        {currentText.split("").map((char, index) => {
          const inputChar = userInput[index];
          let className = "char";

          if (index < userInput.length) {
            className += inputChar === char ? " correct" : " error";
          } else if (index === userInput.length && isActive) {
            className += " current";
          }

          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const renderRaceView = () => {
    if (gameMode !== "race") return null;

    const userProgress = getUserProgress();

    return (
      <div className="race-container">
        <div className="race-settings">
          <h3>Race Settings</h3>
          <div className="race-controls">
            <label>AI WPM Settings:</label>
            {aiWpmSettings.map((wpm, index) => (
              <div key={index} className="control-group">
                <label>AI {index + 1}:</label>
                <input
                  type="number"
                  value={wpm}
                  onChange={(e) => handleAiWpmChange(index, e.target.value)}
                  min="20"
                  max="150"
                  className="ai-wpm-input"
                  disabled={isActive}
                />
              </div>
            ))}
            <button onClick={generateOpponents} disabled={isActive}>
              Generate New Opponents
            </button>
          </div>
        </div>

        <div className="race-track">
          <div className="racer user-racer">
            <div className="racer-info">
              <span className="racer-name">You</span>
              <span className="racer-wpm">{wpm} WPM</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill user-progress"
                style={{ width: `${userProgress}%` }}
              ></div>
            </div>
          </div>

          {opponents.map((opponent) => (
            <div key={opponent.id} className="racer">
              <div className="racer-info">
                <span className="racer-name">{opponent.name}</span>
                <span className="racer-wpm">
                  {Math.round(opponent.targetWpm)} WPM
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill opponent-progress"
                  style={{ width: `${raceProgress[opponent.id] || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="typing-test">
      <div className="header">
        <h1>TypeRacer Pro</h1>

        <div className="controls">
          <div className="control-group">
            <label>Mode:</label>
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
              disabled={isActive}
            >
              <option value="single">Single Player</option>
              <option value="race">Race Mode</option>
              <option value="challenge">Challenge</option>
            </select>
          </div>

          <div className="control-group">
            <label>Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={isActive}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard (Code)</option>
            </select>
          </div>

          <div className="control-group">
            <label>Time:</label>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              disabled={isActive}
            >
              <option value={30}>30s</option>
              <option value={60}>60s</option>
              <option value={120}>2min</option>
              <option value={300}>5min</option>
            </select>
          </div>

          <button onClick={resetGame}>Reset</button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Time:</span>
          <span className="stat-value">{timeLeft}s</span>
        </div>
        <div className="stat">
          <span className="stat-label">WPM:</span>
          <span className="stat-value">{wpm}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value">{accuracy}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Errors:</span>
          <span className="stat-value">{errors}</span>
        </div>
      </div>

      {renderRaceView()}

      <div className="game-area">
        {renderText()}

        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          className="input-area"
          placeholder={
            isFinished
              ? "Test completed! Click Reset to try again."
              : "Start typing..."
          }
          disabled={isFinished}
          autoFocus
        />
      </div>

      {isFinished && (
        <div className="results">
          <h2>🎉 Results</h2>
          <div className="result-stats">
            <div className="result-stat">
              <span className="big-number">{wpm}</span>
              <span className="stat-label">WPM</span>
            </div>
            <div className="result-stat">
              <span className="big-number">{accuracy}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="result-stat">
              <span className="big-number">{errors}</span>
              <span className="stat-label">Errors</span>
            </div>
          </div>

          {gameMode === "race" && (
            <div className="race-results">
              <h3>🏁 Race Results</h3>
              <div className="final-standings">
                {[
                  ...opponents,
                  {
                    id: "user",
                    name: "You",
                    targetWpm: wpm,
                    progress: getUserProgress(),
                  },
                ]
                  .sort((a, b) => b.progress - a.progress)
                  .map((racer, index) => (
                    <div
                      key={racer.id}
                      className={`standing ${
                        racer.id === "user" ? "user-standing" : ""
                      }`}
                    >
                      <span className="position">#{index + 1}</span>
                      <span className="name">{racer.name}</span>
                      <span className="final-wpm">
                        {Math.round(racer.targetWpm)} WPM
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wpm;
