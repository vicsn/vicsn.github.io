/* Speech synthesis in a background thread, so the animation never stutters while a sentence is made.
   Uses Piper (neural voices, run in the browser with ONNX): https://github.com/Mintplex-Labs/piper-tts-web
   (a copy of the library lives in vendor/piper/; its ONNX runtime comes from a pinned CDN URL)
   The voice model (about 60 MB) is downloaded once and then kept by the browser.
   onnxruntime-web is pinned to one version for both the code and its .wasm files, so they always match. */

import * as tts from './vendor/piper/piper-tts-web.js';

var WASM = {
  onnxWasm: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/',
  piperData: 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.data',
  piperWasm: 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.wasm'
};
var session = null;

// the library reports some failures from inside a promise nobody awaits; without this the request would hang forever
self.addEventListener('unhandledrejection', function (ev) {
  var r = ev.reason;
  self.postMessage({ id: -1, type: 'error', message: 'unhandled: ' + String((r && r.message) || r) });
});

self.onmessage = async function (ev) {
  var m = ev.data;
  try {
    if (!session) {
      session = tts.TtsSession.create({
        voiceId: m.voiceId,
        wasmPaths: WASM,
        logger: function (t) { self.postMessage({ id: 0, type: 'log', text: String(t) }); },
        progress: function (p) { self.postMessage({ id: 0, type: 'progress', loaded: p.loaded, total: p.total }); }
      });
    }
    var s = await session;
    if (m.type === 'load') {
      self.postMessage({ id: m.id, type: 'loaded' });
    } else {
      var wav = await s.predict(m.text);
      var buf = await wav.arrayBuffer();
      self.postMessage({ id: m.id, type: 'wav', buf: buf }, [buf]);
    }
  } catch (e) {
    session = null;                                   // let the next request try again from scratch
    self.postMessage({ id: m.id, type: 'error', message: String((e && e.message) || e) });
  }
};
