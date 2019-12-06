using Microsoft.EntityFrameworkCore.Migrations;

namespace CalendarScheduler.Migrations.CalendarScheduler
{
    public partial class endrecur : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EndRecurrence",
                table: "Appointment",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndRecurrence",
                table: "Appointment");
        }
    }
}
