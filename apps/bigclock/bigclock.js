function drawTime() {
  if (!Bangle.isLCDOn()) return;
  var d = new Date();
  var da = d.toString().split(" ");
  var time = da[4].substr(0, 5).split(":");
  var dow = da[0],
    month = da[1],
    day = da[2],
    year = da[3],
    hours = time[0],
    minutes = time[1];
  g.clearRect(0, 24, 239, 239);
  g.setColor(1, 1, 1);
  g.setFont("Vector", 100);
  g.drawString(hours, 50, 24, true);
  g.drawString(minutes, 50, 135, true);
  g.setFont("Vector", 20);
  g.setRotation(3);
  g.drawString(`${dow} ${day} ${month}`, 50, 20, true);
  g.drawString(year, 85, 205, true);
  g.setRotation(0);
}

Bangle.on("lcdPower", function(on) {
  if (on) {
    g.clear();
    Bangle.drawWidgets();
    drawTime();
  }
});

Bangle.setLCDBrightness(1);
g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
drawTime();
intervalRefMin = setInterval(drawTime, 60 * 1000);
// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, { repeat: false, edge: "falling" });
