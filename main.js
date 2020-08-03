(async function () {
  function drawDrum() {
    ctx.fillStyle = "#facf6d";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#daaf6d";
    ctx.fillRect(border, border, width - border * 2, height - border * 2);
    ctx.beginPath();
    ctx.moveTo(width / 2, border);
    ctx.lineTo(width - border, height / 2);
    ctx.lineTo(width / 2, height - border);
    ctx.lineTo(border, height / 2);
    ctx.closePath();
    ctx.fillStyle = "#B89C5D";
    ctx.fill();
    ctx.beginPath();
  }
  function play(buffer) {
    const source = acx.createBufferSource();
    source.buffer = buffer;
    source.connect(acx.destination);
    source.start(0);
  }
  const canvas = document.createElement("canvas");
  canvas.style.display = "block";
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  const border = 50;
  drawDrum();
  const acx = new AudioContext();
  const [B, S, X] = await Promise.all(
    ["kick", "snare", "x"]
      .map((name) => `${name}.wav`)
      .map((name) => fetch(`media/${name}`))
      .map((req) => req.then((res) => res.arrayBuffer()))
      .map((res) => res.then((buffer) => acx.decodeAudioData(buffer)))
  );
  canvas.addEventListener(
    "touchstart",
    (e) => {
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;
      if (
        x < border ||
        y < border ||
        x > width - border ||
        y > height - border
      ) {
        play(X);
      } else if (
        Math.abs(width / 2 - x) / (width / 2 - border) +
          Math.abs(height / 2 - y) / (height / 2 - border) <
        1
      ) {
        play(B);
      } else {
        play(S);
      }
      ctx.fill();
    },
    false
  );
})();
