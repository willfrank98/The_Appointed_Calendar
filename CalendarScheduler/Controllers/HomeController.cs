using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using CalendarScheduler.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace CalendarScheduler.Controllers
{
    [Authorize]
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;
		private readonly CalendarSchedulerContext _context;

		public HomeController(ILogger<HomeController> logger, CalendarSchedulerContext context)
		{
			_logger = logger;
			_context = context;
		}

		public IActionResult Index()
		{
			ViewBag.Locations = _context.Locations.Select(l => new SelectListItem {
				Text = l.Name,
				Value = "" + l.ID
			}).ToList();
			return View();
		}

		public IActionResult Privacy()
		{
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
