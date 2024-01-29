import React, { useEffect, useState, useRef } from "react";

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
  // let count2 = 0;
  // console.log(test)
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
            .map(() => new Array(data.target_word.length).fill(""))
        );
        let count = localStorage.getItem("gamesPlayed");
        // If gamesPlayed is not set in localStorage, default to 0
        count = count ? Number(count) : 0;
        // Increment the count
        count += 1;
        console.log(count);
        // Store the incremented count back in localStorage
        localStorage.setItem("gamesPlayed", count);
        // Update the state
        setCount(count);
        let wonCount = localStorage.getItem("gamesWon");
        let lostCount = localStorage.getItem("gamesLost");
        wonCount = wonCount ? Number(wonCount) : 0;
        lostCount = lostCount ? Number(lostCount) : 0;
        // Update the state
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
    setJoinWord(newJoinWords);
  }, [inputs]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusedInput]);
  useEffect(() => {
    console.log(statuses.length)
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
  const handleSubmit = (row, index) => async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const wordToSubmit = inputs[row].join("");
    // console.log(wordToSubmit);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guess: wordToSubmit }),
      });
      const data = await res.json();
      const newStatuses = [...statuses];
      newStatuses[row] = data.statuses;
      setStatuses(newStatuses);
      if (row === inputs.length - 1) {
        setLast(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
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
      let nextIndex = index - 1;
      if (index >= inputs[row].length - 1) {
        nextRow = row - 1;
        nextIndex = 0;
      }
      if (nextRow >= 0) {
        setFocusedInput({ row: nextRow, index: nextIndex });
      }
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
  //console.log(focusedInput)
  //  console.log(open)
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
                              <h1>Correct Word: {word && word.target_word}</h1>
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
                      className={`w-[5rem] h-[5rem] border-4 text-center ${
                        statuses[rowIndex] &&
                        statuses[rowIndex][index] === "correct"
                          ? "bg-green-500"
                          : statuses[rowIndex] &&
                            statuses[rowIndex][index] === "yellow"
                          ? "bg-yellow-500"
                          : statuses[rowIndex] &&
                            statuses[rowIndex][index] == "incorrect"
                          ? "bg-black text-white"
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
              <input type="submit" style={{ display: "none" }} />
            </form>
            <div className="mt-2 mb-4">
              {last && (
                <div>
                  <h1 className="text-white text-xl font-semibold">
                    Correct Word: {word && word.target_word}
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
        </div>
      </div>
    </>
  );
}
