using System.Security.Claims;
using DailyTap.Api.Models;
using DailyTap.Api.Services;

namespace DailyTap.Api.Endpoints;

public static class HabitsEndpoints
{
    public static IEndpointRouteBuilder MapHabitsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/habits").RequireAuthorization();

        group.MapGet("/", async (
                ClaimsPrincipal user,
                HabitsService habitsService,
                CancellationToken cancellationToken) =>
            {
                var userId = GetUserId(user);
                var habits = await habitsService.GetForUserAsync(userId, cancellationToken);
                return Results.Ok(habits);
            })
            .WithName("GetHabits");

        group.MapPost("/", async (
                ClaimsPrincipal user,
                HabitCreateRequest request,
                HabitsService habitsService,
                CancellationToken cancellationToken) =>
            {
                if (string.IsNullOrWhiteSpace(request.Name))
                {
                    return Results.BadRequest(new ErrorResponse("Habit name is required."));
                }

                var userId = GetUserId(user);
                var habit = new Habit
                {
                    Name = request.Name,
                    Notes = request.Notes
                };

                try
                {
                    var created = await habitsService.CreateAsync(userId, habit, cancellationToken);
                    return Results.Ok(created);
                }
                catch (ArgumentException ex)
                {
                    return Results.BadRequest(new ErrorResponse(ex.Message));
                }
            })
            .WithName("CreateHabit");

        group.MapPut("/{id}", async (
                ClaimsPrincipal user,
                string id,
                HabitUpdateRequest request,
                HabitsService habitsService,
                CancellationToken cancellationToken) =>
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Results.BadRequest(new ErrorResponse("Habit id is required."));
                }

                if (string.IsNullOrWhiteSpace(request.Name))
                {
                    return Results.BadRequest(new ErrorResponse("Habit name is required."));
                }

                var userId = GetUserId(user);
                try
                {
                    var updated = await habitsService.UpdateAsync(
                        userId,
                        id,
                        new Habit
                        {
                            Name = request.Name,
                            Notes = request.Notes
                        },
                        cancellationToken);

                    return updated is null ? Results.NotFound() : Results.Ok(updated);
                }
                catch (ArgumentException ex)
                {
                    return Results.BadRequest(new ErrorResponse(ex.Message));
                }
            })
            .WithName("UpdateHabit");

        group.MapDelete("/{id}", async (
                ClaimsPrincipal user,
                string id,
                HabitsService habitsService,
                CancellationToken cancellationToken) =>
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Results.BadRequest(new ErrorResponse("Habit id is required."));
                }

                var userId = GetUserId(user);
                try
                {
                    var deleted = await habitsService.DeleteAsync(userId, id, cancellationToken);
                    return deleted ? Results.NoContent() : Results.NotFound();
                }
                catch (ArgumentException ex)
                {
                    return Results.BadRequest(new ErrorResponse(ex.Message));
                }
            })
            .WithName("DeleteHabit");

        return app;
    }

    private static string GetUserId(ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new InvalidOperationException("User id claim is missing.");
        }

        return userId;
    }
}

public record HabitCreateRequest(string Name, string? Notes);
public record HabitUpdateRequest(string Name, string? Notes);
