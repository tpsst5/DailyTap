namespace DailyTap.Api.Data;

public class MongoSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string Database { get; set; } = string.Empty;
    public string UsersCollection { get; set; } = "users";
    public string HabitsCollection { get; set; } = "habits";
}
