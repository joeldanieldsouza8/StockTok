using User.Data;
using User.Models;
using Microsoft.EntityFrameworkCore;  // Add this for FirstOrDefaultAsync


namespace User.Services;

public class UserService
{
    private readonly UserDbContext _context;
    
    public UserService(UserDbContext context)
    {
        _context = context;
    }

    public async Task<Models.User> CreateUserAsync(Models.User user)
    {
        user.Id = Guid.NewGuid();
        user.CreatedAt = DateTimeOffset.UtcNow;
        user.UpdatedAt = DateTimeOffset.UtcNow;
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<Models.User?> GetUserByIdAsync(Guid id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<Models.User?> UpdateUserAsync(Guid id, Models.UserUpdateDto updatedUser)
    {
        var existingUser = await _context.Users.FindAsync(id);
        if (existingUser == null) return null;

        if (updatedUser.Auth0SubjectId != null) existingUser.Auth0SubjectId = updatedUser.Auth0SubjectId;
        if (updatedUser.FullName != null) existingUser.FullName = updatedUser.FullName;
        if (updatedUser.Username != null) existingUser.Username = updatedUser.Username;
        if (updatedUser.Email != null) existingUser.Email = updatedUser.Email;
        existingUser.UpdatedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
        return existingUser;
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Models.User?> GetUserByAuth0IdAsync(string auth0SubjectId)
{
    return await _context.Users.FirstOrDefaultAsync(u => u.Auth0SubjectId == auth0SubjectId);
}
}