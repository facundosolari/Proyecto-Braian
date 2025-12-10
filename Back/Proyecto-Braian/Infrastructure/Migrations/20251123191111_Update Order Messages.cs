using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOrderMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Leido",
                table: "OrderMessages",
                newName: "SenderId");

            migrationBuilder.AddColumn<bool>(
                name: "LeidoPorAdmin",
                table: "OrderMessages",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "LeidoPorUser",
                table: "OrderMessages",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SenderRole",
                table: "OrderMessages",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LeidoPorAdmin",
                table: "OrderMessages");

            migrationBuilder.DropColumn(
                name: "LeidoPorUser",
                table: "OrderMessages");

            migrationBuilder.DropColumn(
                name: "SenderRole",
                table: "OrderMessages");

            migrationBuilder.RenameColumn(
                name: "SenderId",
                table: "OrderMessages",
                newName: "Leido");
        }
    }
}
