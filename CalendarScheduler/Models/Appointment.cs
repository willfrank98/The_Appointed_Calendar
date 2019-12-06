using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CalendarScheduler.Models
{
    public class Appointment
    {
        [Required]
        public int AppointmentId { get; set; }

        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
		public string Category { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        public string Reccurence { get; set; }
        public DateTime? EndRecurrence { get; set; }
        [Required]
        public DateTime Created { get; set; }
        [Required]
        public DateTime Modified { get; set; }
        public string UserId { get; set; }
        public string BackgroundColor { get; set; }
        public string BorderColor { get; set; }
    }
}
