import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Eigene Bilder aus dem public/images Ordner verwenden
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <Card className="p-6 w-full max-w-lg shadow-xl rounded-2xl">
        <CardContent className="space-y-4">
          {!finished ? (
            <>
              <div className="flex justify-center mb-4">
                <Button onClick={() => speakWord(vocabulary[current].word)}>
                  🔊 Wort anhören
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="border rounded-2xl p-2 shadow hover:scale-105 transition"
                  >
                    <img src={opt.image} alt={opt.word} className="w-full h-32 object-contain" />
                  </button>
                ))}
              </div>
              <p className="text-center text-lg">{feedback}</p>
              <p className="text-center">Punkte: {score}</p>
            </>
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Spiel beendet!</h2>
              <p>Dein Ergebnis: {score} / {vocabulary.length}</p>
              <Button onClick={() => { setCurrent(0); setScore(0); setFinished(false); }}>Nochmal spielen</Button>
            </div>
          )}
        </CardContent>
      </Card>
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
  window.speechSynthesis.speak(utterance);
}
