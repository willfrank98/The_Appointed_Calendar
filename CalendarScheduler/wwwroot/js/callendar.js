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
            appt.AppointmentId = event.id;
            appt.title = event.title;
            appt.description = event.extendedProps.description;
            appt.location = event.extendedProps.location;
            appt.category = event.extendedProps.category;
            appt.startTime = moment(event.start).format("M/D/YYYY h:mm A");
            appt.endTime = moment(event.end).format("M/D/YYYY h:mm A");
            appt.created = event.extendedProps.created;
            appt.modified = event.extendedProps.modified;
            appt.userId = event.extendedProps.userId;
            appt.backgroundColor = event.backgroundColor;

            if (event.extendedProps.reccurence != undefined) {
                appt.reccurence = event.extendedProps.reccurence;
                appt.startTime = moment(event.extendedProps.start).add(info.delta.days, 'days').format("M/D/YYYY h:mm A");
                appt.endTime = moment(event.extendedProps.end).add(info.delta.days, 'days').format("M/D/YYYY h:mm A");
                appt.endRecurrence = moment(event.extendedProps.endOfR).add(info.delta.days, 'days').format("M/D/YYYY h:mm A");
            } else {
                appt.reccurence = null;
                appt.endRecurrence = null;
            }
			updateAppointment(appt);
		},
		eventResize: function (info) {
            event = info.event;
            var appt = {}
            appt.AppointmentId = event.id;
            appt.title = event.title;
            appt.description = event.extendedProps.description;
            appt.location = event.extendedProps.location;
            appt.category = event.extendedProps.category;
            appt.startTime = moment(event.start).format("M/D/YYYY h:mm A");
            appt.endTime = moment(event.end).format("M/D/YYYY h:mm A");
            appt.created = event.extendedProps.created;
            appt.modified = event.extendedProps.modified;
            appt.userId = event.extendedProps.userId;
            appt.backgroundColor = event.backgroundColor;

            if (event.daysOfWeek != undefined) {
                appt.recurrence = event.daysOfWeek;
                appt.endRecurrence = moment(event.endRecur).format("M/D/YYYY h:mm A");
            } else {
                appt.recurrence = null;
                appt.endRecurrence = null;
            }

            updateAppointment(appt);
		},
		datesRender: function (info) {
			$.contextMenu({
                selector: '.fc-day, .fc-day-top, td:not([class])',
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
        appointment.category = $("#addCategory").val();
		appointment.description = $("#addDescription").val();
		appointment.startTime = $("#starttime").val();
        appointment.endTime = $("#endtime").val();
        var recur = $("input[name='Recurrence']:checked")[0].id;
        appointment.daysOfWeek = [];
        if (recur != "none") {
            if (recur == "daily") {
                appointment.daysOfWeek = [0,1,2,3,4,5,6]
            }
            else if (recur == "weekly") {
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
    appointment.category = $("#editCategory").val();
    appointment.description = $("#editDescription").val();
    appointment.startTime = $("#editStart").val();
    appointment.endTime = $("#editEnd").val();
    var recur = $("input[name='RecurrenceEdit']:checked")[0].id;
    var daysOfWeek = [];
    if (recur != "noneedit") {
        if (recur == "dailyedit") {
            daysOfWeek = [0, 1, 2, 3, 4, 5, 6]
        }
        else if (recur == "weeklyedit") {
            $('#editModal input[type="checkbox"]').each((i, el) => {
                if (el.checked) {
                    daysOfWeek.push(i);
                }
            });
        }
        appointment.EndRecurrence = $("#editendRecur").val();
        appointment.Reccurence = daysOfWeek.join()
    }
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
                category: el.category,
                created: el.created,
                modified: el.modified,
                userId: el.userId,
                backgroundColor: el.backgroundColor,
                borderColor: el.borderColor,
                reccurence: el.reccurence
            }

            if (el.reccurence != undefined) {
                ev.daysOfWeek = el.reccurence.split(',').map(Number);
                ev.startRecur = new Date(el.startTime);
                ev.endRecur = new Date(el.endRecurrence);
                ev.endOfR = ev.endRecur;
                ev.groupId = ev.id
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
        category: appoint.category,
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
            category: data.category,
            created: data.created,
            modified: data.modified,
            userId: data.userId,
            backgroundColor: data.backgroundColor,
            borderColor: data.borderColor,
            reccurence: data.reccurence
        }

        if (data.reccurence != undefined) {
            ev.daysOfWeek = data.reccurence.split(',').map(Number);
            ev.startRecur = new Date(data.startTime);
            ev.endRecur = new Date(data.endRecurrence);
            ev.endOfR = ev.endRecur;
            ev.groupId = ev.id
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
            category: data.category,
            created: data.created,
            modified: data.modified,
            userId: data.userId,
            backgroundColor: data.backgroundColor,
            borderColor: data.borderColor,
            reccurence: data.reccurence
        }

        if (data.reccurence != undefined) {
            ev.daysOfWeek = data.reccurence.split(',').map(Number);
            ev.startRecur = new Date(data.startTime);
            ev.endRecur = new Date(data.endRecurrence);
            ev.endOfR = ev.endRecur;
            ev.groupId = ev.id;
        }
        //console.log(ev)
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
    if (!info.event.extendedProps.reccurence) {
        $("#viewModal .modal-title").html(info.event.title);
        $("#event-desc").html(info.event.extendedProps.description);
        $("#event-loc").html(info.event.extendedProps.location ? info.event.extendedProps.location : 'No location');
        $("#event-time").html(moment(info.event.start).format('M/D/YY h:mm a') + '<br>' + moment(info.event.end).format('M/D/YY h:mm a'));
        $("#event-cat").html(info.event.extendedProps.category ? info.event.extendedProps.category : 'No category');
        $("#event-recur").html('No Recurrences');
        $("#goEditBtn").attr('onclick', 'getEventEdit(' + info.event.id + ')');
    }
    else {
        $("#viewModal .modal-title").html(info.event.title);
        $("#event-desc").html(info.event.extendedProps.description);
        $("#event-loc").html(info.event.extendedProps.location ? info.event.extendedProps.location : 'No location');
        $("#event-time").html(moment(info.event.extendedProps.start).format('M/D/YY h:mm a') + '<br>' + moment(info.event.extendedProps.end).format('M/D/YY h:mm a'));
        $("#event-cat").html(info.event.extendedProps.category ? info.event.extendedProps.category : 'No category');
        var r = getReccurenceDays(info.event.extendedProps.reccurence)
        $("#event-recur").html(r);
        $("#goEditBtn").attr('onclick', 'getEventEdit(' + info.event.id + ')');
    }
    $("#viewModal").modal('show');
}

function getReccurenceDays(nums) {
    var numbers = nums.split(',');
    var days = "";
    if (numbers.length == 7) {
        return "Daily";
    }
    $.each(numbers, function (k, v) {
        switch (v) {
            case '0':
                days += 'Monday ';
                break;
            case '1':
                days += 'Tuesday ';
                break;
            case '2':
                days += 'Wednesday ';
                break;
            case '3':
                days += 'Thursday ';
                break;
            case '4':
                days += 'Friday ';
                break;
            case '5':
                days += 'Saturday ';
                break;
            case '6':
                days += 'Sunday ';
                break;
        }

    })
    return days;
}

function openEditModal(event) {
    if (event.extendedProps.reccurence == undefined) {
        $("#apptId").val(event.id);
        $("#editTitle").val(event.title);
        $("#editLocation").val(event.extendedProps.location);
        $("#editCategory").val(event.extendedProps.category);
        $("#editDescription").val(event.extendedProps.description);
        $("#editStart").val(moment(event.start).format("M/D/YYYY h:mm A"));
        $("#editEnd").val(moment(event.end).format("M/D/YYYY h:mm A"));
        $("#noneedit").prop('checked', true)
        $("#editendRecur").val('Select Date');
        $("#recur-box-edit").hide();
    }
    else {
        $("#apptId").val(event.id);
        $("#editTitle").val(event.title);
        $("#editLocation").val(event.extendedProps.location);
        $("#editCategory").val(event.extendedProps.category);
        $("#editDescription").val(event.extendedProps.description);
        $("#editStart").val(moment(event.extendedProps.start).format("M/D/YYYY h:mm A"));
        $("#editEnd").val(moment(event.extendedProps.end).format("M/D/YYYY h:mm A"));
        $("#editendRecur").val(moment(event.extendedProps.endOfR).format("M/D/YYYY h:mm A"));
        var r = getReccurenceDays(event.extendedProps.reccurence);
        if (r == "Daily") {
            $("#dailyedit").prop('checked', true);
        } else {
            //check boxes for days of week and check weekly box
            $("#weeklyedit").prop('checked', true);
            checkEditDays(event.extendedProps.reccurence);
        }
        $("#recur-box-edit").show();

    }
    $("#editModal").modal('show');
}

function checkEditDays(nums) {
    var numbers = nums.split(',');
    $.each(numbers, function (k, v) {

        switch (v) {
            case '0':
                $("#day0checkedit").prop('checked', true);
                break;
            case '1':
                $("#day1checkedit").prop('checked', true);
                break;
            case '2':
                $("#day2checkedit").prop('checked', true);
                break;
            case '3':
                $("#day3checkedit").prop('checked', true);
                break;
            case '4':
                $("#day4checkedit").prop('checked', true);
                break;
            case '5':
                $("#day5checkedit").prop('checked', true);
                break;
            case '6':
                $("#day6checkedit").prop('checked', true);
                break;
        }

    })

}

function openDeleteModal(info) {
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

function hideRecurrences() {
    $('#recur-box').hide()
    $("#recur-box-edit").hide()
}

function showRecurrences() {
    $('#recur-box').show()
    $("#recur-box-edit").show()
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