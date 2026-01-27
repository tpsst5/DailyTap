using DailyTap.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace DailyTap.Api.Data;

public class MongoContext
{
    private readonly IMongoDatabase _database;

    public MongoContext(IOptions<MongoSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        _database = client.GetDatabase(settings.Database);

        Users = _database.GetCollection<User>(settings.UsersCollection);
        Habits = _database.GetCollection<Habit>(settings.HabitsCollection);
    }

    public IMongoCollection<User> Users { get; }
    public IMongoCollection<Habit> Habits { get; }
}
