import React, { useEffect, useState } from 'react';
import { WebVoiceProcessor } from '@picovoice/web-voice-processor';
import { PorcupineWorker, BuiltInKeyword } from '@picovoice/porcupine-web';
import { modelParams } from '../assets/pico/porcupine_params';
import { keyword_params } from '../assets/pico/hey_nex_wasm';


const PorcupineTest: React.FC = () => {  
  const [isListening, setIsListening] = useState(false);
  const ACCESS_KEY = 'k2/vH1u/xdOwDZZh9aFev+jC55I3GFFFbVIr+F3wIs5rWnqw2NaGaQ==';
  const porcupineKeywords = [{ base64: keyword_params, label: "WORD HAS BEEN DETECTED",}]
  const porcupineModel = { base64: modelParams, customWritePath: 'custom_model', forceWrite: true, version: 1,}

  useEffect(() => {
    const initPorcupine = async () => {
      const keywordCallback = (detection: any) => {
        console.log(`Detected keyword: ${detection.label}`);
      };

      // Initialize Porcupine Worker
      const porcupine = await PorcupineWorker.create(
        ACCESS_KEY,
        // [{ publicPath: "/alexa_wasm.ppn", label: "WORD HAS BEEN DETECTED",}],
        // BuiltInKeyword.Alexa,
        porcupineKeywords,
        keywordCallback,
        // { publicPath: '/porcupine_params.pv' },
        porcupineModel
      );

      // Subscribe to WebVoiceProcessor for audio
      await WebVoiceProcessor.subscribe(porcupine);
      setIsListening(true);

      return () => {
        WebVoiceProcessor.unsubscribe(porcupine);
        porcupine.terminate();
      };
    };

    initPorcupine();

  }, [ACCESS_KEY]);

  return (
    <div>
      <h1>Porcupine Wake Word Detection</h1>
      <p>{isListening ? 'Listening for wake word...' : 'Initializing...'}</p>
    </div>
  );
};

export default PorcupineTest;
