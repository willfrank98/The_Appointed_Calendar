using Microsoft.EntityFrameworkCore.Migrations;

namespace CalendarScheduler.Migrations.CalendarScheduler
{
    public partial class categoryappt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Appointment",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Appointment");
        }
    }
}
