using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CalendarScheduler.Migrations.CalendarScheduler
{
    public partial class endrecurdatetime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "EndRecurrence",
                table: "Appointment",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "EndRecurrence",
                table: "Appointment",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(DateTime));
        }
    }
}
