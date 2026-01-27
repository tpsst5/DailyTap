using DailyTap.Api.Data;
using DailyTap.Api.Models;
using MongoDB.Driver;

namespace DailyTap.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly MongoContext _context;

    public UserRepository(MongoContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Find(existing => existing.Email == email)
            .FirstOrDefaultAsync(cancellationToken);

        return user;
    }

    public async Task<User?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Find(existing => existing.Id == id)
            .FirstOrDefaultAsync(cancellationToken);

        return user;
    }

    public Task CreateAsync(User user, CancellationToken cancellationToken)
    {
        return _context.Users.InsertOneAsync(user, cancellationToken: cancellationToken);
    }
}
