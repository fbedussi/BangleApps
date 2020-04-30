let counter = 0;
let setValue = 0;
let counterInterval;
let buzzInterval;
const DEBUG = true;

const DEBOUNCE = 50;

function buzzAndBeep() {
  Bangle.buzz(1e3, 1).then(() => {
    Bangle.beep(200, 4000);
  });
}

function outOfTime() {
  g.clearRect(0, 0, 220, 70);
  g.setFontAlign(0, 0);
  g.setFont("6x8", 3);
  g.drawString("Time's UP!", 120, 50);
  buzzAndBeep();
  buzzInterval = setInterval(buzzAndBeep, 5000);
}

function draw() {
  const minutes = Math.floor(counter / 60);
  const seconds = counter - minutes * 60;
  const seconds2Digits = seconds < 10 ? `0${seconds}` : seconds.toString();
  g.clearRect(0, 70, 220, 160);
  g.setFontAlign(0, 0);
  g.setFont("6x8", 7);
  g.drawString(
    `${minutes < 10 ? "0" : ""}${minutes}:${seconds2Digits}`,
    120,
    120
  );
}

function countDown() {
  if (DEBUG) console.log("countDown");
  if (counter <= 0) {
    if (counterInterval) {
      clearInterval(counterInterval);
      counterInterval = undefined;
    }
    outOfTime();
    return;
  }

  counter--;
  if (DEBUG) console.log("counter", counter);
  draw();
}

function clearIntervals() {
  if (counterInterval) {
    clearInterval(counterInterval);
    counterInterval = undefined;
  }
  if (buzzInterval) {
    clearInterval(buzzInterval);
    buzzInterval = undefined;
  }
}

function set(delta) {
  if (state === "started") return;
  if (DEBUG) console.log("increase");
  counter += delta;
  if (state === "unset") {
    state = "set";
  }
  draw();
  g.flip();
}

function startTimer() {
  setValue = counter;
  countDown();
  counterInterval = setInterval(countDown, 1000);
}

let state = "unset"; // -> set -> started -> set
const stateMap = {
  unset: () => {},
  set: () => {
    state = "started";
    startTimer();
  },
  started: () => {
    state = "set";
    reset(setValue);
  }
};

function changeState() {
  if (DEBUG) console.log("changeState", state);
  stateMap[state]();
}

function reset(value) {
  if (DEBUG) console.log("reset");
  counter = value;
  draw();
  clearIntervals();
}

reset(0);

clearWatch();
setWatch(changeState, BTN1, { debounce: 1000, repeat: true, edge: "falling" });
setWatch(() => reset(0), BTN3, {
  debounce: DEBOUNCE,
  repeat: true,
  edge: "falling"
});
setWatch(() => set(60), BTN4, {
  debounce: DEBOUNCE,
  repeat: true
});
setWatch(() => set(1), BTN5, {
  debounce: DEBOUNCE,
  repeat: true
});

g.clear();
g.setFontAlign(-1, 0);
g.setFont("6x8", 7);
g.drawString(`+  +`, 35, 180);
g.setFontAlign(0, 0, 3);
g.setFont("6x8", 1);
g.drawString(`reset                   (re)start`, 230, 120);
draw();
