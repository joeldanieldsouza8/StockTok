# StockTok

Stocktok is a social stock analysis platform that uses microservices architecture to stream real-time stock data and deliver insights for users on various stocks. Users can also view social feeds for various stocks and news.

## Architecture

## Getting Started

- Must have access to Otter lab machines through University of Surrey

### Accessing the Application

The application is deployed and accessible at:

**https://group16-web.com3033.csee-systems.com/**

> **Note:** This URL is only accessible from within the University of Surrey Otter Lab machines whether physically or through SSH due to security purposes.

### Using the Application

1. **Sign In**
   - Navigate to the home page (Alternatively `/`)
   - Click the **"Get Started"** button
   - Sign in using your Gmail account via Auth0

2. **Navigate to Dashboard**
   - After signing in, click **"Go to Dashboard"** to access the main dashboard
   - Alternatively, navigate directly to `/dashboard`

3. **Create and Manage Watchlists**
   - Create a new watchlist from the dashboard
   - Add stock tickers to your watchlist
   - Click on any ticker in your watchlist to view its social feed



4. **Interact with Social Feeds**
   - View posts and discussions about specific stocks
   - Create posts about stocks you're tracking
   - Comment on other users' posts

### Available Routes

- `/` - Home page
- `/dashboard` - Main dashboard with watchlists
- `/feed/[ticker]` - Social feed for a specific stock ticker (e.g., `/feed/AAPL`)
- `/market` - Market overview
- `/market/[ticker]` - Detailed market data for a specific ticker

### Known Issues

Please be aware of the following minor issues:

- **Random Sign-Outs:** Users may be signed out randomly. If this occurs, simply sign back in using the same Gmail account.
- **Non-Functional Buttons:** Some buttons such as "Community" and "Docs" may not be fully functional. Note that the community features are accessible through the social feed pages (`/feed/[ticker]`).


### Developers

Joel D'Souza (Full Stack Developer)
Said Ait Ennecer (Full Stack Developer, Report Lead)
Rita San (Full Stack Developer)
Eyad Cherifi (Full Stack Developer)
Steven Thomas (Full Stack Developer)
Zayaan K. Khan (Technical Lead, Full Stack Developer)

---

## License

This project is licensed under the MIT License.