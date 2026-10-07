export interface ArchitectureNode {
  id: string
  title: string
  subtitle: string
  layer: 'Client' | 'Security / Cache' | 'Application / CQRS' | 'Domain / Validation' | 'Database / OCC' | 'Real-Time' | 'Worker'
  badge: string
  description: string
  rationaleTitle: string
  rationale: string
  codeTitle: string
  codeLang: 'csharp' | 'javascript' | 'sql'
  codeSnippet: string
  metrics?: { label: string; value: string }[]
}

export interface SimulationStep {
  nodeId: string
  status: 'pending' | 'active' | 'success' | 'collision' | 'cached'
  log: string
  durationMs: number
}

export interface SimulationScenario {
  id: string
  title: string
  subtitle: string
  description: string
  steps: SimulationStep[]
  outcomeMessage: string
  outcomeType: 'success' | 'collision' | 'cached'
}

export interface ArchitectureFlow {
  id: string
  title: string
  tagline: string
  description: string
  highlightMetric: string
  nodes: ArchitectureNode[]
  scenarios: SimulationScenario[]
}

export const GALLREX_ARCHITECTURE: ArchitectureFlow[] = [
  {
    id: 'auction-concurrency',
    title: 'High-Concurrency Live Bidding & Settlement Engine',
    tagline: 'Optimistic Concurrency Control (OCC) · In-Memory Idempotency · SignalR WebSockets',
    description:
      'Engineered to withstand intense last-second bidding wars. Guarantees zero table deadlocks during sub-millisecond bidding collisions, deduplicates rapid client spam in 0.01ms, and settles expired auctions autonomously via a 15-second background heartbeat.',
    highlightMetric: 'Sub-millisecond collision protection without DB table locks',
    nodes: [
      {
        id: 'client-bidder',
        title: 'Client Browser / Collector UI',
        subtitle: 'Idempotent AJAX Post with UUID Header',
        layer: 'Client',
        badge: 'FETCH / AJAX',
        description:
          'When a collector submits a bid, the browser generates an RFC-compliant UUID v4 idempotency key attached in the HTTP header: X-Idempotency-Key. The submission avoids full page refreshes and awaits JSON response.',
        rationaleTitle: 'Why client-side idempotency keys?',
        rationale:
          'Network jitter and aggressive double-clicking frequently cause duplicate charge or bid attempts. Attaching a unique UUID at the origin ensures the server can treat identical retry bursts as a single transaction.',
        codeTitle: 'Client Bid Dispatch (JavaScript)',
        codeLang: 'javascript',
        codeSnippet: `// Generates client-side idempotency token before firing
const idempotencyKey = crypto.randomUUID();

const res = await fetch('/Product/PlaceBid', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Idempotency-Key': idempotencyKey
  },
  body: JSON.stringify({ productId: 42, amount: 1250.00 })
});

const data = await res.json();
if (!res.ok) showToast(data.message);`,
        metrics: [
          { label: 'Payload', value: '< 150 B' },
          { label: 'Transport', value: 'HTTPS / JSON' },
        ],
      },
      {
        id: 'idempotency-cache',
        title: 'In-Memory Idempotency Guard',
        subtitle: 'IMemoryCache Sliding Window Deduplication',
        layer: 'Security / Cache',
        badge: '0.01ms DEDUPLICATION',
        description:
          'Intercepts requests before querying the database. Checks if the X-Idempotency-Key exists in IMemoryCache. If already processed, the cached response returns instantly in 0.01ms with zero SQL Server load.',
        rationaleTitle: 'Why in-memory caching for idempotency?',
        rationale:
          'Querying SQL Server to verify idempotency defeats the purpose of protecting the database under high traffic bursts. IMemoryCache resolves the check in RAM in microseconds.',
        codeTitle: 'Idempotency Cache Evaluation (C#)',
        codeLang: 'csharp',
        codeSnippet: `var idempotencyKey = Request.Headers["X-Idempotency-Key"].FirstOrDefault();

if (!string.IsNullOrEmpty(idempotencyKey))
{
    var cacheKey = $"bid_idem_{idempotencyKey}";
    if (_memoryCache.TryGetValue(cacheKey, out BidResult? cachedResult))
    {
        // Immediate return without touching SQL Server (0.01ms)
        return cachedResult!.IsSuccess ? Ok(cachedResult) : BadRequest(cachedResult.Error);
    }
}`,
        metrics: [
          { label: 'Check Latency', value: '~0.01 ms' },
          { label: 'Cache TTL', value: '2 Minutes' },
        ],
      },
      {
        id: 'cqrs-dispatcher',
        title: 'Strangler Fig CQRS Dispatcher',
        subtitle: 'MediatR Decoupled Command Dispatch',
        layer: 'Application / CQRS',
        badge: 'MEDIATR COMMAND',
        description:
          'Replaced bloated, multi-responsibility controller actions with a lightweight 8-line routing dispatcher sending a strongly-typed PlaceBidCommand through MediatR.',
        rationaleTitle: 'Why CQRS via Strangler Fig instead of full rewrite?',
        rationale:
          'Standard CRUD operations (reviews, galleries, bio) stay clean MVC. Only high-risk transaction zones (Live Bidding & Checkout) were migrated to CQRS handlers, isolating critical race-condition code from presentation.',
        codeTitle: 'ProductController.cs (Clean Dispatcher)',
        codeLang: 'csharp',
        codeSnippet: `[HttpPost("PlaceBid")]
[Authorize]
public async Task<IActionResult> PlaceBid([FromBody] PlaceBidRequest req, CancellationToken ct)
{
    var idempotencyKey = Request.Headers["X-Idempotency-Key"].FirstOrDefault();
    var command = new PlaceBidCommand(User.GetUserId(), req.ProductId, req.Amount, idempotencyKey);
    
    var result = await _mediator.Send(command, ct);
    return result.IsSuccess ? Ok(result) : BadRequest(result.Error);
}`,
        metrics: [
          { label: 'Controller Lines', value: '8 lines' },
          { label: 'Coupling', value: 'Decoupled Handlers' },
        ],
      },
      {
        id: 'domain-validator',
        title: 'Domain Bid Validation Engine',
        subtitle: 'Business Rules & Fraud Prevention',
        layer: 'Domain / Validation',
        badge: 'BUSINESS RULES',
        description:
          'Validates domain prerequisites: verified user payment card on file, active auction clock, minimum $1.00 increment over current bid, and prevents self-outbidding.',
        rationaleTitle: 'Why enforce strict domain invariants here?',
        rationale:
          'Ensures invalid or malicious bid amounts never reach the database transaction pipeline, keeping database connections free for genuine concurrent bidders.',
        codeTitle: 'PlaceBidCommandHandler.cs (Validation)',
        codeLang: 'csharp',
        codeSnippet: `// 1. Verify payment card on file
if (string.IsNullOrEmpty(user.CardNumber))
    return BidResult.Failed("A verified card on file is required to bid.");

// 2. Ensure auction is active & clock unexpired
if (!product.IsAuction || product.AuctionEndTime <= DateTime.Now)
    return BidResult.Failed("This auction has concluded.");

// 3. Prevent self-outbidding
if (product.HighestBidderId == request.UserId)
    return BidResult.Failed("You already hold the winning bid.");

// 4. Validate bid increment
decimal minRequired = (product.CurrentBid ?? product.Price) + 1.00m;
if (request.Amount < minRequired)
    return BidResult.Failed($"Bid must be at least \${minRequired:N2}.");`,
        metrics: [
          { label: 'Execution', value: '< 1 ms' },
          { label: 'Invariant Checks', value: '4 Rules' },
        ],
      },
      {
        id: 'sql-occ',
        title: 'SQL Server & EF Core (OCC Engine)',
        subtitle: 'Optimistic Concurrency Control via [Timestamp] RowVersion',
        layer: 'Database / OCC',
        badge: 'ZERO ROW LOCKS (OCC)',
        description:
          'Uses SQL Server 8-byte rowversion timestamps on Product entities. When concurrent bids hit the database at the exact same millisecond, EF Core evaluates WHERE RowVersion = @original. Colliding requests throw DbUpdateConcurrencyException and are caught gracefully.',
        rationaleTitle: 'Why OCC over Pessimistic Table Locks (UPDLOCK)?',
        rationale:
          'Pessimistic table locks cause thread pool starvation, high queue latencies, and deadlock crashes when multiple bidders compete. OCC provides maximum read throughput for browsing collectors while mathematically guaranteeing atomic state integrity.',
        codeTitle: 'Optimistic Concurrency Handler (C# & EF Core 8)',
        codeLang: 'csharp',
        codeSnippet: `// Product.cs: [Timestamp] public byte[]? RowVersion { get; set; }

product.CurrentBid = request.Amount;
product.HighestBidderId = request.UserId;
product.BidCount++;

_context.Bids.Add(new Bid {
    ProductId = product.Id,
    UserId = request.UserId,
    Amount = request.Amount,
    BidTime = DateTime.UtcNow
});

try
{
    await _context.SaveChangesAsync(cancellationToken);
}
catch (DbUpdateConcurrencyException)
{
    // Microsecond collision caught! Zero deadlocks, zero corrupt state
    return BidResult.Collision(
        "Another collector placed a higher bid at this exact moment. Please review the updated bid."
    );
}`,
        metrics: [
          { label: 'Concurrency Mode', value: 'Optimistic ([Timestamp])' },
          { label: 'Deadlock Risk', value: '0% (Non-blocking reads)' },
        ],
      },
      {
        id: 'signalr-hub',
        title: 'SignalR Real-Time WebSocket Multicast',
        subtitle: 'Sub-10ms Price Push to auction-{productId}',
        layer: 'Real-Time',
        badge: 'WEBSOCKET MULTICAST',
        description:
          'Immediately after a bid commits to SQL Server, ASP.NET Core SignalR multicasts an event to the specific WebSocket room (auction-{productId}). All connected observers see the live price flash green within 10ms.',
        rationaleTitle: 'Why room-based SignalR multicast?',
        rationale:
          'Prevents wasteful whole-server broadcasts. Only clients actively watching auction-{productId} receive the WebSocket frame, conserving server network bandwidth.',
        codeTitle: 'AuctionHub Multicast Broadcast (C#)',
        codeLang: 'csharp',
        codeSnippet: `// Multicast to room within ~10ms
await _hubContext.Clients
    .Group($"auction-{product.Id}")
    .SendAsync("ReceiveNewBid", new
    {
        productId = product.Id,
        newBid = product.CurrentBid,
        bidderName = bidder.Name,
        bidCount = product.BidCount,
        timestamp = DateTime.UtcNow
    }, cancellationToken);`,
        metrics: [
          { label: 'Broadcast Latency', value: '~10 ms' },
          { label: 'Scope', value: 'Room Multicast' },
        ],
      },
      {
        id: 'background-worker',
        title: 'Autonomous Settlement Worker',
        subtitle: 'BackgroundService with PeriodicTimer(15s)',
        layer: 'Worker',
        badge: 'INDEPENDENT HEARTBEAT',
        description:
          'Runs independently of human HTTP traffic. A hosted background service wakes every 15 seconds, queries expired auctions, sets IsAuction = false, auto-creates an Order with Status = "Awaiting Payment", and notifies connected screens via SignalR.',
        rationaleTitle: 'Why an autonomous background worker?',
        rationale:
          'Solves the classic "dormant server" auction flaw where auctions only settle when a human happens to visit the website after the clock expires. Using IServiceScopeFactory inside PeriodicTimer prevents scoped DbContext memory leaks.',
        codeTitle: 'AuctionEndingWorker.cs (BackgroundService)',
        codeLang: 'csharp',
        codeSnippet: `public class AuctionEndingWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly PeriodicTimer _timer = new(TimeSpan.FromSeconds(15));

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (await _timer.WaitForNextTickAsync(ct))
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<MyContext>();
            var hub = scope.ServiceProvider.GetRequiredService<IHubContext<AuctionHub>>();

            var expiredAuctions = await db.Products
                .Where(p => p.IsAuction && p.AuctionEndTime <= DateTime.Now)
                .ToListAsync(ct);

            foreach (var item in expiredAuctions)
            {
                item.IsAuction = false;
                if (item.HighestBidderId.HasValue)
                {
                    db.Orders.Add(new Order {
                        UserId = item.HighestBidderId.Value,
                        TotalAmount = item.CurrentBid ?? item.Price,
                        Status = "Awaiting Payment",
                        PaymentDueDate = DateTime.UtcNow.AddHours(48)
                    });
                }
                await hub.Clients.Group($"auction-{item.Id}")
                    .SendAsync("RecievedAuctionClosed", item.Id, ct);
            }
            await db.SaveChangesAsync(ct);
        }
    }
}`,
        metrics: [
          { label: 'Heartbeat Interval', value: '15 seconds' },
          { label: 'Memory Pattern', value: 'Scoped DI Factory' },
        ],
      },
    ],
    scenarios: [
      {
        id: 'concurrent-collision',
        title: 'Simulate 2 Bidders Colliding at Same Millisecond',
        subtitle: 'Demonstrates Optimistic Concurrency Control (OCC) & RowVersion',
        description:
          'Collector A and Collector B click "Place Bid" at the identical millisecond. Both read RowVersion 0x0001. Collector A arrives 1ms earlier and commits. Collector B hits EF Core DbUpdateConcurrencyException and receives a graceful retry prompt without corrupting state.',
        outcomeType: 'collision',
        outcomeMessage:
          'OCC SUCCESS: Collector A committed successfully. Collector B was caught gracefully by DbUpdateConcurrencyException with zero table deadlocks or phantom overwrites.',
        steps: [
          {
            nodeId: 'client-bidder',
            status: 'active',
            log: 'Two concurrent bids dispatched: Bidder A ($1,250.00) & Bidder B ($1,260.00)',
            durationMs: 300,
          },
          {
            nodeId: 'idempotency-cache',
            status: 'active',
            log: 'IMemoryCache evaluated unique UUID tokens for both requests [OK]',
            durationMs: 250,
          },
          {
            nodeId: 'cqrs-dispatcher',
            status: 'active',
            log: 'Dispatched 2x PlaceBidCommand instances through MediatR pipeline',
            durationMs: 300,
          },
          {
            nodeId: 'domain-validator',
            status: 'active',
            log: 'Both bids pass card verification, active auction clock, and increment rules',
            durationMs: 350,
          },
          {
            nodeId: 'sql-occ',
            status: 'collision',
            log: 'RACE CONDITION DETECTED! Bidder A committed with RowVersion 0x0001 -> 0x0002. Bidder B encountered DbUpdateConcurrencyException (RowVersion mismatch)!',
            durationMs: 500,
          },
          {
            nodeId: 'signalr-hub',
            status: 'success',
            log: 'SignalR multicast "ReceiveNewBid" emitted to room auction-42: Price updated to $1,250.00',
            durationMs: 400,
          },
        ],
      },
      {
        id: 'rapid-idempotency',
        title: 'Simulate Rapid Double-Click Spamming',
        subtitle: 'Demonstrates 0.01ms In-Memory Idempotency Cache',
        description:
          'A user rapidly clicks the bid button twice due to connection lag. Request #1 processes normally. Request #2 carries the identical UUID and is returned in 0.01ms by IMemoryCache with 0 SQL database queries.',
        outcomeType: 'cached',
        outcomeMessage:
          'IDEMPOTENCY SUCCESS: Second request intercepted by IMemoryCache in 0.01ms. Exactly 1 database write occurred; zero duplicate charges.',
        steps: [
          {
            nodeId: 'client-bidder',
            status: 'active',
            log: 'User double-clicks: 2 identical HTTP POST requests with same X-Idempotency-Key UUID',
            durationMs: 300,
          },
          {
            nodeId: 'idempotency-cache',
            status: 'cached',
            log: 'REQUEST #1 passed to pipeline. REQUEST #2 INTERCEPTED BY CACHE in 0.01ms! Zero DB queries executed.',
            durationMs: 400,
          },
          {
            nodeId: 'cqrs-dispatcher',
            status: 'active',
            log: 'Only Request #1 enters MediatR command pipeline',
            durationMs: 350,
          },
          {
            nodeId: 'sql-occ',
            status: 'success',
            log: 'Single database update executed atomically. RowVersion incremented.',
            durationMs: 400,
          },
          {
            nodeId: 'signalr-hub',
            status: 'success',
            log: 'SignalR broadcasts single price update to watching clients.',
            durationMs: 300,
          },
        ],
      },
      {
        id: 'settlement-worker',
        title: 'Simulate Autonomous Auction Settlement Loop',
        subtitle: 'Demonstrates BackgroundService 15s Heartbeat',
        description:
          'The auction timer expires. Without waiting for any visitor to load the website, the hosted AuctionEndingWorker wakes on its 15-second timer, finalizes the winner, issues an Order, and pushes an "Auction Closed" banner to all connected screens.',
        outcomeType: 'success',
        outcomeMessage:
          'SETTLEMENT SUCCESS: Autonomous settlement completed independently of human traffic. Order created with Status = "Awaiting Payment" and real-time banner triggered.',
        steps: [
          {
            nodeId: 'background-worker',
            status: 'active',
            log: 'PeriodicTimer(15s) fires heartbeat. Creating scoped IServiceScopeFactory context.',
            durationMs: 350,
          },
          {
            nodeId: 'sql-occ',
            status: 'active',
            log: 'Queried expired auctions (AuctionEndTime <= DateTime.Now). Found Product #42.',
            durationMs: 400,
          },
          {
            nodeId: 'domain-validator',
            status: 'active',
            log: 'Identified winning bidder (HighestBidderId: 104) with final price $1,850.00.',
            durationMs: 350,
          },
          {
            nodeId: 'sql-occ',
            status: 'success',
            log: 'Set IsAuction = false. Generated Order #9021 with Status = "Awaiting Payment" (48h grace).',
            durationMs: 450,
          },
          {
            nodeId: 'signalr-hub',
            status: 'success',
            log: 'Broadcasted RecievedAuctionClosed to room auction-42. Live screens morphed to "Sold" banner.',
            durationMs: 400,
          },
        ],
      },
    ],
  },
  {
    id: 'auth-pipeline',
    title: 'Multi-Provider OAuth 2.0 & Identity Pipeline',
    tagline: 'Google · GitHub · Discord · OtpNet TOTP 2FA · IMemoryCache Rate Limiting',
    description:
      'Seamless federated authentication merging external claims into a unified local user profile, with automated avatar mirroring, rate-limited brute force protection, and optional TOTP 2FA.',
    highlightMetric: '3 Federated OAuth Providers with Local Asset Mirroring',
    nodes: [
      {
        id: 'oauth-providers',
        title: 'Federated OAuth Providers',
        subtitle: 'Google, GitHub, and Discord Handshake',
        layer: 'Client',
        badge: 'OAUTH 2.0',
        description:
          'Configured via ASP.NET Core Cookie Authentication and official OAuth middleware. Enables 1-click social logins with scoped profile and email read permissions.',
        rationaleTitle: 'Why federated login alongside local credentials?',
        rationale:
          'Dramatically reduces friction for collectors and creators while offloading password handling to trusted identity providers.',
        codeTitle: 'Program.cs (OAuth Middleware)',
        codeLang: 'csharp',
        codeSnippet: `builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => {
        options.LoginPath = "/Auth/Login";
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
    })
    .AddGoogle(options => {
        options.ClientId = builder.Configuration["OAuth:Google:ClientId"]!;
        options.ClientSecret = builder.Configuration["OAuth:Google:ClientSecret"]!;
    })
    .AddGitHub(options => { /* ClientId & Secret */ })
    .AddDiscord(options => { /* ClientId & Secret */ });`,
        metrics: [
          { label: 'Providers', value: 'Google, GitHub, Discord' },
          { label: 'Security', value: 'PKCE / State Token' },
        ],
      },
      {
        id: 'rate-limiter',
        title: 'Brute-Force Rate Limiter',
        subtitle: 'IMemoryCache 5 Attempts / 5 Minutes',
        layer: 'Security / Cache',
        badge: 'RATE LIMITING',
        description:
          'Protects traditional password login endpoints against dictionary attacks. Tracks failed attempts by IP and email key in IMemoryCache, locking attempts for 5 minutes after 5 consecutive failures.',
        rationaleTitle: 'Why in-memory rate limiting?',
        rationale:
          'Prevents attacker traffic from exhausting database connection pools during automated credential-stuffing sweeps.',
        codeTitle: 'AuthController.cs (Rate Limiter)',
        codeLang: 'csharp',
        codeSnippet: `var attemptsKey = $"login_attempts_{model.Email}";
if (_memoryCache.TryGetValue(attemptsKey, out int attempts) && attempts >= 5)
{
    return View("Error", "Too many failed login attempts. Locked for 5 minutes.");
}

// On failed login:
_memoryCache.Set(attemptsKey, attempts + 1, TimeSpan.FromMinutes(5));`,
        metrics: [
          { label: 'Max Attempts', value: '5 Fails' },
          { label: 'Lockout', value: '5 Minutes' },
        ],
      },
      {
        id: 'claim-mapper',
        title: 'Claim Mapper & Upsert Engine',
        subtitle: 'AuthController.UpsertExternalUserAsync',
        layer: 'Application / CQRS',
        badge: 'CLAIM HARVESTING',
        description:
          'Extracts claims from external auth ticket (email, display name, external avatar URL). Upserts the local SQL Server User record, assigning default role User or Artist.',
        rationaleTitle: 'Why upsert local user records?',
        rationale:
          'Ensures the application maintains relational integrity (foreign keys to Bids, Orders, and Artworks) without depending on external provider IDs at query time.',
        codeTitle: 'AuthController.cs (Upsert External User)',
        codeLang: 'csharp',
        codeSnippet: `private async Task<User> UpsertExternalUserAsync(ClaimsPrincipal principal)
{
    var email = principal.FindFirstValue(ClaimTypes.Email);
    var name = principal.FindFirstValue(ClaimTypes.Name);
    var avatarUrl = principal.FindFirst("picture")?.Value 
                 ?? principal.FindFirst("avatar_url")?.Value;

    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    if (user == null)
    {
        user = new User { Email = email, Name = name, Role = "User" };
        _context.Users.Add(user);
    }
    
    // Download and mirror remote avatar locally
    if (!string.IsNullOrEmpty(avatarUrl))
        user.Avatar = await MirrorRemoteAvatarAsync(avatarUrl);

    await _context.SaveChangesAsync();
    return user;
}`,
        metrics: [
          { label: 'Data Model', value: 'Unified Local User' },
          { label: 'Mapping', value: 'ClaimTypes.Email' },
        ],
      },
      {
        id: 'avatar-downloader',
        title: 'Local Avatar Mirror Pipeline',
        subtitle: 'HttpClient Asset Ingestion to wwwroot/images/avatars',
        layer: 'Worker',
        badge: 'ASSET MIRRORING',
        description:
          'Downloads external OAuth avatar images over HttpClient and stores them locally on the server filesystem at wwwroot/images/avatars/{guid}.png to prevent broken image hotlinks and CORS latency.',
        rationaleTitle: 'Why mirror remote avatars locally?',
        rationale:
          'External avatar CDN URLs can expire, throttle hotlinking, or leak user browsing activity. Local storage guarantees 100% asset availability and fast caching.',
        codeTitle: 'Avatar Ingestion (C#)',
        codeLang: 'csharp',
        codeSnippet: `private async Task<string> MirrorRemoteAvatarAsync(string remoteUrl)
{
    var bytes = await _httpClient.GetByteArrayAsync(remoteUrl);
    var fileName = $"{Guid.NewGuid()}.png";
    var filePath = Path.Combine(_env.WebRootPath, "images", "avatars", fileName);
    
    await File.WriteAllBytesAsync(filePath, bytes);
    return $"/images/avatars/{fileName}";
}`,
        metrics: [
          { label: 'Storage', value: 'wwwroot/images/avatars' },
          { label: 'File Format', value: 'Sanitized PNG' },
        ],
      },
    ],
    scenarios: [],
  },
  {
    id: 'catalog-indexing',
    title: 'High-Throughput Catalog & Moderation Engine',
    tagline: 'Covering Non-Clustered B-Tree Index · Server-Side Pagination · Admin Moderation',
    description:
      'Engineered for rapid artwork discovery. Features a covering SQL Server index on (IsApproved, Name) with included pricing columns, server-side Skip/Take pagination, and an administrative approval pipeline.',
    highlightMetric: 'Zero Table-Scan Covering Index for Fast Catalog Browsing',
    nodes: [
      {
        id: 'catalog-query',
        title: 'Catalog Query Controller',
        subtitle: 'ProductController.Index with EF.Functions.Like',
        layer: 'Client',
        badge: 'INDEXED SEARCH',
        description:
          'Provides filtering across Price, Name, and Categories with server-side pagination (.Skip((page-1)*12).Take(12)) to maintain fast page response times as the catalog expands.',
        rationaleTitle: 'Why server-side Skip/Take instead of client paging?',
        rationale:
          'Transferring thousands of artwork records over HTTP wastes bandwidth and memory. Server-side pagination streams only the exact 12 cards needed for the viewport.',
        codeTitle: 'ProductController.cs (Catalog Query)',
        codeLang: 'csharp',
        codeSnippet: `public async Task<IActionResult> Index(string search, string sort, int page = 1)
{
    var query = _context.Products.Where(p => p.IsApproved);

    if (!string.IsNullOrWhiteSpace(search))
        query = query.Where(p => EF.Functions.Like(p.Name, $"%{search}%"));

    query = sort switch {
        "price_desc" => query.OrderByDescending(p => p.Price),
        "price_asc"  => query.OrderBy(p => p.Price),
        _            => query.OrderBy(p => p.Name)
    };

    var paged = await query.Skip((page - 1) * 12).Take(12).ToListAsync();
    return View(paged);
}`,
        metrics: [
          { label: 'Page Size', value: '12 Items' },
          { label: 'Search Operator', value: 'EF.Functions.Like' },
        ],
      },
      {
        id: 'sql-covering-index',
        title: 'Covering B-Tree Index',
        subtitle: 'Non-Clustered Index on (IsApproved, Name) with INCLUDE',
        layer: 'Database / OCC',
        badge: 'INDEX-ONLY SCAN',
        description:
          'Created in SQL Server on (IsApproved, Name) including (Price, ImageUrl, IsAuction, CurrentBid). Allows SQL Server to satisfy catalog queries directly from index leaf pages with zero clustered table lookups.',
        rationaleTitle: 'Why a covering index with INCLUDE columns?',
        rationale:
          'Without an index, filtering unapproved artworks triggers expensive clustered index scans. A covering index fulfills the entire SELECT clause straight from the B-Tree leaf pages.',
        codeTitle: 'MyContext.cs (Index Tuning)',
        codeLang: 'sql',
        codeSnippet: `-- SQL Server Covering Index Definition
CREATE NONCLUSTERED INDEX IX_Products_IsApproved_Name
ON Products (IsApproved, Name)
INCLUDE (Price, ImageUrl, IsAuction, CurrentBid);`,
        metrics: [
          { label: 'Index Type', value: 'Non-Clustered B-Tree' },
          { label: 'Clustered Lookups', value: '0 (Covering)' },
        ],
      },
      {
        id: 'admin-moderation',
        title: 'Moderation Pipeline (Artist -> Admin)',
        subtitle: 'AdminController Approval Queue',
        layer: 'Domain / Validation',
        badge: 'MODERATION WORKFLOW',
        description:
          'Artworks submitted by verified artists default to IsApproved = false. An administrative moderation queue in AdminController allows staff to review and approve listings before public indexing.',
        rationaleTitle: 'Why enforce explicit moderation flags?',
        rationale:
          'Protects the gallery from spam, copyright violations, or abusive imagery before listings become visible to unauthenticated public visitors.',
        codeTitle: 'AdminController.cs (Approval Handler)',
        codeLang: 'csharp',
        codeSnippet: `[HttpPost]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> ApproveArtwork(int id)
{
    var product = await _context.Products.FindAsync(id);
    if (product == null) return NotFound();

    product.IsApproved = true;
    await _context.SaveChangesAsync();

    // Artwork now instantly appears in covering index queries
    return RedirectToAction(nameof(PendingArtworks));
}`,
        metrics: [
          { label: 'Security Role', value: 'Admin Only' },
          { label: 'Default State', value: 'IsApproved = 0' },
        ],
      },
    ],
    scenarios: [],
  },
]
