using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CalendarScheduler.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace CalendarScheduler.Controllers
{
    [Authorize]
    public class AppointmentsController : Controller
    {
        private readonly CalendarSchedulerContext _context;
        private UserManager<IdentityUser> _userManager;
        private String _currentUserId;
        private IHttpContextAccessor _httpContext;

        public AppointmentsController(CalendarSchedulerContext context, UserManager<IdentityUser> userManager, IHttpContextAccessor httpContext)
        {
            _context = context;
            _userManager = userManager;
            _httpContext = httpContext;
            _currentUserId = _userManager.GetUserId(httpContext.HttpContext.User);
        }

        // GET: Appointments
        //public async Task<IActionResult> Index()
        //{
        //    var calendarSchedulerContext = _context.Appointment.Include(a => a.User);
        //    return View(await calendarSchedulerContext.ToListAsync());
        //}

        public JsonResult GetAppointments()
        {
            var appointments = _context.Appointment.Where(m => m.UserId == _currentUserId).ToList();

            return Json(appointments);
        }

        // GET: Appointments/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var appointment = await _context.Appointment
                .Where(a => a.UserId == _currentUserId)
                .FirstOrDefaultAsync(m => m.AppointmentId == id);
            if (appointment == null)
            {
                return NotFound();
            }

            return View(appointment);
        }

        // GET: Appointments/Create
        public IActionResult Create()
        {
            ViewData["UserId"] = new SelectList(_context.Set<IdentityUser>(), "Id", "Id");
            return View();
        }

        // POST: Appointments/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<JsonResult> Create(String Title, String Location, String Category, String Description, String StartTime, String EndTime, String Recurrence, String EndRecurrence)
        {
            Appointment appointment = new Appointment();
            appointment.Description = Description;
            appointment.Title = Title;
            appointment.Location = Location;
            appointment.Category = Category;
            appointment.StartTime = DateTime.Parse(StartTime);
            appointment.EndTime = DateTime.Parse(EndTime);
            appointment.UserId = _currentUserId;
            //appointment.User = await _userManager.GetUserAsync(_httpContext.HttpContext.User);
            appointment.Reccurence = Recurrence;
            if (EndRecurrence != null)
                appointment.EndRecurrence = DateTime.Parse(EndRecurrence);
            else
                appointment.EndRecurrence = null;

            var color = await _context.Locations.Where(l => l.Name == Location && l.UserId == _currentUserId).FirstOrDefaultAsync();
            if (color != null)
                appointment.BackgroundColor = color.Color;
            else
                appointment.BackgroundColor = null;

            var border = await _context.Categories.Where(c => c.Name == Category && c.UserId == _currentUserId).FirstOrDefaultAsync();
            if (border != null)
                appointment.BorderColor = border.Color;
            else
                appointment.BorderColor = null;

            if (ModelState.IsValid)
            {
                _context.Appointment.Add(appointment);
                await _context.SaveChangesAsync();
                return new JsonResult(appointment);
            }
            //ViewData["UserId"] = new SelectList(_context.Set<IdentityUser>(), "Id", "Id", appointment.UserId);
            return new JsonResult(appointment);
        }

        // GET: Appointments/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var appointment = await _context.Appointment.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }
            ViewData["UserId"] = new SelectList(_context.Set<IdentityUser>(), "Id", "Id", appointment.UserId);
            return View(appointment);
        }

        // POST: Appointments/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("AppointmentId,Title,Description,Location, Category,StartTime,EndTime,Reccurence,EndRecurrence,Created,Modified,UserId,BackgroundColor,BorderColor")] Appointment appointment)
        {
            if (id != appointment.AppointmentId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    appointment.UserId = _currentUserId;

                    var color = await _context.Locations.Where(l => l.Name == appointment.Location && l.UserId == _currentUserId).FirstOrDefaultAsync();
                    if (color != null)
                        appointment.BackgroundColor = color.Color;
                    else
                        appointment.BackgroundColor = null;


                    var border = await _context.Categories.Where(c => c.Name == appointment.Category && c.UserId == _currentUserId).FirstOrDefaultAsync();
                    if (border != null)
                        appointment.BorderColor = border.Color;
                    else
                        appointment.BorderColor = null;

                    _context.Appointment.Update(appointment);
					await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AppointmentExists(appointment.AppointmentId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return new JsonResult(appointment);
            }
            ViewData["UserId"] = new SelectList(_context.Set<IdentityUser>(), "Id", "Id", appointment.UserId);
            return View(appointment);
        }

        // GET: Appointments/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var appointment = await _context.Appointment
                .Where(a => a.UserId == _currentUserId)
                .FirstOrDefaultAsync(m => m.AppointmentId == id);
            if (appointment == null)
            {
                return NotFound();
            }

            return View(appointment);
        }

        // POST: Appointments/Delete/5
        [HttpPost, ActionName("Delete")]
        public async Task<JsonResult> DeleteConfirmed(int id)
        {
            var appointment = await _context.Appointment.FindAsync(id);
            _context.Appointment.Remove(appointment);
            await _context.SaveChangesAsync();
            return new JsonResult(new { id = id });
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointment.Any(e => e.AppointmentId == id);
        }
    }
}
