﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CalendarScheduler.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace CalendarScheduler.Controllers
{
    [Authorize]
    public class AppointmentsController : Controller
    {
        private readonly CalendarSchedulerContext _context;

        public AppointmentsController(CalendarSchedulerContext context)
        {
            _context = context;
        }

        // GET: Appointments
        //public async Task<IActionResult> Index()
        //{
        //    var calendarSchedulerContext = _context.Appointment.Include(a => a.User);
        //    return View(await calendarSchedulerContext.ToListAsync());
        //}

        public JsonResult GetAppointments()
        {
            var appointments = _context.Appointment.ToList();

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
                .Include(a => a.User)
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
        public async Task<JsonResult> Create(String Title, String Location, String Description, String StartTime, String EndTime)
        {
            Appointment appointment = new Appointment();
            appointment.Description = Description;
            appointment.Title = Title;
            appointment.Location = Location;
            appointment.StartTime = DateTime.Parse(StartTime);
            appointment.EndTime = DateTime.Parse(EndTime);
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
        public async Task<IActionResult> Edit(int id, [Bind("AppointmentId,Title,Description,Location,StartTime,EndTime,Reccurence,Created,Modified,UserId")] Appointment appointment)
        {
            if (id != appointment.AppointmentId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
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
                return RedirectToAction(nameof(Index));
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
                .Include(a => a.User)
                .FirstOrDefaultAsync(m => m.AppointmentId == id);
            if (appointment == null)
            {
                return NotFound();
            }

            return View(appointment);
        }

        // POST: Appointments/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var appointment = await _context.Appointment.FindAsync(id);
            _context.Appointment.Remove(appointment);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointment.Any(e => e.AppointmentId == id);
        }
    }
}
