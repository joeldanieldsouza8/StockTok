using Users.Data;

namespace Users.Services;

public class UserService
{
    private readonly UserDbContext _context;
    
    public UserService(UserDbContext context)
    {
        _context = context;
    }
    
    
}