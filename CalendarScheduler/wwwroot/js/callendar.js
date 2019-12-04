// If we declare the events up here, it should be able to be accessed by all the functions.
var events = []
var calendar;

document.addEventListener('DOMContentLoaded', function () {
	var calendarEl = document.getElementById('calendar');

	calendar = new FullCalendar.Calendar(calendarEl, {
		plugins: ['dayGrid', 'timeGrid', 'interaction'],
		events: [],
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
		eventDrop: function (info) {
			event = info.event;
			var appt = {
				AppointmentId: event.id,
				Title: event.title,
				Description: event.extendedProps.description,
				Location: event.extendedProps.location,
				StartTime: event.start,
				EndTime: event.end,
				Recurrence: event.extendedProps.recurrence,
				Created: event.extendedProps.created,
				Modified: event.extendedProps.modified,
				UserId: event.extendedProps.userId,
			};
			updateAppointment(appt);
		},
		eventResize: function (info) {
			event = info.event;
			var appt = {
				AppointmentId: event.id,
				Title: event.title,
				Description: event.extendedProps.description,
				Location: event.extendedProps.location,
				StartTime: event.start,
				EndTime: event.end,
				Recurrence: event.extendedProps.recurrence,
				Created: event.extendedProps.created,
				Modified: event.extendedProps.modified,
				UserId: event.extendedProps.userId,
			};
			updateAppointment(appt);
		},
		datesRender: function (info) {
			$.contextMenu({
				selector: '.fc-day, .fc-day-top',
				callback: function (key, options) {
					//show new appointment modal
					$('#addModal').modal('show')
				},
				items: {
					"edit": { name: "New Appointment", icon: "edit" },
				}
			});
		},
		eventRender: function (info) {
			info.el.addEventListener("contextmenu", showDateContext);
		}
	});

	//calendarEl.addEventListener("contextmenu", showDateContext);

	getAppointments();

	calendar.render();

	// why don't these seem to run?
	//$(".fc-event-container").contextmenu((event) => showEventContext(event));

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

function showDateContext(event) {
	event.preventDefault();
	alert("right clicked a date");
}

function showEventContext() {
	event.preventDefault();
	alert("right clicked an event");

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
	$.ajax({
		url: '/Appointments/Edit/' + appoint.AppointmentId,
		method: 'POST',
		data: appoint
	}).done(function (data) {
		console.log('updated!');
	});
}

function parseDate(date) {
	return date.split("T")[0]
}

function parseTime(date) {
	return date.split("T")[1]
}