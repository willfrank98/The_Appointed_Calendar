using Microsoft.EntityFrameworkCore.Migrations;

namespace CalendarScheduler.Migrations.CalendarScheduler
{
    public partial class useridforcats : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Locations",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Categories",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Categories");
        }
    }
}
