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

    [BsonElement("notes")]
    public string? Notes { get; set; }

    [BsonElement("createdAtUtc")]
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAtUtc")]
    public DateTime? UpdatedAtUtc { get; set; }
}
