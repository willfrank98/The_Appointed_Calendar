// If we declare the events up here, it should be able to be accessed by all the functions.
var events = []
var calendar;

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
		plugins: ['dayGrid', 'timeGrid', 'interaction'],
		selectable: true,
		editable: true,
		nowIndicator: true,
		header: {
			left: 'prevYear,prev,next,nextYear today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay'
		},
		dateClick: function (info) {
			//alert('clicked ' + info.dateStr);
		},
		events: [],

    });

    getAppointments();

    calendar.render();
});

function getAppointments() {
    $.ajax({
        url: '/Appointments/GetAppointments',
        method: 'GET'
    }).done(function (data) {
        data.forEach(function (el) {
            var ev = {
                id: el.appointmentId,
                title: el.title,
                start: new Date(el.startTime),
                end: new Date(el.endTime),
                editable: true,
                description: el.description,
                location: el.location,
                recurrence: el.recurrence,
                created: el.created,
                modified: el.modified,
                userId: el.userId
            }
            calendar.addEvent(ev)
        })
        calendar.render();
    }).fail(function (error) {
        alert("Error getting appointments");
    })
}

function createAppointment(appoint) {
	$.ajax({
		url: '/Appointments/Create',
		method: 'POST',
		data: appoint
	}).done(function () {
		events.push({

		})
	}).fail(function (error) {
		alert("Error creating appointment");
	});
}

// Takes in an existing appointment object and passes it to the server to save to the database
function updateAppointment(appoint) {
    var formatted_appointment = {};
    formatted_appointment.StartTime = appoint.startTime;
    formatted_appointment.Id = appoint.id;
    formatted_appointment.Title = appoint.title;
    formatted_appointment.Description = appoint.description;
    formatted_appointment.Location = appoint.location;
    formatted_appointment.Recurrence = appoint.recurrence;

    $.ajax({
        url: '/Appointments/Edit',
        method: 'POST',
        data: formatted_appointment
    })
}

function parseDate(date) {
    return date.split("T")[0]
}

function parseTime(date) {
    return date.split("T")[1]
}