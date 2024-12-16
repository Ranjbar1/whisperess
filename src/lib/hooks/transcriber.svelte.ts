import { derived, get, writable } from "svelte/store";
import Constants from "../utils/Constants";
import { useWorker } from "./worker.svelte";

interface ProgressItem {
  file: string;
  loaded: number;
  progress: number;
  total: number;
  name: string;
  status: string;
}

interface TranscriberUpdateData {
  data: [
    string,
    { chunks: { text: string; timestamp: [number, number | null] }[] }
  ];
  text: string;
}

interface TranscriberCompleteData {
  data: {
    text: string;
    chunks: { text: string; timestamp: [number, number | null] }[];
  };
}

export interface TranscriberData {
  isBusy: boolean;
  text: string;
  chunks: { text: string; timestamp: [number, number | null] }[];
}

export interface Transcriber {
  onInputChange: () => void;
  isBusy: boolean;
  isModelLoading: boolean;
  progressItems: ProgressItem[];
  start: (audioData: AudioBuffer | undefined) => void;
  output?: TranscriberData;
  model: string;
  multilingual: boolean;
  quantized: boolean;
  subtask: string;
  language?: string;
}
export type AudioData =
  | {
      buffer: AudioBuffer;
      url: string;
      source: AudioSource;
      mimeType: string;
    }
  | undefined;
export enum AudioSource {
  URL = "URL",
  FILE = "FILE",
  RECORDING = "RECORDING",
}

export let isBusy = writable(false);

export let isModelLoading = writable(false);

export let progressItems = writable<ProgressItem[]>([]);

export let transcript = writable<TranscriberData | undefined>(undefined);
export let model = writable<string>(Constants.DEFAULT_MODEL);
export let subtask = writable<string>(Constants.DEFAULT_SUBTASK);
export let quantized = writable<boolean>(Constants.DEFAULT_QUANTIZED);
export let multilingual = writable<boolean>(Constants.DEFAULT_MULTILINGUAL);
export let language = writable<string>(Constants.DEFAULT_LANGUAGE);
export const onInputChange = (transcript: TranscriberData | undefined) => {
  transcript = undefined;
};

const webWorker = useWorker((event) => {
  const message = event.data;
  // Update the state with the result
  switch (message.status) {
    case "progress":
      // Model file progress: update one of the progress items.
      progressItems.update((prev) =>
        prev.map((item) => {
          if (item.file === message.file) {
            return { ...item, progress: message.progress };
          }
          return item;
        })
      );
      break;
    case "update":
      // Received partial update
      // console.log("update", message);
      // eslint-disable-next-line no-case-declarations
      const updateMessage = message as TranscriberUpdateData;
      transcript.set({
        isBusy: true,
        text: updateMessage.data[0],
        chunks: updateMessage.data[1].chunks,
      });
      break;
    case "complete":
      // Received complete transcript
      // console.log("complete", message);
      // eslint-disable-next-line no-case-declarations
      const completeMessage = message as TranscriberCompleteData;
      transcript.set({
        isBusy: false,
        text: completeMessage.data.text,
        chunks: completeMessage.data.chunks,
      });
      isBusy.set(false);
      break;

    case "initiate":
      // Model file start load: add a new progress item to the list.
      isModelLoading.set(true);
      progressItems.update((prev) => [...prev, message]);
      break;
    case "ready":
      isModelLoading.set(false);
      break;
    case "error":
      isBusy.set(false);
      alert(
        `${message.data.message} This is most likely because you are using Safari on an M1/M2 Mac. Please try again from Chrome, Firefox, or Edge.\n\nIf this is not the case, please file a bug report.`
      );
      break;
    case "done":
      // Model file loaded: remove the progress item from the list.
      progressItems.update((prev) =>
        prev.filter((item) => item.file !== message.file)
      );
      break;

    default:
      // initiate/download/done
      break;
  }
});
export const postRequest = async (audioData: AudioBuffer | undefined) => {
  if (audioData) {
    transcript.set(undefined);
    isBusy.set(true);

    let audio;
    if (audioData.numberOfChannels === 2) {
      const SCALING_FACTOR = Math.sqrt(2);

      let left = audioData.getChannelData(0);
      let right = audioData.getChannelData(1);

      audio = new Float32Array(left.length);
      for (let i = 0; i < audioData.length; ++i) {
        audio[i] = (SCALING_FACTOR * (left[i] + right[i])) / 2;
      }
    } else {
      // If the audio is not stereo, we can just use the first channel:
      audio = audioData.getChannelData(0);
    }

    webWorker.postMessage({
      audio,
      model: get(model),
      multilingual: get(multilingual),
      quantized: get(quantized),
      subtask: get(multilingual) ? get(subtask) : null,
      language: get(multilingual) ? get(language) : null,
    });
  }
};
