using User.Data;

namespace User.Services;

public class UserService
{
    private readonly UserDbContext _context;
    
    public UserService(UserDbContext context)
    {
        _context = context;
    }
    
    
}