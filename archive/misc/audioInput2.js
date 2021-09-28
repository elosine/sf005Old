<audio id="player" controls></audio>
<script>
  const player = document.getElementById('player');

  const handleSuccess = function(stream) {
    if (window.URL) {
      player.srcObject = stream;
    } else {
      player.src = stream;
    }
  };

  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
</script>


navigator.mediaDevices.enumerateDevices().then((devices) => {
  devices = devices.filter((d) => d.kind === 'audioinput');
});

navigator.mediaDevices.getUserMedia({
  audio: {
    deviceId: devices[0].deviceId
  }
});


<script>
  const handleSuccess = function(stream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function(e) {
      // Do something with the data, e.g. convert it to WAV
      console.log(e.inputBuffer);
    };
  };

  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
</script>
