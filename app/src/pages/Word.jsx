import React, { useEffect, useState, useRef } from "react";
import { containsLetters } from "../exports/Regex";

export default function Word() {
  const [word, setWord] = useState("");
  const [inputs, setInputs] = useState([]);
  const [joinWord, setJoinWord] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [last, setLast] = useState(false);
  const [focusedInput, setFocusedInput] = useState({ row: 0, index: 0 });
  const inputsRef = useRef([]);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [gamesLost, setGamesLost] = useState(0);
  const [incorrect, setIncorrect] = useState()
  const [noNumbers, setNoNumbers] = useState();
  const [noBad, setNoBad] = useState();
  
  // let count2 = 0;
  // console.log(test)
//  console.log(inputs)
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setWord(data);
        setInputs(
          new Array(6)
            .fill()
            .map(() => new Array(data.word.length).fill(""))
        );
        let count = localStorage.getItem("gamesPlayed");
        count = count ? Number(count) : 0;
        count += 1;
       // console.log(count);
        localStorage.setItem("gamesPlayed", count);
        setCount(count);
        let wonCount = localStorage.getItem("gamesWon");
        let lostCount = localStorage.getItem("gamesLost");
        wonCount = wonCount ? Number(wonCount) : 0;
        lostCount = lostCount ? Number(lostCount) : 0;
        setGamesWon(wonCount);
        setGamesLost(lostCount);
      })
      .catch((error) => console.error("Error:", error));
  }, []);
  //console.log(count)
  
  useEffect(() => {
    const newJoinWords = inputs.map((inputRow) => {
      // console.log(inputRow);
      return inputRow.join("");
    });
    //console.log(newJoinWords)
    setJoinWord(newJoinWords);
  }, [inputs]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusedInput]);
  useEffect(() => {
   // console.log(statuses.length)
    if (
      statuses.length > 0 &&
      statuses[statuses.length - 1].every((status) => status === "correct")
    ) {
      // The game is won
      let wonCount = localStorage.getItem("gamesWon");
      wonCount = wonCount ? Number(wonCount) + 1 : 1;
      localStorage.setItem("gamesWon", wonCount);
      setGamesWon(wonCount);
      setOpen(true);
    } 
  }, [statuses]);
 // console.log(inputs)
  const handleSubmit = (row, index) => async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const wordGuess = inputs[row].join("");
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guess: wordGuess }),
      });
      const data = await res.json();
      const newStatuses = [...statuses];
      newStatuses[row] = data.statuses;
      setStatuses(newStatuses);
      setIncorrect((prevIncorrect) => {
        const newIncorrect = [...(prevIncorrect || []), ...data.incorrectChars];
        // remove duplicates
        return [...new Set(newIncorrect)];
      });
      if (row === inputs.length - 1) {
        setLast(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
 // console.log(incorrect)
  const handleInputChange = (row, index) => (event) => {
    const newInputs = [...inputs];
    newInputs[row][index] = event.target.value;
    setInputs(newInputs);
    setFocusedInput({ row, index });

    if (event.target.value.length === 1) {
      if (index < inputs[row].length - 1) {
        setFocusedInput({ row, index: index + 1 });
      } else {
        handleSubmit(row, index)(event);
        if (row < inputs.length - 1) {
          setFocusedInput({ row: row + 1, index: 0 });
        }
      }
    }
  };
  const newGame = () => {
    window.location.reload();
  };
  const handleKeyUp = (row, index) => (event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      let nextRow = row;
      //console.log('row', nextRow)
      let nextIndex = index - 1;
      //console.log(nextIndex);
      if (nextRow >= 0) {
        setFocusedInput({ row: nextRow, index: nextIndex });
      }
    }
    if(statuses[row] && statuses[row][index] === "numeric"){
      setNoNumbers(true);
      event.preventDefault();
    }
  };
  const closeOpen = () => {
    setOpen(false);
    window.location.reload();
  };
  const noEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
     
  };
  return (
    <>
      <div className="flex items-center  flex-col min-h-screen bg-slate-700">
        <h1 className="text-white text-3xl">Wordle</h1>
        <h1 className="text-white text-xl">
          Guess the word in 6 tries or less{" "}
          <span className="text-sm">*no uppercase letters</span>
        </h1>
        <div className="mt-3">
          {word ? "" : "Loading..."}
          {open && (
            <div className="fixed opacity-100 inset-0 w-screen z-10 h-screen bg-black bg-opacity-50 outline"></div>
          )}
          {noNumbers && (
            <div className="fixed opacity-100 inset-0 w-screen z-10 h-screen bg-black bg-opacity-50 outline"></div>
          )}
          {noNumbers &&
          <div className="fixed justify-center flex items-center inset-0 z-50 ">
            <div className="bg-white w-[17rem] h-[8rem] rounded">
            <h1 className="font-semibold text-2xl">No Numbers Or Special Characters</h1>
            <div className="flex justify-end mt-[2rem] mr-[1rem]">
            <button className="bg-green-500 px-2 rounded" onClick={() => setNoNumbers(false)}>Close</button>
            </div>
            </div>
          </div>
          }
          <div className="flex gap-2 flex-col">
            <form
              onSubmit={handleSubmit(
                inputs && inputs[focusedInput.row] ? focusedInput.row : 0,
                inputs && inputs[focusedInput.row]
                  ? inputs[focusedInput.row].length - 1
                  : 0
              )}
              className="flex flex-col gap-2"
              onKeyDown={noEnter}
            >
              {inputs.map((inputRow, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  {open &&
                    statuses[rowIndex] &&
                    statuses[rowIndex].every(
                      (status) => status === "correct"
                    ) && (
                      <div className="fixed z-50 inset-0 flex items-center justify-center ">
                        <div className="fixed min-h-full  flex justify-center items-center">
                          <div className="bg-white p-2 rounded flex flex-col">
                            <div className="flex justify-end">
                              <button
                                onClick={() => closeOpen()}
                                className="rounded px-2 bg-green-500 text-white "
                              >
                                Close
                              </button>
                            </div>
                            <div className="flex flex-col">
                              <h1 className="font-semibold text-xl text-center">
                                Statistics
                              </h1>
                              <div className="flex gap-2">
                                <div className="flex flex-col">
                                  <h1>Games Played</h1>
                                  <h1 className="text-center">{count}</h1>
                                </div>
                                <div className="flex flex-col">
                                  <h1>Games Won</h1>
                                  <h1 className="text-center">{gamesWon}</h1>
                                </div>
                                <div className="flex flex-col">
                                  <h1>Games Lost</h1>
                                  <h1 className="text-center">{count - gamesWon}</h1>
                                </div>
                              </div>
                              <h1>Correct Word: {word && word.word}</h1>
                              <div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  {inputRow.map((input, index) => (
                    <input
                      key={index}
                      type="text"
                      className={`w-[5rem] h-[5rem] border-4 text-center text-2xl ${
                        statuses[rowIndex] &&
                        statuses[rowIndex][index] === "correct"
                          ? "bg-green-500"
                          : statuses[rowIndex] &&
                            statuses[rowIndex][index] === "yellow"
                          ? "bg-yellow-500"
                          : statuses[rowIndex] &&
                            statuses[rowIndex][index] == "incorrect"
                          ? "bg-slate-300 text-white"
                          : ""
                      }`}
                      maxLength="1"
                      value={input}
                      onChange={handleInputChange(rowIndex, index)}
                      onKeyUp={handleKeyUp(rowIndex, index)}
                      ref={
                        focusedInput.row === rowIndex &&
                        focusedInput.index === index
                          ? inputRef
                          : null
                      }
                    />
                  ))}
                </div>
              ))}
              <input type="submit" style={{ display: "none" }}  />
            </form>
            <div className="mt-2 mb-4">
              {last && (
                <div>
                  <h1 className="text-white text-xl font-semibold">
                    Correct Word: {word && word.word}
                  </h1>{" "}
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    onClick={newGame}
                  >
                    New Game
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <h1 className="text-white text-2xl">Incorrect Letters</h1>
            <div className="flex gap-2 rounded flex-wrap max-w-[27rem]">
            {incorrect && incorrect.map((key,index) => (
              <div key={index} className="bg-slate-300 p-2 px-4">
              <span className=" text-2xl">{key}</span>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
