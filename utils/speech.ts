import * as Speech from 'expo-speech';

/**
 * Wraps expo-speech for the listening section. Real DTZ rule: "Sie hören
 * jeden Text einmal" — you hear each text once. We enforce that at the call
 * site (quiz.tsx tracks which question IDs have been played), not here —
 * this module just knows how to speak German text.
 */
export function speakGerman(text: string, onDone?: () => void) {
  Speech.stop(); // cut off any previous utterance before starting a new one
  Speech.speak(text, {
    language: 'de-DE',
    rate: 0.92, // slightly slower than default — closer to how the real
                // exam audio is paced for language learners
    onDone,
  });
}

export function stopSpeech() {
  Speech.stop();
}