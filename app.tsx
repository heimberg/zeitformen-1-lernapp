import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trophy } from 'lucide-react';

// Alle Sätze und Tier-Belohnungen in einer einzigen App
const alleSätze = [
  // Präsens
  {
    text: "Mein Hamster frisst gerne Körner.",
    zeitform: "Präsens",
    tipp: "Beschreibt eine regelmäßige Handlung"
  },
  {
    text: "Die Vögel zwitschern im Garten.",
    zeitform: "Präsens",
    tipp: "Etwas passiert genau jetzt"
  },
  {
    text: "Der Pinguin watschelt lustig durch den Zoo.",
    zeitform: "Präsens",
    tipp: "Eine aktuelle Handlung"
  },
  {
    text: "Das Eichhörnchen sammelt Nüsse für den Winter.",
    zeitform: "Präsens",
    tipp: "Ein aktueller Vorgang"
  },
  {
    text: "Der Elefant spritzt sich Wasser auf den Rücken.",
    zeitform: "Präsens",
    tipp: "Passiert in diesem Moment"
  },
  // Präteritum
  {
    text: "Der kleine Igel suchte nach Futter.",
    zeitform: "Präteritum",
    tipp: "Eine Geschichte aus der Vergangenheit"
  },
  {
    text: "Die Katze jagte einem Schmetterling hinterher.",
    zeitform: "Präteritum",
    tipp: "Beschreibt was früher geschah"
  },
  {
    text: "Der Hund buddelte ein tiefes Loch.",
    zeitform: "Präteritum",
    tipp: "Eine vergangene Handlung"
  },
  {
    text: "Das Pferd galoppierte über die Wiese.",
    zeitform: "Präteritum",
    tipp: "Etwas das früher passierte"
  },
  {
    text: "Die Maus versteckte sich vor der Katze.",
    zeitform: "Präteritum",
    tipp: "Teil einer Erzählung"
  },
  // Perfekt
  {
    text: "Der Koala hat den ganzen Tag geschlafen.",
    zeitform: "Perfekt",
    tipp: "Eine abgeschlossene Handlung (haben + Partizip II)"
  },
  {
    text: "Die Schnecke ist über das Blatt gekrochen.",
    zeitform: "Perfekt",
    tipp: "Bewegung wird mit 'sein' gebildet"
  },
  {
    text: "Der Frosch ist in den Teich gesprungen.",
    zeitform: "Perfekt",
    tipp: "Sprünge werden mit 'sein' gebildet"
  },
  {
    text: "Die Spinne hat ein Netz gewebt.",
    zeitform: "Perfekt",
    tipp: "Eine fertige Handlung mit 'haben'"
  },
  {
    text: "Der Storch ist nach Afrika geflogen.",
    zeitform: "Perfekt",
    tipp: "Flugbewegung mit 'sein'"
  }
];

const tierBelohnungen = [
  { name: "Baby Pinguin", punkte: 20, emoji: "🐧" },
  { name: "Kleiner Panda", punkte: 50, emoji: "🐼" },
  { name: "Süßes Kätzchen", punkte: 100, emoji: "🐱" },
  { name: "Niedlicher Hund", punkte: 150, emoji: "🐶" },
  { name: "Bunter Papagei", punkte: 200, emoji: "🦜" },
  { name: "Kleines Einhorn", punkte: 250, emoji: "🦄" },
  { name: "Baby Elefant", punkte: 300, emoji: "🐘" },
  { name: "Delfin", punkte: 350, emoji: "🐬" },
  { name: "Kleiner Löwe", punkte: 400, emoji: "🦁" },
  { name: "Magischer Drache", punkte: 500, emoji: "🐲" }
];

const ZeitformenQuiz = () => {
  const [verfügbareSätze, setVerfügbareSätze] = useState([]);
  const [aktuellerSatz, setAktuellerSatz] = useState(0);
  const [punkte, setPunkte] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [zeigeHilfe, setZeigeHilfe] = useState(false);
  const [gesammeleTiere, setGesammeleTiere] = useState([]);
  const [showBelohnung, setShowBelohnung] = useState(false);
  const [aktuellesBelohnungsTier, setAktuellesBelohnungsTier] = useState(null);

  useEffect(() => {
    neueSätzeMischen();
  }, []);

  useEffect(() => {
    const nächstesBelohnungsTier = tierBelohnungen.find(tier => 
      tier.punkte <= punkte && !gesammeleTiere.includes(tier.name)
    );

    if (nächstesBelohnungsTier) {
      setAktuellesBelohnungsTier(nächstesBelohnungsTier);
      setShowBelohnung(true);
      setGesammeleTiere(prev => [...prev, nächstesBelohnungsTier.name]);
    }
  }, [punkte, gesammeleTiere]);

  const neueSätzeMischen = () => {
    const gemischteSätze = [...alleSätze]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setVerfügbareSätze(gemischteSätze);
    setAktuellerSatz(0);
  };

  const prüfeAntwort = (antwort) => {
    const korrekt = antwort === verfügbareSätze[aktuellerSatz].zeitform;
    
    if (korrekt) {
      const neueStreak = streak + 1;
      const bonus = neueStreak >= 5 ? 3 : neueStreak >= 3 ? 2 : 1;
      setPunkte(p => p + (10 * bonus));
      setStreak(neueStreak);
      
      setFeedback({
        typ: 'erfolg',
        nachricht: neueStreak >= 3 ? 
          `${neueStreak}er-Streak! (${bonus}x Bonus) 🔥` : 
          'Richtig! 🌟'
      });
    } else {
      setStreak(0);
      setFeedback({
        typ: 'fehler',
        nachricht: 'Nicht ganz richtig. Probier es noch mal! 💪'
      });
    }

    setTimeout(() => {
      if (korrekt) {
        if (aktuellerSatz >= verfügbareSätze.length - 1) {
          neueSätzeMischen();
        } else {
          setAktuellerSatz(a => a + 1);
        }
        setFeedback(null);
        setZeigeHilfe(false);
      }
    }, 1500);
  };

  const NächstesBelohnungsTier = () => {
    const nächstesTier = tierBelohnungen.find(tier => 
      tier.punkte > punkte && !gesammeleTiere.includes(tier.name)
    );
    
    if (!nächstesTier) return null;

    return (
      <div className="mt-2 text-sm text-gray-600">
        Nächstes Tier: {nächstesTier.emoji} bei {nächstesTier.punkte} Punkten
      </div>
    );
  };

  const BelohnungsPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
        <div className="text-6xl mb-4 animate-bounce">
          {aktuellesBelohnungsTier?.emoji}
        </div>
        <h3 className="text-2xl font-bold mb-4">
          Neues Tier freigeschaltet!
        </h3>
        <p className="text-lg mb-6">
          Du hast einen {aktuellesBelohnungsTier?.name} gewonnen!
        </p>
        <Button 
          onClick={() => setShowBelohnung(false)}
          className="w-full"
        >
          Super! Weiter geht's!
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="mb-4">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Zeitformen-Quiz</h2>
              <div className="flex items-center gap-2">
                <Trophy size={24} className="text-yellow-500" />
                <span className="text-xl">{punkte}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {streak >= 3 && (
                <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
                  <Star size={16} className="text-orange-500" />
                  <span className="font-bold">{streak}</span>
                </div>
              )}
            </div>
          </div>
          <NächstesBelohnungsTier />
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">
              Satz {aktuellerSatz + 1} von {verfügbareSätze.length}
            </div>
            <div className="text-xl font-medium p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm">
              {verfügbareSätze[aktuellerSatz]?.text}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {['Präsens', 'Präteritum', 'Perfekt'].map((zeitform) => (
              <Button 
                key={zeitform}
                variant="outline"
                className="p-4 text-lg hover:bg-blue-50 transition-colors"
                onClick={() => prüfeAntwort(zeitform)}
              >
                {zeitform}
              </Button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button 
              variant="ghost"
              onClick={() => setZeigeHilfe(!zeigeHilfe)}
              className="text-blue-600"
            >
              {zeigeHilfe ? 'Tipp ausblenden' : 'Tipp anzeigen'}
            </Button>
          </div>

          {zeigeHilfe && (
            <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-100">
              💡 {verfügbareSätze[aktuellerSatz]?.tipp}
            </div>
          )}

          {feedback && (
            <div className={`p-4 rounded-lg text-center ${
              feedback.typ === 'erfolg' ? 'bg-green-100 text-green-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {feedback.nachricht}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier-Sammlung Übersicht */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <h3 className="font-bold mb-3">Deine Tier-Sammlung:</h3>
          <div className="flex flex-wrap gap-2">
            {gesammeleTiere.map((tierName) => {
              const tier = tierBelohnungen.find(t => t.name === tierName);
              return (
                <div key={tierName} className="text-2xl" title={tierName}>
                  {tier?.emoji}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Belohnungs-Popup */}
      {showBelohnung && aktuellesBelohnungsTier && <BelohnungsPopup />}
    </div>
  );
};

export default ZeitformenQuiz;