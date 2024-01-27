import React, { useEffect, useState, useRef } from 'react'

export default function Word() {
    const [word, setWord] = useState('');
    const [inputs, setInputs] = useState([]);
    const [joinWord, setJoinWord] = useState('');
    const [statuses, setStatuses] = useState([]);
    const [last, setLast] = useState(false);
    const inputsRef = useRef([]);
    useEffect(() => {
      fetch('http://127.0.0.1:5000/api/start', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json', 
    },
  })
          .then(response => response.json())
          .then(data => {
            setWord(data);
            
            setInputs(new Array(5).fill().map(() => new Array(data.target_word.length).fill('')));
          })
          .catch(error => console.error('Error:', error));
    }, []);
    useEffect(() => {
      const newJoinWords = inputs.map(inputRow => inputRow.join(''));
      setJoinWord(newJoinWords);
    }, [inputs]);
    useEffect(() => {
      inputsRef.current = inputs.map((_, i) => {
        if (!inputsRef.current[i]) {
          // Create an array of refs for each row
          inputsRef.current[i] = inputs[i].map(() => React.createRef());
        }
        return inputsRef.current[i];
      });
    }, [inputs]);
    const handleInputChange = (row, index) => (event) => {
      const newInputs = [...inputs];
      newInputs[row][index] = event.target.value;
      setInputs(newInputs);
    };
   
    const handleSubmit = (row) => async (event) => {
      event.preventDefault();
      const wordToSubmit = joinWord[row];
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/submit`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ guess: wordToSubmit }),
        });
        const data = await res.json();
        const newStatuses = [...statuses];
        newStatuses[row] = data.statuses;
        setStatuses(newStatuses); 
        if (row === inputs.length - 1) {
          setLast(true)
        }
      } catch (error) {
        console.error(error);
      }
    };
    const newGame = () => {
      window.location.reload();
    }
    const handleKeyUp = (row, index) => (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (index < inputs[row].length - 1) {
          // If it's not the last input in the row, focus on the next input in the same row
          inputsRef.current[row][index + 1].current.focus();
        } else if (row < inputs.length - 1) {
          // If it's the last input in the row and it's not the last row, focus on the first input of the next row
          inputsRef.current[row + 1][0].current.focus();
        } else {
          // If it's the last input in the last row, submit the form
          handleSubmit(row)(event);
        }
      }
      if (event.key === 'Backspace') {
        event.preventDefault();
        if (index > 0) {
          inputsRef.current[row][index - 1].current.focus();
        }
      }
    };
    return (
      <>
      <div className='flex items-center  flex-col min-h-screen bg-slate-700'>
          <h1 className="text-white text-2xl">Wordle</h1>
          <div>
              {word ? word.target_word : "Loading..."}
              <div className="flex gap-2 flex-col">
              {inputs.map((inputRow, rowIndex) => (
                  <form key={rowIndex} className="flex gap-2">
                      {inputRow.map((input, index) => (
                          <input key={index} type="text" className={`w-[5rem] h-[5rem] border-4 text-center ${statuses[rowIndex] && statuses[rowIndex][index] === 'correct' ? 'bg-green-500' : statuses[rowIndex] && statuses[rowIndex][index] === 'yellow' ? 'bg-yellow-500' : statuses[rowIndex] && statuses[rowIndex][index] == 'incorrect' ? 'bg-black text-white': ''}`} maxLength="1" value={input} onChange={handleInputChange(rowIndex, index)} onKeyUp={handleKeyUp(rowIndex, index)} ref={inputsRef.current[index]}></input>
                      ))}
                  </form>
              ))}
              <div className="mt-2">
                  {last && <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={newGame}>New Game</button>}
              </div>
              </div>
          </div>
      </div>
      </>
    )
}