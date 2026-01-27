using DailyTap.Api.Models;

namespace DailyTap.Api.Repositories;

public interface IHabitRepository
{
    Task<List<Habit>> GetByUserIdAsync(string userId, CancellationToken cancellationToken);
    Task<Habit?> GetByIdAsync(string id, CancellationToken cancellationToken);
    Task CreateAsync(Habit habit, CancellationToken cancellationToken);
    Task<bool> UpdateAsync(Habit habit, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken);
}
