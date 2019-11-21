using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CalendarScheduler.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CalendarScheduler.Data
{
    public class DbSeed
    {
        public static async Task InitializeAsync(CalendarSchedulerContext context, CalendarUserContext userContext, IServiceProvider serviceProvider)
        {

            //userContext.Database.EnsureCreated();
            //userContext.Database.Migrate();

            var UserManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

            var users = new IdentityUser[]
            {
                new IdentityUser{UserName="dev@dev.com", PasswordHash="Abc123!", EmailConfirmed=true}
            };

            IdentityResult ir;
            foreach (IdentityUser u in users)
            {
                ir =  UserManager.CreateAsync(u, u.PasswordHash).Result;
                
            }

            //context.Database.EnsureCreated();
            //context.Database.Migrate();

            string uid = await UserManager.GetUserIdAsync(users.First());

            if (context.Appointment.Any()) return;

            var appts = new Appointment[]
            {
                new Appointment{Title="Appointment 1", Description="description for appt 1", Location="the school", Reccurence="", StartTime=DateTime.UtcNow.ToLocalTime(), EndTime=DateTime.UtcNow.ToLocalTime(), UserId=uid},
                new Appointment{Title="Appointment 2", Description="description for appt 1", Location="the office", Reccurence="", StartTime=DateTime.UtcNow.ToLocalTime(), EndTime=DateTime.UtcNow.ToLocalTime(), UserId=uid}

            };

            foreach(Appointment a in appts)
            {
                context.Appointment.Add(a);
            }
            context.SaveChanges();

            return;
        }
    }
}
