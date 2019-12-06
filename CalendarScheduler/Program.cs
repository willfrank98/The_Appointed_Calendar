using System;
using System.Threading.Tasks;
using CalendarScheduler.Data;
using CalendarScheduler.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CalendarScheduler
{
    public class Program
	{
		public static async Task Main(string[] args)
		{
            var host = CreateHostBuilder(args).Build();
            using(var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<CalendarSchedulerContext>();
                    var ucontext = services.GetRequiredService<CalendarUserContext>();
                    await DbSeed.InitializeAsync(context, ucontext, services);
                }
                catch(Exception e)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(e, "an error while seeding DB");
                }

            }
            host.Run();
		}

		public static IHostBuilder CreateHostBuilder(string[] args) =>
			Host.CreateDefaultBuilder(args)
				.ConfigureWebHostDefaults(webBuilder =>
				{
					webBuilder.UseStartup<Startup>();
				});
	}
}
