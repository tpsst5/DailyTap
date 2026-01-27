using DailyTap.Api.Data;
using DailyTap.Api.Models;
using MongoDB.Driver;

namespace DailyTap.Api.Repositories;

public class HabitRepository : IHabitRepository
{
    private readonly MongoContext _context;

    public HabitRepository(MongoContext context)
    {
        _context = context;
    }

    public Task<List<Habit>> GetByUserIdAsync(string userId, CancellationToken cancellationToken)
    {
        return _context.Habits
            .Find(habit => habit.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<Habit?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        var habit = await _context.Habits
            .Find(existing => existing.Id == id)
            .FirstOrDefaultAsync(cancellationToken);

        return habit;
    }

    public Task CreateAsync(Habit habit, CancellationToken cancellationToken)
    {
        return _context.Habits.InsertOneAsync(habit, cancellationToken: cancellationToken);
    }

    public async Task<bool> UpdateAsync(Habit habit, CancellationToken cancellationToken)
    {
        var result = await _context.Habits.ReplaceOneAsync(
            existing => existing.Id == habit.Id,
            habit,
            cancellationToken: cancellationToken);

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken)
    {
        var result = await _context.Habits.DeleteOneAsync(
            habit => habit.Id == id,
            cancellationToken);

        return result.DeletedCount > 0;
    }
}
