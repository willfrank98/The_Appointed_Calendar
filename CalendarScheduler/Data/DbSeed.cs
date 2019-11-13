using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CalendarScheduler.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace CalendarScheduler.Data
{
    public class DbSeed
    {
        public static void Initialize(CalendarSchedulerContext context, CalendarUserContext userContext, IServiceProvider serviceProvider)
        {
            context.Database.EnsureCreated();

            if (context.Appointment.Any()) return;

            var appts = new Appointment[]
            {
                new Appointment{Title="Appointment 1", Description="description for appt 1", Location="the school", Reccurence="", StartTime=DateTime.UtcNow.ToLocalTime(), EndTime=DateTime.UtcNow.ToLocalTime(), UserId="1"}
            };

            foreach(Appointment a in appts)
            {
                context.Appointment.Add(a);
            }
            context.SaveChanges();

            userContext.Database.EnsureCreated();
            var UserManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

            var users = new IdentityUser[]
            {
                new IdentityUser{UserName="dev@dev.com", PasswordHash="secret", EmailConfirmed=true}
            };

           
            foreach(IdentityUser u in users)
            {
                 UserManager.CreateAsync(u, u.PasswordHash);
            }

            return;
        }
    }
}
