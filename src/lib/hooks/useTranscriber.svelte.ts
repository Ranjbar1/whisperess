import { useWorker } from "./useWorker.svelte";
import Constants from "../utils/Constants";

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

export function useTranscriber(): Transcriber {
  let transcript: TranscriberData | undefined = $state(undefined);
  let isBusy = $state(false);
  let isModelLoading = $state(false);

  let progressItems: ProgressItem[] = $state([]);

  const webWorker = useWorker((event) => {
    const message = event.data;
    // Update the state with the result
    switch (message.status) {
      case "progress":
        // Model file progress: update one of the progress items.
        progressItems = progressItems.map((item) => {
          if (item.file === message.file) {
            return { ...item, progress: message.progress };
          }
          return item;
        });
        break;
      case "update":
        // Received partial update
        console.log("update", message);
        // eslint-disable-next-line no-case-declarations
        const updateMessage = message as TranscriberUpdateData;
        transcript = {
          isBusy: true,
          text: updateMessage.data[0],
          chunks: updateMessage.data[1].chunks,
        };
        break;
      case "complete":
        // Received complete transcript
        // console.log("complete", message);
        // eslint-disable-next-line no-case-declarations
        const completeMessage = message as TranscriberCompleteData;
        transcript = {
          isBusy: false,
          text: completeMessage.data.text,
          chunks: completeMessage.data.chunks,
        };
        isBusy = false;
        break;

      case "initiate":
        // Model file start load: add a new progress item to the list.
        isModelLoading = true;
        progressItems.push(message);
        break;
      case "ready":
        isModelLoading = false;
        break;
      case "error":
        isBusy = false;
        alert(
          `${message.data.message} This is most likely because you are using Safari on an M1/M2 Mac. Please try again from Chrome, Firefox, or Edge.\n\nIf this is not the case, please file a bug report.`
        );
        break;
      case "done":
        // Model file loaded: remove the progress item from the list.
        progressItems.filter((item) => item.file !== message.file);
        break;

      default:
        // initiate/download/done
        break;
    }
  });

  let model: string = $state(Constants.DEFAULT_MODEL);
  let subtask: string = $state(Constants.DEFAULT_SUBTASK);
  let quantized: boolean = $state(Constants.DEFAULT_QUANTIZED);
  let multilingual: boolean = $state(Constants.DEFAULT_MULTILINGUAL);
  let language: string = $state(Constants.DEFAULT_LANGUAGE);

  let onInputChange = () => {
    transcript = undefined;
  };

  const postRequest = async (audioData: AudioBuffer | undefined) => {
    if (audioData) {
      transcript = undefined;
      isBusy = true;

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
        model,
        multilingual,
        quantized,
        subtask: multilingual ? subtask : null,
        language: multilingual && language !== "auto" ? language : null,
      });
    }
  };

  const transcriber = {
    onInputChange,
    isBusy,
    isModelLoading,
    progressItems,
    start: postRequest,
    output: transcript,
    model,
    multilingual,
    quantized,
    subtask,
    language,
  };

  return transcriber;
}
