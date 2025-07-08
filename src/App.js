import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const bananaUrl = 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768';
const chickenUrl = 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg';
const youDiedUrl = 'https://i.redd.it/hxva4t0uvd751.jpg';

const GRID_SIZE = 6;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

function getRandomBoard() {
  const board = [];
  for (let i = 0; i < TOTAL_TILES; i++) {
    if (board.filter(item => item === 'banana').length === TOTAL_TILES/2){
      board.push('chicken');
    } 
    else if (board.filter(item => item === 'chicken').length === TOTAL_TILES/2){
      board.push('banana');
    }
    else {
      board.push(Math.random() < 0.5 ? 'banana' : 'chicken');
    }
  }
  return board;
}

function App() {
  const [board, setBoard] = useState(getRandomBoard);
  const [revealed, setRevealed] = useState(Array(TOTAL_TILES).fill(false));//Change to true to reveal the box
  const [playerChoice, setPlayerChoice] = useState(null); 
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [showYouDied, setShowYouDied] = useState(false);

  const backgroundMusicRef = useRef(null);
  const deathSoundRef = useRef(null);

  const handleTileClick = (index) => {
    if (gameOver || revealed[index] || !playerChoice) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    const clickedItem = board[index];

    if (clickedItem !== playerChoice) {
      setMessage(`Oops! You clicked a ${clickedItem}. You lose!`);
      setGameOver(true);
      setShowYouDied(true);

      if (deathSoundRef.current) {
        deathSoundRef.current.volume = 0.5;
        deathSoundRef.current.play();
      }

      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    } else if (newRevealed.every((rev, idx) => !rev || board[idx] !== playerChoice)) {
      setMessage(`Congratulations! You found all the ${playerChoice}s. You win!`);
      setGameOver(true);

      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    }
  };

  const startNewGame = () => {
    setBoard(getRandomBoard());
    setRevealed(Array(TOTAL_TILES).fill(false));
    setGameOver(false);
    setMessage('');
    setPlayerChoice(null);
    setShowYouDied(false);

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }

    if (deathSoundRef.current) {
      deathSoundRef.current.pause();
      deathSoundRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (playerChoice && backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = 0.3;
      backgroundMusicRef.current.play().catch(err =>
        console.log('Autoplay blocked:', err)
      );
    }
  }, [playerChoice]);

  return (
    <div className="container">
      <h1>Chicken Banana Game</h1>

      {!playerChoice && (
        <div className="choice">
          <p>Select your side:</p>
          <button onClick={() => setPlayerChoice('banana')}>Banana Player</button>
          <button onClick={() => setPlayerChoice('chicken')}>Chicken Player</button>
        </div>
      )}

      {playerChoice && (
        <p>You are the <strong>{playerChoice.toUpperCase()} Player</strong>.</p>
      )}

      <div className="grid">
        {board.map((item, index) => (
          <div key={index} className="square" onClick={() => handleTileClick(index)}>
            {revealed[index] ? (
              <img
                src={item === 'banana' ? bananaUrl : chickenUrl}
                alt={item}
              />
            ) : (
              <div className="hidden-tile">{index + 1}</div>
            )}
          </div>
        ))}
      </div>

      {message && <h2>{message}</h2>}
      <button onClick={startNewGame}>Restart Game</button>

      {showYouDied && (
        <div className="you-died-overlay">
          <div className="you-died-image-wrapper">
            <img src={youDiedUrl} alt="YOU DIED" className="you-died-image" />
            <button className="respawn-button" onClick={startNewGame}>Respawn</button>
          </div>
        </div>
      )}

      <audio ref={backgroundMusicRef} loop>
        <source src="/audio/Vordt.MP3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <audio ref={deathSoundRef}>
        <source src="/audio/you-died.MP3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;