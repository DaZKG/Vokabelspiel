import { useState, useEffect } from "react";

// Eigene Bilder aus dem public/images Ordner
const vocabulary = [
  { word: "das Puppenhaus", image: "/images/puppenhaus.png" },
  { word: "die Puppe", image: "/images/puppe.png" },
  { word: "der Bauklotz", image: "/images/bauklotz.png" },
  { word: "die Knete", image: "/images/knete.png" },
  { word: "der Farbstift", image: "/images/farbstift.png" },
  { word: "der Stall", image: "/images/stall.png" },
  { word: "der Zug", image: "/images/zug.png" },
  { word: "das Buch", image: "/images/buch.png" },
  { word: "das Puzzle", image: "/images/puzzle.png" },
  { word: "das Spiel", image: "/images/spiel.png" },
];

export default function VocabularyGame() {
  const [current, setCurrent] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (current < vocabulary.length) {
      const randomOptions = shuffle([
        vocabulary[current],
        ...getRandomImages(vocabulary[current].word, 3),
      ]);
      setOptions(randomOptions);
      speakWord(vocabulary[current].word);
    }
  }, [current]);

  function handleAnswer(choice) {
    if (choice.word === vocabulary[current].word) {
      setScore(score + 1);
      setFeedback("✅ Richtig!");
    } else {
      setFeedback("❌ Versuch's nochmal!");
    }
    setTimeout(() => {
      if (current + 1 < vocabulary.length) {
        setCurrent(current + 1);
        setFeedback("");
      } else {
        setFinished(true);
      }
    }, 1500);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "16px", textAlign: "center" }}>
        {!finished ? (
          <>
            <button onClick={() => speakWord(vocabulary[current].word)} style={{ marginBottom: "20px", padding: "10px 20px" }}>
              🔊 Wort anhören
            </button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)} style={{ padding: "10px", borderRadius: "12px", border: "1px solid #999" }}>
                  <img src={opt.image} alt={opt.word} style={{ width: "100%", height: "100px", objectFit: "contain" }} />
                </button>
              ))}
            </div>
            <p>{feedback}</p>
            <p>Punkte: {score}</p>
          </>
        ) : (
          <div>
            <h2>Spiel beendet!</h2>
            <p>Dein Ergebnis: {score} / {vocabulary.length}</p>
            <button onClick={() => { setCurrent(0); setScore(0); setFinished(false); }} style={{ padding: "10px 20px" }}>
              Nochmal spielen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Hilfsfunktionen
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getRandomImages(excludeWord, count) {
  const others = vocabulary.filter(v => v.word !== excludeWord);
  return shuffle(others).slice(0, count);
}
function speakWord(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 0.7; // 0.5 = sehr langsam, 1 = normal, 1.5 = schneller
  window.speechSynthesis.speak(utterance);
}
