//Global
let timers = {};
//let sitBreak = 0;
//let stdBreak = 0;
let chartTimeElapsed = 0;
let chartUpdateInterval;

//---------------------
class Timers {
  constructor(timer1, timer2, div1, div2) {
    this.isAnyTimerStarted = false;
    this.sittingTimer = timer1;
    this.standingTimer = timer2;
    this.sittingDiv = div1;
    this.standingDiv = div2;
  }

  start(type) {
    if (type === "sit") {
      if (this.standingTimer.isStarted) return;
      this.sittingTimer.start();
    }

    if (type === "std") {
      if (this.sittingTimer.isStarted) return;
      this.standingTimer.start();
    }
  }
  pause(type) {
    if (type === "sit") this.sittingTimer.pause();
    if (type === "std") this.standingTimer.pause();
  }
  stop(type) {
    if (type === "sit") this.sittingTimer.stop();
    if (type === "std") this.standingTimer.stop();
  }
}

class Timer {
  constructor(timerDiv) {
    this.timerDiv = timerDiv;
    this.time = 0;
    this.startTime = 0;
    this.isStarted = false;
    this.isPaused = false;
    this.isStopped = true;
    this.timer = {};
    this.secondsElapsed = 0;
    this.minutesElapsed = 0;
    this.hoursElapsed = 0;
    this.breakTime = 0;
    this.isBreakDone = false;
    this.writeTime = this.writeTime.bind(this);
    this.increment = this.increment.bind(this);
  }

  start() {
    if (this.isStarted) return;
    this.startTime = Math.round(Date.now() / 1000);
    this.time = this.startTime;
    this.isStarted = true;
    this.isPaused = false;
    this.isStopped = false;
    this.increment();
    setTimeout(() => { this.isBreakDone = false; }, 2000)
  }

  pause() {
    this.isStarted = false;
    this.isPaused = true;
    console.log("paused");
    clearTimeout(this.timer);

  }

  stop() {
    if (this.isStopped) return;
    this.isStopped = true;
    this.isStarted = false;
    this.isPaused = false;
    this.secondsElapsed = 0;
    this.minutesElapsed = 0;
    this.time = 0;
    clearTimeout(this.timer);
    this.writeTime(this.secondsElapsed, this.minutesElapsed, this.hoursElapsed);
  }

  increment() {
    if (
      !this.isBreakDone &&
      this.secondsElapsed !== 0 &&
      (this.hoursElapsed * 3600 + this.minutesElapsed * 60 + this.secondsElapsed) % this.breakTime === 0
    ) {
      this.pause();
      this.isBreakDone = true;
      return alert("You need to take a break")
    }
    let tempTime = Math.floor(Date.now() / 1000);
    if (tempTime > this.time) {
      this.time = tempTime;
      this.secondsElapsed += 1;
      if (this.secondsElapsed % 60 === 0) {
        this.minutesElapsed += 1;
        this.secondsElapsed = 0;
        if (this.minutesElapsed % 60 === 0) {
          this.hoursElapsed += 1;
          this.minutesElapsed = 0;
        }
      }
      this.writeTime(
        this.secondsElapsed,
        this.minutesElapsed,
        this.hoursElapsed
      );
    }
    this.timer = setTimeout(this.increment, 20);
  }

  writeTime(secs, mins, hours) {
    this.timerDiv.innerText = `${this.formatTime(hours)}:${this.formatTime(
      mins
    )}:${this.formatTime(secs)}`;
  }

  formatTime(int) {
    if (int.toString().split("").length < 2) return `0${int}`;
    else return int;
  }
}

//------------------------------------------------------
function initTimers(divSit, divStd) {
  const timer1 = new Timer(divSit)
  const timer2 = new Timer(divStd)
  timers = new Timers(timer1, timer2, divSit, divStd);
}

//Default init:
initTimers(sittingDiv, standingDiv);


_start_sit.onclick = () => {
  timers.start("sit");
};
_stop_sit.onclick = () => {
  timers.stop("sit");
};
_pause_sit.onclick = () => {
  timers.pause("sit");
};

_start_std.onclick = () => {
  timers.start("std");
};
_stop_std.onclick = () => {
  timers.stop("std");
};
_pause_std.onclick = () => {
  timers.pause("std");
};
//------------------------------------
sitBreakBtn.onclick = () => {
  sitBreak = +sitBreakInput.value * 60;
  timers.sittingTimer.breakTime = sitBreak;
  sitBreakInfo.innerText = sitBreakInput.value;
  sitBreakInput.value = "";
}

stdBreakBtn.onclick = () => {
  stdBreak = +stdBreakInput.value * 60;
  timers.standingTimer.breakTime = stdBreak;
  stdBreakInfo.innerText = stdBreakInput.value;
  stdBreakInput.value = "";
}
//------------------------------------
settingsBtn.onclick = () => {
  settings.style.display = "flex";
  shadow.style.display = "block";
}

closeSettings.onclick = () => {
  settings.style.display = "none";
  shadow.style.display = "none";
}
//----------------------------------------- 
//Chart

const ctx = document.getElementById("myChart");
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Sitting Minutes",
        data: [
          {
            x: chartTimeElapsed,
            y: 0
          }
        ],
        borderColor: "rgb(20,20,20)",
        fill: false
      },
      {
        label: "Standing Minutes",
        data: [{
          x: chartTimeElapsed,
          y: 0
        }],
        borderColor: "rgb(200,200,200)",
        fill: false,
        yAxisID: 'y-axis-1',
      }
    ]
  },
  options: {
    scales: {
      yAxes: [{
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: true,
        position: 'left',
        id: 'y-axis-1',
      }]
    }
  }
});


//----------------------------------------------------
function updateSittingData(chart) {
  chart.data.datasets[0].data.push(
    {
      x: chartTimeElapsed,
      y: timers.sittingTimer.hoursElapsed * 3600 + timers.sittingTimer.minutesElapsed * 60 + timers.sittingTimer.secondsElapsed
    }
  );
  chart.update();
}

function updateStandingData(chart) {
  chart.data.datasets[1].data.push(
    {
      x: chartTimeElapsed,
      y: timers.standingTimer.hoursElapsed * 3600 + timers.standingTimer.minutesElapsed * 60 + timers.standingTimer.secondsElapsed
    })
  chart.update();
}

function updateLabels(chart) {
  chart.data.labels.push(`${new Date().getHours()}:00`);
}


startChart.onclick = () => {

  chartUpdateInterval = setInterval(() => {
    console.log("Recording Chart")
    updateLabels(myChart);
    updateSittingData(myChart);
    updateStandingData(myChart);
    chartTimeElapsed += 5;
  }, 5000)
}

stopChart.onclick = () => {
  clearInterval(chartUpdateInterval);
}    
