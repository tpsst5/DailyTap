using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DailyTap.Api.Models;

public class Habit
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("userId")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("emoji")]
    public string? Emoji { get; set; }

    [BsonElement("createdAt")]
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

    [BsonElement("completedDates")]
    public List<string> CompletedDates { get; set; } = new();

    [BsonElement("updatedAtUtc")]
    public DateTime? UpdatedAtUtc { get; set; }
}
