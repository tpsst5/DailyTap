using DailyTap.Api.Models;
using DailyTap.Api.Repositories;
using DailyTap.Api.Utils;
using MongoDB.Bson;

namespace DailyTap.Api.Services;

public class AuthService
{
    private readonly IUserRepository _users;
    private readonly PasswordHasher _passwordHasher;
    private readonly JwtTokenService _tokenService;

    public AuthService(
        IUserRepository users,
        PasswordHasher passwordHasher,
        JwtTokenService tokenService)
    {
        _users = users;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResult> RegisterAsync(string email, string password, CancellationToken cancellationToken)
    {
        var normalizedEmail = NormalizeEmail(email);
        var existing = await _users.GetByEmailAsync(normalizedEmail, cancellationToken);
        if (existing is not null)
        {
            return AuthResult.Failed("Email is already registered.");
        }

        var user = new User
        {
            Id = ObjectId.GenerateNewId().ToString(),
            Email = normalizedEmail,
            PasswordHash = _passwordHasher.Hash(password),
            CreatedAtUtc = DateTime.UtcNow
        };

        await _users.CreateAsync(user, cancellationToken);
        var token = _tokenService.CreateToken(user);
        return AuthResult.Succeeded(token);
    }

    public async Task<AuthResult> LoginAsync(string email, string password, CancellationToken cancellationToken)
    {
        var normalizedEmail = NormalizeEmail(email);
        var user = await _users.GetByEmailAsync(normalizedEmail, cancellationToken);
        if (user is null || !_passwordHasher.Verify(password, user.PasswordHash))
        {
            return AuthResult.Failed("Invalid email or password.");
        }

        var token = _tokenService.CreateToken(user);
        return AuthResult.Succeeded(token);
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }
}

public record AuthResult(bool Success, string? Token, string? Error)
{
    public static AuthResult Failed(string error) => new(false, null, error);
    public static AuthResult Succeeded(string token) => new(true, token, null);
}
