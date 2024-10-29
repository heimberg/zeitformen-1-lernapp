import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trophy, Target } from 'lucide-react';

const alleSätze = [
  {
    text: "Die Katze spielt mit dem Ball.",
    zeitform: "Präsens",
    tipp: "Passiert jetzt gerade"
  },
  {
    text: "Der Hund bellte laut.",
    zeitform: "Präteritum",
    tipp: "Geschah in der Vergangenheit"
  },
  {
    text: "Die Maus hat den Käse gefunden.",
    zeitform: "Perfekt",
    tipp: "Abgeschlossene Handlung mit 'haben'"
  }
  // Weitere Sätze können hier hinzugefügt werden
];

const tierBelohnungen = [
  { name: "Baby Pinguin", punkte: 20, emoji: "🐧" },
  { name: "Kleiner Panda", punkte: 50, emoji: "🐼" },
  { name: "Süßes Kätzchen", punkte: 100, emoji: "🐱" },
  { name: "Niedlicher Hund", punkte: 200, emoji: "🐶" }
];

const PunkteInfoBox = ({ punkte, streak }) => {
  const bonusFaktor = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
  const aktuellerPunkteWert = 10 * bonusFaktor;
  const nächstesTier = tierBelohnungen.find(tier => tier.punkte > punkte);
  const verbleibendePunkte = nächstesTier ? nächstesTier.punkte - punkte : 0;

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-2">
        <span>Aktuelle Punkte pro Aufgabe:</span>
        <span className="font-bold text-blue-600">{aktuellerPunkteWert} 
          {bonusFaktor > 1 && ` (${bonusFaktor}x Bonus)`}
        </span>
      </div>
      {nächstesTier && (
        <div className="flex justify-between items-center text-sm">
          <span>Nächstes Tier:</span>
          <span>
            {nächstesTier.emoji} in {verbleibendePunkte} Punkten
          </span>
        </div>
      )}
    </div>
  );
};

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
          <PunkteInfoBox punkte={punkte} streak={streak} />
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

      {showBelohnung && aktuellesBelohnungsTier && <BelohnungsPopup />}
    </div>
  );
};

export default ZeitformenQuiz;