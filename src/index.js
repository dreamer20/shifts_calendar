import './style.sass'

(function() {

var nameOfMonths = ['Январь',
              'Февраль',
              'Март',
              'Апрель',
              'Май',
              'Июнь',
              'Июль',
              'Августь',
              'Сентябрь',
              'Октябрь',
              'Ноябрь',
              'Декабрь'];

var date = new Date(),
    calendarMonths = document.getElementById('calendar-months'),
    dateCaption = document.getElementById('date-caption'),
    controlDaysOfMonth = document.getElementById('control-daysOfMonth'),
    calculateBtn = document.getElementById('calculate-btn'),
    controlDaysOff = document.getElementById('control-daysOff'),
    controlWorkDays = document.getElementById('control-workDays'),
    nextBtn = document.getElementById('nextBtn'),
    prevBtn = document.getElementById('prevBtn'),
    shiftCalculated = Object.create(null),
    currentMonthInList = 1,
    isInvalidData,
    workDays = 0,
    daysOff = 0,
    oldWidth = getComputedStyle(calendarMonths).width,
    daysLeft,
    resizeTimeout;


nextBtn.addEventListener('click', nextMonth);
prevBtn.addEventListener('click', prevMonth);
calculateBtn.addEventListener('click', calculateShifts);

calendarMonths.addEventListener('transitionend', function() {
  nextBtn.addEventListener('click', nextMonth);
  prevBtn.addEventListener('click', prevMonth);
  window.addEventListener("resize", resizeThrottler, false);
});

init();

function calculateShifts() {
  isInvalidData = checkValididty();

  if (isInvalidData) return;
  clearCalendar();

  var startWith = controlDaysOfMonth.selectedIndex + 1;
  daysOff = +controlDaysOff.value;
  workDays = +controlWorkDays.value;
  daysLeft = setShift(daysOff, workDays, startWith);
}

function checkValididty() {
  var 
      daysOff,
      workDays,
      isInvalid;

  daysOff = +controlDaysOff.value;
  workDays = +controlWorkDays.value;
  if (isNaN(daysOff) || typeof daysOff !== "number" || daysOff <= 0 || daysOff > 100) {
    controlDaysOff.className = "control-input control-invalid";
    isInvalid = true;
  } else if (controlDaysOff.className === "control-input control-invalid") {
      controlDaysOff.className = "control-input";
      isInvalid = false;
  }
  if (isNaN(workDays) || typeof workDays !== "number" || workDays <= 0 || workDays > 100) {
    controlWorkDays.className = "control-input control-invalid";
    isInvalid = true;
  } else if (controlWorkDays.className === "control-input control-invalid") {
    controlWorkDays.className = "control-input";
    isInvalid = false;
  }
  return isInvalid;
}

function clearCalendar() {
  var table,
      month,
      week,
      dayOfWeek,
      i;

  for (month in shiftCalculated) {
    shiftCalculated[month] = false;
  }

  for (month = 0; month < calendarMonths.children.length; month++) {
    table = calendarMonths.children[month].getElementsByTagName('table')[0];
    for (week = 0; week < 6; week++) {
      for (dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        table.tBodies[0].rows[week].cells[dayOfWeek].style.background = "#fff";
      }
    }
  }
}

function createMonth() {
  var
    dayOfWeek,
    week,
    tr,
    td,
    currentMonth,
    dayOfWeekInMonth,
    tbody,
    div,
    table,
    calendarMonths,
    dateCaption;

  tbody = document.createElement('tbody');
  div = document.createElement('div');
  table = document.createElement('table');
  
  currentMonth = date.getMonth();

  table.setAttribute('cellspacing', '0');
  div.className = 'month';
  
  date.setDate(1);
  dayOfWeekInMonth = date.getDay() === 0 ? 6 : date.getDay() - 1;

  if (dayOfWeekInMonth === 0) {
    date.setDate(-6);
  } else {
    date.setDate(-dayOfWeekInMonth + 1);
  }

  for (week = 0; week < 6; week++) {
    tr = document.createElement('tr');

    for (dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      td = document.createElement('td');

      if (date.getMonth() != currentMonth) {
        td.style.color = "grey";
      } else {
        td.style.fontWeight = "700";
        td.style.color = '#45889e ';
        td.setAttribute('data-day', date.getDate());
      }

      td.textContent = date.getDate();
      date.setDate(date.getDate() + 1);

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  div.appendChild(table);

  date.setDate(0);
  date.setMonth(currentMonth, 1);

  return div;
}


function init() {
  var month = createMonth();
  dateCaption.textContent = date.getFullYear() +' : '+ nameOfMonths[date.getMonth()];
  calendarMonths.appendChild(month);
  fillSelector();
}


function fillSelector() {
  var
      days,
      i,
      option;

  date.setMonth(date.getMonth()+1, 0);
  days = date.getDate();
  controlDaysOfMonth.innerHTML = '';
  for (i = 1; i <= days; i++) {
    option = document.createElement('option');
    option.text = i;
    option.value = i;
    controlDaysOfMonth.add(option);
  }
  date.setDate(1);
}

function setShift( daysOff, workDays,startWith, daysLeft) {
  var
      table,
      tbody,
      week,
      dayOfWeek,
      day,
      td,
      dayOff,
      workDay,
      months,
      month;

  startWith = startWith || 1;
  dayOff = daysLeft ? daysLeft['daysOff'] : daysOff,
  workDay = daysLeft ? daysLeft['workDays'] : workDays,
  months = document.getElementById('calendar-months');
  month = months.children[currentMonthInList-1];
  table = month.firstChild;
  tbody = table.tBodies[0];

  for (week = 0; week < 6; week++) {
    for (dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      td = tbody.rows[week].cells[dayOfWeek];
      day = td.getAttribute('data-day');
      td.style.background = '';
      if (day != null && day >= startWith) {
        if (dayOff-- > 0) {
          td.style.background = '#efe976';
        } else if (--workDay === 0) {
          dayOff = daysOff;
          workDay = workDays;
        }
      }
    }
  }
  shiftCalculated[currentMonthInList] = true;
  return {daysOff: dayOff, workDays: workDay};
}

function nextMonth() {
  var
      style,
      left,
      month;

  nextBtn.removeEventListener('click', nextMonth);
  date.setMonth(date.getMonth() + 1);

  if (currentMonthInList < calendarMonths.children.length) {
    currentMonthInList++

    if  (!shiftCalculated[currentMonthInList]) {
        if (daysLeft) {
          daysLeft = setShift(daysOff, workDays, null, daysLeft);
        }
    }

    style = getComputedStyle(calendarMonths);
    left = parseFloat(style.left) - parseFloat(style.width)
    calendarMonths.style.left = left + 'px';
  } else {
    month = createMonth();
    calendarMonths.appendChild(month);  
    currentMonthInList = calendarMonths.children.length
    style = getComputedStyle(calendarMonths);
    left = parseFloat(style.left) - parseFloat(style.width);
    calendarMonths.style.left = left + 'px';

    if (daysLeft) {
      daysLeft = setShift(daysOff, workDays, null, daysLeft);
    }
  }

  dateCaption.textContent = date.getFullYear() +' : '+ nameOfMonths[date.getMonth()];
  fillSelector();
}

function prevMonth() {
  var
      month,
      style,
      left;

  prevBtn.removeEventListener('click', prevMonth);

  currentMonthInList--;
  date.setMonth(date.getMonth() - 1);

  if (currentMonthInList <= 0) {
    currentMonthInList = 1
    month = createMonth();
    style = getComputedStyle(calendarMonths);

    calendarMonths.className = 'calendar-months';
    left = parseInt(style.left) - parseInt(style.width);
    calendarMonths.style.left = left + 'px';
    calendarMonths.insertAdjacentHTML('afterBegin', month.outerHTML);

    setTimeout(function() {
      calendarMonths.className = 'calendar-months slide-animation';
      calendarMonths.style.left = '0px';
    },40)
    
  } else {
    style = getComputedStyle(calendarMonths);
    left = parseInt(style.left) + parseInt(style.width)
    calendarMonths.style.left = left + 'px';
  }

  dateCaption.textContent = date.getFullYear() +' : '+ nameOfMonths[date.getMonth()];
  fillSelector()
}

function createCalendar(date) {
  var
      dayOfWeek,
      week,
      tr,
      td,
      currentMonth,
      dayOfWeekInMonth,
      tbody,
      div,
      table,
      calendarMonths,
      dateCaption;

  calendarMonths = document.getElementById('calendar-months');
  div = document.createElement('div');
  tbody = document.createElement('tbody');
  table = document.createElement('table');
  dateCaption = document.getElementById('date-caption');

  if(calendarMonths.children.length !== currentMonthInList && currentMonthInList >= 0) {
    return currentMonthInList;
  }

  dateCaption.textContent = date.getFullYear() +' : '+ nameOfMonths[date.getMonth()];
  currentMonth = date.getMonth();

  table.setAttribute('cellspacing', '0');
  div.className = 'month';
  
  date.setDate(1);
  dayOfWeekInMonth = date.getDay() === 0 ? 6 : date.getDay() - 1;

  if (dayOfWeekInMonth === 0) {
    date.setDate(-6);
  } else {
    date.setDate(-dayOfWeekInMonth + 1);
  }

  for (week = 0; week < 6; week++) {
    tr = document.createElement('tr');

    for (dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      td = document.createElement('td');

      if (date.getMonth() != currentMonth) {
        td.style.color = "grey";
      } else {
        td.style.fontWeight = "700";
        td.style.color = '#45889e ';
        td.setAttribute('data-day', date.getDate());
      }

      td.textContent = date.getDate();
      date.setDate(date.getDate() + 1);

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
    table.appendChild(tbody);
    div.appendChild(table);

  if (currentMonthInList < 0) {
    calendarMonths.insertAdjacentHTML('afterBegin', div.outerHTML);
  } else {
    calendarMonths.appendChild(div);
  }

  date.setDate(0);
  date.setMonth(currentMonth, 1);

  return date;
}

function resizeThrottler() {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if ( !resizeTimeout ) {
    resizeTimeout = setTimeout(function() {
      resizeTimeout = null;
      actualResizeHandler();
   
     // The actualResizeHandler will execute at a rate of 15fps
     }, 66);
  }
}

function actualResizeHandler() {
  var rest,
      newleft,
      newWidth,
      oldleft;

  newWidth = getComputedStyle(calendarMonths).width;
  oldWidth = parseFloat(oldWidth);
  newWidth = parseFloat(newWidth);
  oldleft = parseFloat(calendarMonths.style.left);
  rest = oldWidth - newWidth;
  rest = Math.round(rest * 1000) / 1000;

  if (currentMonthInList-1 > 0) {
    rest = (rest * (currentMonthInList-1));
  }

  newleft = oldleft + rest;
  newleft = (Math.round(newleft * 1000) / 1000);
  oldWidth = newWidth;
  calendarMonths.style.left = newleft + 'px';
}

})();

