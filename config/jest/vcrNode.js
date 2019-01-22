const NodeEnvironment = require('jest-environment-node');
const { Polly } = require('@pollyjs/core');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

let polly = null;

async function stopRecording() {
  if (polly) {
    await polly.stop();
    polly = null;
  }
}

function startRecording(recordingName) {
  if (polly) {
    throw new Error('a recording is already running');
  }

  polly = new Polly(recordingName, {
    adapters: ['node-http'],
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: '__recordings__',
      },
    },
    recordIfMissing: true,
  });

  return polly;
}

class VcrNode extends NodeEnvironment {
  async setup() {
    await super.setup();
    this.global.startRecording = startRecording;
    this.global.stopRecording = stopRecording;
  }
}

module.exports = VcrNode;
