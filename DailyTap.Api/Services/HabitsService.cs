using DailyTap.Api.Models;
using DailyTap.Api.Repositories;
using MongoDB.Bson;

namespace DailyTap.Api.Services;

public class HabitsService
{
    private readonly IHabitRepository _habits;

    public HabitsService(IHabitRepository habits)
    {
        _habits = habits;
    }

    public Task<List<Habit>> GetForUserAsync(string userId, CancellationToken cancellationToken)
    {
        return _habits.GetByUserIdAsync(userId, cancellationToken);
    }

    public async Task<Habit> CreateAsync(string userId, Habit habit, CancellationToken cancellationToken)
    {
        habit.Id = ObjectId.GenerateNewId().ToString();
        habit.UserId = userId;
        habit.CreatedAtUtc = DateTime.UtcNow;

        await _habits.CreateAsync(habit, cancellationToken);
        return habit;
    }

    public async Task<Habit?> UpdateAsync(string userId, string habitId, Habit updated, CancellationToken cancellationToken)
    {
        var existing = await _habits.GetByIdAsync(habitId, cancellationToken);
        if (existing is null || existing.UserId != userId)
        {
            return null;
        }

        existing.Name = updated.Name;
        existing.Notes = updated.Notes;
        existing.UpdatedAtUtc = DateTime.UtcNow;

        var saved = await _habits.UpdateAsync(existing, cancellationToken);
        return saved ? existing : null;
    }

    public async Task<bool> DeleteAsync(string userId, string habitId, CancellationToken cancellationToken)
    {
        var existing = await _habits.GetByIdAsync(habitId, cancellationToken);
        if (existing is null || existing.UserId != userId)
        {
            return false;
        }

        return await _habits.DeleteAsync(habitId, cancellationToken);
    }
}
