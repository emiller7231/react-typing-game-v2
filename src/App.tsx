import { useEffect, useRef, useState } from "react";
import Sentence from "./Sentence";

const randomInt = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const App = () => {
  const [activeSentence, setActiveSentence] = useState<string>("");
  const [sentences, setSentences] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Used for calculating words per minute
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [words, setWords] = useState(0);
  const [loadedTime, setLoadedTime] = useState<Date>();
  const [currentTime, setCurrentTime] = useState<Date>();

  // Load sentence choices
  useEffect(() => {
    fetch("/react-typing-game-v2/sentences.txt")
      .then((response) => response.text())
      .then((result) => {
        const _sentences = result.split(/\r?\n/);
        setSentences(_sentences);
        setActiveSentence(_sentences[randomInt(0, _sentences.length - 1)]);
        setLoadedTime(new Date());
        setInterval(() => setCurrentTime(new Date()), 100);
        inputRef.current?.focus();
      });
  }, []);

  useEffect(() => {
    if (!loadedTime) return;
    if (activeSentence == input) {
      const timeDifference = currentTime!.getTime() - loadedTime!.getTime();
      const timeDifferenceMinutes = timeDifference / (1000 * 60);
      const _words = words + activeSentence.split(" ").length;
      setWords(_words);
      setWordsPerMinute(Math.floor(_words / timeDifferenceMinutes));
      setActiveSentence(sentences[randomInt(0, sentences.length - 1)]);
      setInput("");
    }
  }, [input]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="w-75">
        {loadedTime ? (
          <Sentence sentence={activeSentence} input={input} />
        ) : (
          <h2 className="text-secondary">Loading...</h2>
        )}
        <label htmlFor="sentenceInput" className="form-label">
          Type the sentence above:
        </label>
        <input
          ref={inputRef}
          className="form-control"
          name="sentenceInput"
          disabled={loadedTime == undefined}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <h3>Words per minute: {wordsPerMinute}</h3>
        <button
          className="btn btn-danger"
          onClick={() => {
            setWords(0);
            setWordsPerMinute(0);
            setActiveSentence(sentences[randomInt(0, sentences.length - 1)]);
            setInput("");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;
