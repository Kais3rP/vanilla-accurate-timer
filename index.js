class Timer {
    constructor() {
      this.timerDiv = document.getElementById("timer");
      this.time = 0;
      this.startTime = 0;
      this.isStarted = false;
      this.isPaused = false;
      this.isStopped = true;
      this.timer = {};
      this.secondsElapsed = 0;
      this.minutesElapsed = 0;
      this.hoursElapsed = 0;
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
    }
  
    pause() {
      this.isStarted = false;
      this.isPaused = true;
      this.isStopped = false;
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
  
        this.writeTime(this.secondsElapsed, this.minutesElapsed, this.hoursElapsed);
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
  
  const timer = new Timer();
  
  _start.onclick = timer.start.bind(timer);
  _stop.onclick = timer.stop.bind(timer);
  _pause.onclick = timer.pause.bind(timer);
  
  _start.onmouseover = () => {
    start_tooltip.style.display = "flex";
  };
  
  _start.onmouseout = () => {
    start_tooltip.style.display = "none";
  };
  
  _stop.onmouseover = () => {
    stop_tooltip.style.display = "flex";
  };
  
  _stop.onmouseout = () => {
    stop_tooltip.style.display = "none";
  };
  
  _pause.onmouseover = () => {
    pause_tooltip.style.display = "flex";
  };
  
  _pause.onmouseout = () => {
    pause_tooltip.style.display = "none";
  };
  
  
  //Chart
  
  const ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
              label: '# of secs',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
             
          },
                    {
              label: '# of mins',
              data: [23, 56, 4, 1, 3, 10],
              backgroundColor: 'rgba(10, 99, 132, 0.2)',
             
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });