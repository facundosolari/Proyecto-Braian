using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using System.Threading.Tasks;
using Application.Models.Helpers;

namespace Application.Extensions
{
    public static class AuthenticationExtension
    {
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            // Configurar opciones desde appsettings.Development.json
            services.Configure<AuthenticationServiceOptions>(
                configuration.GetSection("AuthenticationServiceOptions")
            );

            // Configurar autenticación JWT
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    // Leer JWT desde cookie HttpOnly
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var token = context.Request.Cookies["AuthCookie"];
                            if (!string.IsNullOrEmpty(token))
                                context.Token = token;
                            return Task.CompletedTask;
                        }
                    };

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = configuration["AuthenticationServiceOptions:Issuer"],
                        ValidAudience = configuration["AuthenticationServiceOptions:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.ASCII.GetBytes(configuration["AuthenticationServiceOptions:SecretForKey"]!)
                        )
                    };
                });

            // Policies
            services.AddAuthorization(options =>
            {
                options.AddPolicy("User", policy => policy.RequireClaim("Rol", "User"));
                options.AddPolicy("Admin", policy => policy.RequireClaim("Rol", "Admin"));
                options.AddPolicy("UserOrAdmin", policy =>
                    policy.RequireAssertion(context =>
                        context.User.HasClaim("Rol", "User") ||
                        context.User.HasClaim("Rol", "Admin")
                    )
                );
            });

            return services;
        }
    }
}