using Microsoft.EntityFrameworkCore.Migrations;

namespace CalendarScheduler.Migrations.CalendarScheduler
{
    public partial class bgcolor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BackgroundColor",
                table: "Appointment",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BackgroundColor",
                table: "Appointment");
        }
    }
}
