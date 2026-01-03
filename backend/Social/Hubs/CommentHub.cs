using Microsoft.AspNetCore.SignalR;

namespace Posts.Hubs;

public class CommentHub : Hub
{
    public async Task JoinPostGroup(string postId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"POST_{postId}");
    }

    public async Task LeavePostGroup(string postId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"POST_{postId}");
    }
    
    public async Task JoinTickerGroup(string ticker)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"TICKER_{ticker}");
    }

    public async Task LeaveTickerGroup(string ticker)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"TICKER_{ticker}");
    }
}