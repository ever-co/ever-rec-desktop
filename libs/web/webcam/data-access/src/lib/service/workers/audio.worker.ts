/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  if (data.type === 'PROCESS_AUDIO') {
    processAudio(data.chunks)
      .then((result) => {
        postMessage({ type: 'AUDIO_PROCESSED', result });
      })
      .catch((error) => {
        postMessage({ type: 'AUDIO_ERROR', error });
      });
  }
});

async function processAudio(chunks: BlobPart[]): Promise<ArrayBuffer> {
  try {
    const blob = new Blob(chunks, {
      type: 'audio/webm; codecs=opus',
    });

    return blob.arrayBuffer();
  } catch (error) {
    throw error;
  }
}
