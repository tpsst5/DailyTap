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
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User id is required.", nameof(userId));
        }

        return _habits.GetByUserIdAsync(userId, cancellationToken);
    }

    public async Task<Habit> CreateAsync(string userId, Habit habit, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User id is required.", nameof(userId));
        }

        if (habit is null)
        {
            throw new ArgumentException("Habit is required.", nameof(habit));
        }

        if (string.IsNullOrWhiteSpace(habit.Name))
        {
            throw new ArgumentException("Habit name is required.", nameof(habit));
        }

        habit.Id = ObjectId.GenerateNewId().ToString();
        habit.UserId = userId;
        habit.CreatedAt = string.IsNullOrWhiteSpace(habit.CreatedAt)
            ? DateTime.UtcNow.ToString("yyyy-MM-dd")
            : habit.CreatedAt;
        habit.CompletedDates ??= new List<string>();

        await _habits.CreateAsync(habit, cancellationToken);
        return habit;
    }

    public async Task<Habit?> UpdateAsync(string userId, string habitId, Habit updated, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User id is required.", nameof(userId));
        }

        if (string.IsNullOrWhiteSpace(habitId))
        {
            throw new ArgumentException("Habit id is required.", nameof(habitId));
        }

        if (updated is null)
        {
            throw new ArgumentException("Habit is required.", nameof(updated));
        }

        if (string.IsNullOrWhiteSpace(updated.Name))
        {
            throw new ArgumentException("Habit name is required.", nameof(updated));
        }

        var existing = await _habits.GetByIdAsync(habitId, cancellationToken);
        if (existing is null || existing.UserId != userId)
        {
            return null;
        }

        existing.Name = updated.Name;
        existing.Emoji = updated.Emoji;
        existing.CompletedDates = updated.CompletedDates ?? new List<string>();
        existing.CreatedAt = string.IsNullOrWhiteSpace(updated.CreatedAt)
            ? existing.CreatedAt
            : updated.CreatedAt;
        existing.UpdatedAtUtc = DateTime.UtcNow;

        var saved = await _habits.UpdateAsync(existing, cancellationToken);
        return saved ? existing : null;
    }

    public async Task<bool> DeleteAsync(string userId, string habitId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User id is required.", nameof(userId));
        }

        if (string.IsNullOrWhiteSpace(habitId))
        {
            throw new ArgumentException("Habit id is required.", nameof(habitId));
        }

        var existing = await _habits.GetByIdAsync(habitId, cancellationToken);
        if (existing is null || existing.UserId != userId)
        {
            return false;
        }

        return await _habits.DeleteAsync(habitId, cancellationToken);
    }
}
