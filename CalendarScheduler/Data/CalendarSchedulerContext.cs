using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CalendarScheduler.Models
{
    public class CalendarSchedulerContext : DbContext
    {
        public CalendarSchedulerContext (DbContextOptions<CalendarSchedulerContext> options)
            : base(options)
        {
        }

        public DbSet<Appointment> Appointment { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Category> Categories { get; set; }
    }
}
