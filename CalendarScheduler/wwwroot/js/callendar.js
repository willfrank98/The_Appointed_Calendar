// ********************* Calendar ******************** //
var calendar;

document.addEventListener('DOMContentLoaded', function () {
	var calendarEl = document.getElementById('calendar');

	calendar = new FullCalendar.Calendar(calendarEl, {
		plugins: ['dayGrid', 'timeGrid', 'interaction'],
		events: [],
		selectable: true,
		editable: true,
        nowIndicator: true,
        eventTextColor: 'white',
        customButtons: {
            addButton: {
                text: 'Add Appointment',
                click: function () {
                    $("#addForm").trigger('reset');
                    $("#addModal").modal('show');
                }
            }
        },
		header: {
			left: 'prevYear,prev,next,nextYear addButton',
			center: 'title',
			right: 'today dayGridMonth,timeGridWeek,timeGridDay'
		},
		eventClick: function (info) {
			openViewModal(info);
		},
		eventDrop: function (info) {
			event = info.event;
            var appt = {}
				appt.AppointmentId = event.id
				appt.title = event.title
				appt.description = event.extendedProps.description
				appt.location = event.extendedProps.location
                appt.startTime = moment(event.start).format("M/D/YYYY h:mm A");
                appt.endTime = moment(event.end).format("M/D/YYYY h:mm A");
				appt.recurrence= event.extendedProps.recurrence

			updateAppointment(appt);
		},
		eventResize: function (info) {
			event = info.event;
			var appt = {
				AppointmentId: event.id,
				title: event.title,
				description: event.extendedProps.description,
				location: event.extendedProps.location,
                startTime: moment(event.start).format("M/D/YYYY h:mm A"),
                endTime: moment(event.end).format("M/D/YYYY h:mm A"),
                recurrence: event.extendedProps.recurrence,
                endRecurrence: event.endRecur
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
					"add": { name: "New Appointment", icon: "edit" },
				}
			});
		},
		eventRender: function (info) {
			// set unique id
			var id = info.event.id;
			info.el.id = "event" + id;
			$.contextMenu({
				selector: "#event" + id,
				callback: function (key, options) {
					switch (key) {
						case "edit":
							openEditModal(info.event);
							break;
						case "cancel":
							openDeleteModal(info);
							break;
					}
				},
				items: {
					"edit": { name: "Edit", icon: "edit" },
					"cancel": { name: "Delete", icon: "delete" },
				}
			});
		}
	});

	getAppointments();

	calendar.render();

	$("#add-form-submit").on('click', function () {
        var appointment = {}
		appointment.title = $("#addTitle").val();
		appointment.location = $("#addLocation").val();
		appointment.description = $("#addDescription").val();
		appointment.startTime = $("#starttime").val();
        appointment.endTime = $("#endtime").val();
        var recur = $("input[name='Recurrence']:checked")[0].id;
        if (recur != "none") {
            if (recur == "daily") {
                appointment.daysOfWeek = [0,1,2,3,4,5,6]
            }
            else if (recur == "weekly") {
                appointment.daysOfWeek = [];
                $('input[type="checkbox"]').each((i, el) => {
                    if (el.checked) {
                        appointment.daysOfWeek.push(i);
                    }
                });
            }
            appointment.startRecur = appointment.startTime;
            appointment.endRecur = $("#endRecur").val();
        }
		createAppointment(appointment);
	})
});

// ******************** Event Handlers ********************* //

$("#edit-form-submit").on('click', function () {
    var appointment = {}
    appointment.AppointmentId = $("#apptId").val();
    appointment.title = $("#editTitle").val();
    appointment.location = $("#editLocation").val();
    appointment.description = $("#editDescription").val();
    appointment.startTime = $("#editStart").val();
    appointment.endTime = $("#editEnd").val();
    updateAppointment(appointment);
})

// *************** Async Functions ******************** //

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
                daysOfWeek: el.reccurence.split(',').map(Number),
                startRecur: new Date(el.startTime),
                endRecur: new Date(el.endRecurrence),
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
    data = {
        Title: appoint.title,
        Location: appoint.location,
        Description: appoint.description,
        StartTime: appoint.startTime,
        EndTime: appoint.endTime,
        Recurrence: appoint.daysOfWeek.join(),
        EndRecurrence: appoint.endRecur
    }
    $.ajax({
        url: '/Appointments/Create',
        method: 'POST',
        dataType: "json",
        data: data
    }).done(function (data) {
        var ev = {
            id: data.appointmentId,
            title: data.title,
            start: new Date(data.startTime),
            end: new Date(data.endTime),
            editable: true,
            description: data.description,
            location: data.location,
            daysOfWeek: data.reccurence.split(',').map(Number),
            startRecur: new Date(data.startTime),
            endRecur: new Date(data.endRecurrence),
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

        calendar.getEventById(ev.id).remove();
        calendar.addEvent(ev);
    });

}

function deleteAppointment() {
    var id = $("#deleteModalEventId")[0].innerHTML
    $.ajax({
        url: '/Appointments/Delete/' + id,
        method: 'POST'
    }).done(function (data) {
        calendar.getEventById(id).remove();
        $("#deleteModal").modal('hide');
    }).fail(function (error) {
        alert("Error Deleting Event");
    })
}

// ********************* Modals ************************ //

function openViewModal(info) {
    console.log(info.event)
    $("#viewModal .modal-title").html(info.event.title);
    $("#event-desc").html(info.event.extendedProps.description);
    $("#event-loc").html(info.event.extendedProps.location ? info.event.extendedProps.location : 'No location');
    $("#event-time").html(moment(info.event.start).format('M/D/YY h:mm a') + '<br>' + moment(info.event.end).format('M/D/YY h:mm a'));
    $("#event-cat").html(info.event.category ? info.event.category : 'No category');
    $("#goEditBtn").attr('onclick', 'getEventEdit('+info.event.id+')');
    $("#viewModal").modal('show');
}

function openEditModal(event) {
    $("#apptId").val(event.id);
    $("#editTitle").val(event.title);
    $("#editLocation").val(event.extendedProps.location);
    $("#editCategory").val(event.extendedProps.category);
    $("#editDescription").val(event.extendedProps.description);
    $("#editStart").val(moment(event.start).format("M/D/YYYY h:mm A"));
    $("#editEnd").val(moment(event.end).format("M/D/YYYY h:mm A"));
    $("#editModal").modal('show');
}

function openDeleteModal(info) {
    console.log(info.event)
    $("#deleteModal .modal-title").html(info.event.title);
    $("#deleteModalEventId").html(info.event.id);
    $("#deleteModal").modal('show');
}

// ******************* HTML FUNCTIONS ********************* //

// This should make an input red if it's empty when they click off of it. Just to show that it's required
// Used in the creation form
function validateRequired(el) {
    if ($(el).val() == "") {
        $(el).css("border-color", "red");
    } else {
        $(el).css("border-color", "#dee2e6");
    }
}

function getEventEdit(id) {
    openEditModal(calendar.getEventById(id))
}

// ******************* PRIVATE ************************ //

// In the event that we need to pull the date portion of the Date Objects arriving from the server
function parseDate(date) {
	return date.split("T")[0]
}

// If we want to isolate the Time from the date objects from the server
function parseTime(date) {
	return date.split("T")[1]
}