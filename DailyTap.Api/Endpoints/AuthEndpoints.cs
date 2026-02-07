using DailyTap.Api.Services;

namespace DailyTap.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth");

        group.MapPost("/register", async (
                AuthRegisterRequest request,
                AuthService authService,
                CancellationToken cancellationToken) =>
            {
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return Results.BadRequest(new ErrorResponse("Email and password are required."));
                }

                var result = await authService.RegisterAsync(request.Email, request.Password, cancellationToken);
                return result.Success
                    ? Results.Ok(new AuthResponse(result.Token!))
                    : Results.BadRequest(new ErrorResponse(result.Error!));
            })
            .WithName("Register");

        group.MapPost("/login", async (
                AuthLoginRequest request,
                AuthService authService,
                CancellationToken cancellationToken) =>
            {
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return Results.BadRequest(new ErrorResponse("Email and password are required."));
                }

                var result = await authService.LoginAsync(request.Email, request.Password, cancellationToken);
                return result.Success
                    ? Results.Ok(new AuthResponse(result.Token!))
                    : Results.Unauthorized();
            })
            .WithName("Login");

        return app;
    }
}

public record AuthRegisterRequest(string Email, string Password);
public record AuthLoginRequest(string Email, string Password);
public record AuthResponse(string Token);
public record ErrorResponse(string Message);
