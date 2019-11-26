// If we declare the events up here, it should be able to be accessed by all the functions.
var events = [];

document.addEventListener('DOMContentLoaded', function () {
        var calendarEl = document.getElementById('calendar');

        var calendar = new FullCalendar.Calendar(calendarEl, {
		    plugins: [ 'dayGrid' ]
        });

        calendar.render();
});

function getAppointments() {
    $.ajax({
        url: '/Appointments/GetAppointments',
        method: 'GET'
    }).done(function (data) {
        data.forEach(function (el) {
            events.push({
                id: data.Id,
                title: data.Title,
                startTime: data.StartTime,
                endTime: data.EndTime,
                editable: true,
                description: data.Description,
                location: data.Location,
                recurrence: data.Recurrence,
                created: data.Created,
                modified: data.Modified,
                userId: data.UserId
            })
        })
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
        alert("Error creating appointment")
    }
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