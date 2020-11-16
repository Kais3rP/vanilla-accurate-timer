//Global
let timers = {};
let sitBreak = 0;
let stdBreak = 0;

//---------------------
class Timers {
    constructor(div1, div2) {
      this.isAnyTimerStarted = false;
      this.sittingTimer = new Timer(div1);
      this.standingTimer = new Timer(div2);
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
      this.writeTime = this.writeTime.bind(this);
      this.increment = this.increment.bind(this);
    }
  
    start() {
        console.log(this.breakTime)
      if (this.isStarted) return;
      this.startTime = Math.round(Date.now() / 1000);
      this.time = this.startTime;
      this.isStarted = true;
      this.isPaused = false;
      this.isStopped = false;
      this.increment();
      this.isAnyTimerStarted = true;
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
      console.log("cleared");
      clearTimeout(this.timer);
      this.writeTime(this.secondsElapsed, this.minutesElapsed, this.hoursElapsed);
    }
  
    increment() {
      if (this.secondsElapsed !== 0 && this.hoursElapsed * 3600 + this.minutesElapsed * 60 + this.secondsElapsed % this.breakTime === 0)
        {
          this.pause();
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
  
function initTimers(divSit, divStd){
    timers = new Timers(divSit, divStd);
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
     sitBreak = sitBreakInput.value; 
     timers.sittingTimer.breakTime = sitBreak;
  }

  stdBreakBtn.onclick = () => {
    stdBreak = stdBreakInput.value;  
    timers.standingTimer.breakTime = stdBreak;
 }
  //------------------------------------
  settingsBtn.onclick = () => {
settings.style.display= "flex";
shadow.style.display = "block";
  }

  closeSettings.onclick = () => {
settings.style.display = "none";
shadow.style.display = "none";
  }
  
  //Chart
  
  const ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "Standing Minutes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: "rgba(255, 99, 132, 0.2)"
        },
        {
          label: "Sitting Minutes",
          data: [23, 56, 4, 1, 3, 10],
          backgroundColor: "rgba(10, 99, 132, 0.2)"
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
  