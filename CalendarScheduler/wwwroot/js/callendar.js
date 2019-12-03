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
			// if right click
			if (info.jsEvent.which == 3) {
				showDateContext();
			}
		},
		eventClick: function (info) {
			// if right click
			if (info.jsEvent.which == 3) {
				showEventContext();
			}
		},
		events: [],

    });

    getAppointments();

	calendar.render();

	$('div.fc-row').contextmenu((data) => {
		if (data.which == 3) {
			showDateContext();
		}
    });

    $("#add-form-submit").on('click', function () {
        var appointment = {}
        appointment.title = $("#addTitle").val();
        appointment.location = $("#addLocation").val();
        appointment.description = $("#addDescription").val();
        appointment.startTime = $("#starttime").val();
        appointment.endTime = $("#endtime").val();
        createAppointment(appointment);
    })
});

function showDateContext() {
	alert("right clicked a date");
}

function showEventContext() {
	alert("right clicked a event");

}

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
        dataType: "json",
        data: {
            Title: appoint.title,
            Location: appoint.location,
            Description: appoint.description,
            StartTime: appoint.startTime,
            EndTime: appoint.endTime
        }
    }).done(function (data) {
        var ev = {
            id: data.appointmentId,
            title: data.title,
            start: new Date(data.startTime),
            end: new Date(data.endTime),
            editable: true,
            description: data.description,
            location: data.location,
            recurrence: data.recurrence,
            created: data.created,
            modified: data.modified,
            userId: data.userId
        }
		calendar.addEvent(ev)
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