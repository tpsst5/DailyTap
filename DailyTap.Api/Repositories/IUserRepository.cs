using DailyTap.Api.Models;

namespace DailyTap.Api.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);
    Task<User?> GetByIdAsync(string id, CancellationToken cancellationToken);
    Task CreateAsync(User user, CancellationToken cancellationToken);
}
