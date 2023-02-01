import './App.css';
import Die from './components/Die'
import React, { useRef } from "react"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

function App() {


 const [dice, setDice] = React.useState(allNewDice())
 const [tenzies, setTenzies] = React.useState(false)
 const [renderCount, setRenderCount] = React.useState(0)

 // this is our state for our timer //
 const [minutes, setMinutes] = React.useState(0);
 const [seconds, setSeconds] = React.useState(0);

 // this is our state for our highscore state variable //
 const [highscore, setHighscore] = React.useState(null)




 React.useEffect(() => {
  let storedHighscore = JSON.parse(localStorage.getItem('tenzies-highscore'));
  if (storedHighscore) {
    setHighscore(storedHighscore);
  }
}, []);


function updateHighscore() {
    const currentTime = minutes * 60 + seconds;
    const highScoreInSeconds = highscore?.minutes ? (highscore.minutes * 60) + highscore.seconds : 0

    // don't set a time of zero
    if (currentTime === 0) return

    if (!highScoreInSeconds || currentTime < highScoreInSeconds) {
      setHighscore({ minutes, seconds });
      localStorage.setItem('tenzies-highscore', JSON.stringify({ minutes, seconds }));
    }
}

 let intervalId;

 React.useEffect(() => {
   if (!tenzies) {
     intervalId = setInterval(() => {
       setSeconds(seconds => seconds + 1);
       if (seconds === 59) {
         setMinutes(minutes => minutes + 1);
         setSeconds(0);
       }
     }, 1000);
   } else {
     clearInterval(intervalId);
     setSeconds(0)
     setMinutes(0)
   }
   return () => clearInterval(intervalId);
 }, [tenzies, seconds, minutes]);



  /**
 * Challenge: Check the dice array for these winning conditions:
 * 1. All dice are held, and
 * 2. all dice have the same value
 *
 * If both conditions are true, set `tenzies` to true and log
 * "You won!" to the console
 */


  React.useEffect(() => {
    const allDiceHeld = dice.every(die => die.isHeld === true)
    const allDiceSameValue = dice.every(die => die.value === dice[0].value)
    if (allDiceHeld && allDiceSameValue) {
      setTenzies(true)
      updateHighscore()
      console.log("You won!")
    }
 }, [dice])



  function generateNewDice() {
    return {
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid()
    }
  }




  function allNewDice() {
  const newDice = [];
  for (let i = 0; i < 10; i++) {
    newDice.push(generateNewDice())
  }
  return newDice
}

function holdDice(id) {
  setDice(prevDice => {
    return prevDice.map(die => {
      if (die.id === id) {
        return {...die, isHeld: !die.isHeld}
      }
      return die
    })
  })
}


function rollDice() {
  setRenderCount(renderCount + 1)
  if(tenzies) {
    setDice(allNewDice())
    setTenzies(false)
    setRenderCount(0)
  } else {
  setDice(prevDice => prevDice.map(dice => {
    return dice.isHeld ? dice : generateNewDice()
  }))
  }
}

function clearHighscore() {
  localStorage.removeItem('tenzies-highscore')
    setHighscore(null)
}

  const diceElements = dice.map(dice => <Die key={dice.id} value={dice.value} isHeld={dice.isHeld} handleClick={() => holdDice(dice.id)} />)

  return (
    <div>
      <div className="info-container">
        <div className="highscore-container">
        <h2 className="highscore">{highscore !== null ? `Highscore: ${highscore?.minutes}:${highscore?.seconds}` : 'none' }</h2>
        </div>
      <div className="timer-container">
      <h2 className="timer">{tenzies ? "00:00" : `${minutes}:${seconds}`}</h2>

      </div>
    <div className="roll-container">
      <h1 className="roll-counter">Rolls:{renderCount}</h1>
    </div>
    </div>
   <main>
    {tenzies && <Confetti width="720"/>}
    <h1 className="title">Tenzies</h1>
    <h2 className="description">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</h2>
      <div className="die-container">
       {diceElements}
      </div>
      <button
        className="roll-button"
        onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
       <button
           className="roll-button"
           onClick={clearHighscore}
       >
           Clear Highscore
       </button>
   </main>
   </div>
  );
}

export default App;
