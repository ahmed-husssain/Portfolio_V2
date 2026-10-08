export interface ArchitectureNode {
  id: string
  stepNumber: number
  shortLabel: string
  title: string
  layer: string
  summary: string
  benefit: string
  tech: string
  codeTitle: string
  codeSnippet: string
}

export interface SimulationStep {
  nodeId: string
  log: string
  durationMs: number
}

export interface SimulationScenario {
  id: string
  title: string
  summary: string
  steps: SimulationStep[]
  outcome: string
  outcomeType: 'collision' | 'cached' | 'success'
}

export interface ArchitectureFlow {
  id: string
  title: string
  subtitle: string
  nodes: ArchitectureNode[]
  scenarios: SimulationScenario[]
}

export const GALLREX_ARCHITECTURE: ArchitectureFlow[] = [
  {
    id: 'auction-concurrency',
    title: 'Live Auction Engine',
    subtitle: 'How bids process in real time without collisions or double-charges.',
    nodes: [
      {
        id: 'client-bidder',
        stepNumber: 1,
        shortLabel: 'User Bids',
        title: 'Browser Submission',
        layer: 'Client UI',
        summary: 'User submits a bid amount.',
        benefit: 'Attaches a unique safety key (UUID) to prevent duplicate charges.',
        tech: 'JavaScript · Fetch API',
        codeTitle: 'Client Bid Dispatch (JS)',
        codeSnippet: `// Attaches unique safety token before sending
const idempotencyKey = crypto.randomUUID();

await fetch('/Product/PlaceBid', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Idempotency-Key': idempotencyKey
  },
  body: JSON.stringify({ productId: 42, amount: 1250.00 })
});`,
      },
      {
        id: 'idempotency-cache',
        stepNumber: 2,
        shortLabel: 'Anti-Spam Cache',
        title: 'In-Memory Cache Guard',
        layer: 'Memory Cache',
        summary: 'Checks fast RAM before touching the database.',
        benefit: 'Filters rapid double-clicks in 0.01ms with zero database load.',
        tech: 'IMemoryCache (0.01ms)',
        codeTitle: 'Idempotency Check (C#)',
        codeSnippet: `var key = Request.Headers["X-Idempotency-Key"].FirstOrDefault();

// Returns cached result in 0.01ms if already processed
if (_memoryCache.TryGetValue($"bid_{key}", out BidResult? cached))
{
    return Ok(cached);
}`,
      },
      {
        id: 'cqrs-dispatcher',
        stepNumber: 3,
        shortLabel: 'Command Router',
        title: 'MediatR CQRS Router',
        layer: 'Application',
        summary: 'Routes the bid command through MediatR.',
        benefit: 'Isolates financial transaction logic from general web controllers.',
        tech: 'C# · MediatR',
        codeTitle: 'ProductController.cs',
        codeSnippet: `[HttpPost("PlaceBid")]
[Authorize]
public async Task<IActionResult> PlaceBid([FromBody] PlaceBidRequest req)
{
    var command = new PlaceBidCommand(User.GetUserId(), req.ProductId, req.Amount);
    var result = await _mediator.Send(command);
    return result.IsSuccess ? Ok(result) : BadRequest(result.Error);
}`,
      },
      {
        id: 'domain-validator',
        stepNumber: 4,
        shortLabel: 'Rule Check',
        title: 'Domain Rule Validation',
        layer: 'Business Logic',
        summary: 'Checks auction rules before saving.',
        benefit: 'Verifies active timer, card on file, and minimum increment.',
        tech: 'Domain Invariants',
        codeTitle: 'PlaceBidCommandHandler.cs',
        codeSnippet: `// 1. Verify payment card on file
if (string.IsNullOrEmpty(user.CardNumber))
    return BidResult.Failed("Payment card required.");

// 2. Ensure auction is still active
if (!product.IsAuction || product.AuctionEndTime <= DateTime.Now)
    return BidResult.Failed("Auction has closed.");

// 3. Minimum $1 increment
if (request.Amount < (product.CurrentBid ?? product.Price) + 1.00m)
    return BidResult.Failed("Bid must exceed current price.");`,
      },
      {
        id: 'sql-occ',
        stepNumber: 5,
        shortLabel: 'Database Guard',
        title: 'SQL Server Concurrency Guard',
        layer: 'Database (SQL Server)',
        summary: 'Saves bid using RowVersion timestamps.',
        benefit: 'If 2 bids arrive at the same millisecond, the fastest wins; the other retries without deadlocks.',
        tech: 'EF Core 8 · RowVersion (OCC)',
        codeTitle: 'Concurrency Check (C#)',
        codeSnippet: `// Product.cs: [Timestamp] public byte[]? RowVersion { get; set; }

product.CurrentBid = request.Amount;
product.HighestBidderId = request.UserId;
product.BidCount++;

try {
    await _context.SaveChangesAsync(cancellationToken);
} catch (DbUpdateConcurrencyException) {
    // Collision caught! Zero database deadlocks
    return BidResult.Collision("Outbid at this exact second. Please retry.");
}`,
      },
      {
        id: 'signalr-hub',
        stepNumber: 6,
        shortLabel: 'Live Broadcast',
        title: 'SignalR WebSocket Broadcast',
        layer: 'Real-Time WebSockets',
        summary: 'Pushes new price to all connected screens.',
        benefit: 'All spectators see the price update in under 10ms without page reloads.',
        tech: 'SignalR (<10ms)',
        codeTitle: 'AuctionHub.cs',
        codeSnippet: `// Pushes update to all viewers in room within 10ms
await _hub.Clients
    .Group($"auction-{product.Id}")
    .SendAsync("ReceiveNewBid", new {
        productId = product.Id,
        newBid = product.CurrentBid,
        bidderName = bidder.Name
    });`,
      },
      {
        id: 'background-worker',
        stepNumber: 7,
        shortLabel: 'Auto-Settle',
        title: 'Autonomous Background Worker',
        layer: 'Background Service',
        summary: 'Wakes every 15 seconds to check expired auctions.',
        benefit: 'Closes auctions and generates winner invoices even with zero users online.',
        tech: 'BackgroundService (15s)',
        codeTitle: 'AuctionEndingWorker.cs',
        codeSnippet: `public class AuctionEndingWorker : BackgroundService
{
    private readonly PeriodicTimer _timer = new(TimeSpan.FromSeconds(15));

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (await _timer.WaitForNextTickAsync(ct))
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<MyContext>();
            
            // Automatically close ended auctions and create orders
            await SettleExpiredAuctionsAsync(db, ct);
        }
    }
}`,
      },
    ],
    scenarios: [
      {
        id: 'simultaneous-bids',
        title: 'Two Simultaneous Bids',
        summary: 'User A and User B click bid at the exact same millisecond.',
        outcome: 'User A commits successfully. User B gets an instant retry prompt. Zero database deadlocks.',
        outcomeType: 'collision',
        steps: [
          { nodeId: 'client-bidder', log: 'User A ($1,250) and User B ($1,260) submit bids at the same millisecond.', durationMs: 350 },
          { nodeId: 'idempotency-cache', log: 'Both requests verified with unique safety tokens in RAM.', durationMs: 250 },
          { nodeId: 'cqrs-dispatcher', log: 'Dispatched through MediatR pipeline.', durationMs: 250 },
          { nodeId: 'domain-validator', log: 'Both bids pass card verification and minimum price rules.', durationMs: 300 },
          { nodeId: 'sql-occ', log: 'Collision handled: User A commits with RowVersion. User B caught safely by EF Core.', durationMs: 450 },
          { nodeId: 'signalr-hub', log: 'WebSockets push new $1,250 price to all screens in 10ms.', durationMs: 350 },
        ],
      },
      {
        id: 'double-click',
        title: 'Fast Double-Click',
        summary: 'User clicks the bid button twice due to connection lag.',
        outcome: 'First click commits. Second click returned by memory cache in 0.01ms with zero database load.',
        outcomeType: 'cached',
        steps: [
          { nodeId: 'client-bidder', log: 'User clicks twice: 2 requests with identical safety ID.', durationMs: 300 },
          { nodeId: 'idempotency-cache', log: 'Request #1 passes. Request #2 answered from memory in 0.01ms!', durationMs: 350 },
          { nodeId: 'sql-occ', log: 'Single database write executed. No duplicate charge.', durationMs: 350 },
          { nodeId: 'signalr-hub', log: 'Single price update broadcasted.', durationMs: 300 },
        ],
      },
      {
        id: 'timer-ended',
        title: 'Timer Reaches 0:00',
        summary: 'Auction countdown finishes with zero visitors currently on the site.',
        outcome: '15-second worker closes the auction, selects the winner, and creates the order automatically.',
        outcomeType: 'success',
        steps: [
          { nodeId: 'background-worker', log: '15-second heartbeat timer fires automatically.', durationMs: 350 },
          { nodeId: 'sql-occ', log: 'Finds expired auction (clock past end time).', durationMs: 350 },
          { nodeId: 'domain-validator', log: 'Identifies highest bidder as winner.', durationMs: 300 },
          { nodeId: 'sql-occ', log: 'Creates Order with "Awaiting Payment" status.', durationMs: 400 },
          { nodeId: 'signalr-hub', log: 'Broadcasts "Auction Closed" banner to all connected screens.', durationMs: 350 },
        ],
      },
    ],
  },
  {
    id: 'auth-pipeline',
    title: 'OAuth & Identity',
    subtitle: '1-click sign-in with Google, GitHub, and Discord.',
    nodes: [
      {
        id: 'oauth-providers',
        stepNumber: 1,
        shortLabel: '1-Click Login',
        title: 'OAuth 2.0 Login',
        layer: 'Authentication',
        summary: 'User signs in with Google, GitHub, or Discord.',
        benefit: 'Eliminates password fatigue with official OAuth security.',
        tech: 'OAuth 2.0 · Cookie Auth',
        codeTitle: 'Program.cs',
        codeSnippet: `builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie()
    .AddGoogle(options => { /* Client ID & Secret */ })
    .AddGitHub(options => { /* Client ID & Secret */ })
    .AddDiscord(options => { /* Client ID & Secret */ });`,
      },
      {
        id: 'rate-limiter',
        stepNumber: 2,
        shortLabel: 'Anti-Brute Force',
        title: 'Memory Rate Limiter',
        layer: 'Security Cache',
        summary: 'Blocks password guessing attempts.',
        benefit: 'Locks attempts in RAM for 5 minutes after 5 failures.',
        tech: 'IMemoryCache (5 Fails / 5 Min)',
        codeTitle: 'AuthController.cs',
        codeSnippet: `var key = $"login_attempts_{model.Email}";
if (_memoryCache.TryGetValue(key, out int attempts) && attempts >= 5)
{
    return View("Error", "Account locked for 5 minutes.");
}
_memoryCache.Set(key, attempts + 1, TimeSpan.FromMinutes(5));`,
      },
      {
        id: 'claim-mapper',
        stepNumber: 3,
        shortLabel: 'Profile Sync',
        title: 'Local User Mapping',
        layer: 'Application',
        summary: 'Merges external email into local user record.',
        benefit: 'Preserves relational foreign keys for orders and bids.',
        tech: 'SQL Server · User Entity',
        codeTitle: 'AuthController.cs',
        codeSnippet: `var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
if (user == null) {
    user = new User { Email = email, Name = name, Role = "User" };
    _context.Users.Add(user);
}
await _context.SaveChangesAsync();`,
      },
      {
        id: 'avatar-downloader',
        stepNumber: 4,
        shortLabel: 'Avatar Mirror',
        title: 'Avatar Mirroring',
        layer: 'Storage',
        summary: 'Downloads remote profile avatar to local server.',
        benefit: 'Guarantees fast loading with zero broken image links.',
        tech: 'HttpClient · wwwroot',
        codeTitle: 'Avatar Mirroring (C#)',
        codeSnippet: `var bytes = await _httpClient.GetByteArrayAsync(remoteUrl);
var filePath = Path.Combine(_env.WebRootPath, "images", "avatars", $"{Guid.NewGuid()}.png");
await File.WriteAllBytesAsync(filePath, bytes);`,
      },
    ],
    scenarios: [],
  },
  {
    id: 'catalog-indexing',
    title: 'Fast Catalog Search',
    subtitle: 'Zero table-scan queries with SQL Server indexing.',
    nodes: [
      {
        id: 'catalog-query',
        stepNumber: 1,
        shortLabel: 'Search Query',
        title: 'Server-Side Paging',
        layer: 'Query Controller',
        summary: 'Loads 12 artworks per page with filters.',
        benefit: 'Keeps browsing fast even as thousands of artworks are added.',
        tech: 'EF Core · Skip / Take',
        codeTitle: 'ProductController.cs',
        codeSnippet: `var artworks = await _context.Products
    .Where(p => p.IsApproved)
    .OrderBy(p => p.Name)
    .Skip((page - 1) * 12)
    .Take(12)
    .ToListAsync();`,
      },
      {
        id: 'sql-covering-index',
        stepNumber: 2,
        shortLabel: 'Covering Index',
        title: 'B-Tree Covering Index',
        layer: 'Database Index',
        summary: 'Resolves search directly from index pages.',
        benefit: 'Zero table-scan disk overhead for maximum speed.',
        tech: 'Non-Clustered B-Tree',
        codeTitle: 'MyContext.sql',
        codeSnippet: `CREATE NONCLUSTERED INDEX IX_Products_IsApproved_Name
ON Products (IsApproved, Name)
INCLUDE (Price, ImageUrl, IsAuction, CurrentBid);`,
      },
      {
        id: 'admin-moderation',
        stepNumber: 3,
        shortLabel: 'Moderation',
        title: 'Admin Approval Queue',
        layer: 'Moderation Logic',
        summary: 'New uploads require admin approval.',
        benefit: 'Protects the marketplace from spam before appearing publicly.',
        tech: 'Admin Role · IsApproved Flag',
        codeTitle: 'AdminController.cs',
        codeSnippet: `[HttpPost]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> ApproveArtwork(int id) {
    var item = await _context.Products.FindAsync(id);
    item.IsApproved = true;
    await _context.SaveChangesAsync();
    return RedirectToAction("Pending");
}`,
      },
    ],
    scenarios: [],
  },
]
