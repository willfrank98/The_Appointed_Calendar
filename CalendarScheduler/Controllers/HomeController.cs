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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CalendarScheduler.Controllers
{
    [Authorize]
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;
		private readonly CalendarSchedulerContext _context;
        private UserManager<IdentityUser> _userManager;
        private String _currentUserId;
        private IHttpContextAccessor _httpContext;

        public HomeController(ILogger<HomeController> logger, CalendarSchedulerContext context, UserManager<IdentityUser> userManager, IHttpContextAccessor httpContext)
		{
			_logger = logger;
			_context = context;
            _userManager = userManager;
            _httpContext = httpContext;
            _currentUserId = _userManager.GetUserId(httpContext.HttpContext.User);
        }

		public IActionResult Index()
		{
			// get/creates items for Locations dropdown
			ViewBag.Locations = _context.Locations.Where(m => m.UserId == _currentUserId).Select(l => new SelectListItem {
				Text = l.Name,
				Value = l.Name
			}).ToList();
   
			// get/creates items for Categories dropdown
			ViewBag.Categories = _context.Categories.Where(m => m.UserId == _currentUserId).Select(l => new SelectListItem {
				Text = l.Name,
				Value = l.Name
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
