export interface CapabilityGroup {
  index: string
  title: string
  subtitle: string
  description: string
  items: string[]
  keyFocus: string
  specSnippet: {
    title: string
    lang: string
    code: string
  }
}

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    index: '01',
    title: 'Backend & Core',
    subtitle: 'SERVER RUNTIMES & APIS',
    description:
      'Building scalable web applications and robust APIs with clean architecture, strong typing, and production-grade reliability.',
    items: [
      'C#',
      '.NET 8',
      'ASP.NET Core (MVC & Web API)',
      'CQRS / MediatR',
      'EF Core 8',
      'Dart & Supabase RPCs',
      'Idempotent APIs',
    ],
    keyFocus: 'Clean architecture, idempotent API design, and maintainable business logic.',
    specSnippet: {
      title: 'PlaceBidCommandHandler.cs (CQRS & OCC)',
      lang: 'csharp',
      code: `public class PlaceBidCommandHandler : IRequestHandler<PlaceBidCommand, BidResult>
{
    private readonly MyContext _context;
    private readonly IMemoryCache _cache;

    public async Task<BidResult> Handle(PlaceBidCommand cmd, CancellationToken ct)
    {
        if (_cache.TryGetValue($"bid_{cmd.IdempotencyKey}", out BidResult? cached))
            return cached!;

        var product = await _context.Products.FindAsync([cmd.ProductId], ct);
        if (product == null || !product.IsAuction) return BidResult.Failed("Closed");

        product.CurrentBid = cmd.Amount;
        product.HighestBidderId = cmd.UserId;
        product.BidCount++;

        try {
            await _context.SaveChangesAsync(ct);
            return BidResult.Success(product.CurrentBid.Value);
        } catch (DbUpdateConcurrencyException) {
            return BidResult.Collision("Colliding bid detected. Please retry.");
        }
    }
}`,
    },
  },
  {
    index: '02',
    title: 'Database & Security',
    subtitle: 'PERSISTENCE & ACCESS CONTROL',
    description:
      'Designing relational schemas, optimizing query indexing, and enforcing multi-provider authentication and role-based access control.',
    items: [
      'SQL Server',
      'PostgreSQL 15',
      'Row-Level Security (RLS)',
      'Optimistic Concurrency (RowVersion)',
      'Covering B-Tree Indexes',
      'ASP.NET Core Identity & OAuth 2.0',
      'TOTP 2FA (OtpNet)',
    ],
    keyFocus: 'Relational schema design, query indexing, and secure authentication.',
    specSnippet: {
      title: 'IX_Products_CoveringIndex.sql',
      lang: 'sql',
      code: `-- High-throughput covering index eliminates clustered table lookups
CREATE NONCLUSTERED INDEX IX_Products_IsApproved_Name
ON Products (IsApproved, Name)
INCLUDE (Price, ImageUrl, IsAuction, CurrentBid);

-- Product table OCC timestamp column
ALTER TABLE Products 
ADD RowVersion ROWVERSION NOT NULL;`,
    },
  },
  {
    index: '03',
    title: 'Frontend & UI',
    subtitle: 'CLIENT INTERFACES & STYLING',
    description:
      'Crafting fast, responsive interfaces that communicate seamlessly with backend services using modern component architecture.',
    items: [
      'Flutter 3.27+ (Cross-Platform)',
      'Riverpod 3.x',
      'TypeScript',
      'React 19',
      'Tailwind CSS v4',
      'SignalR WebSockets',
      'HTML5 & CSS3',
    ],
    keyFocus: 'Responsive design, clean component hierarchy, and fast user interactions.',
    specSnippet: {
      title: 'IdempotentBidDispatch.ts',
      lang: 'typescript',
      code: `// Client-side UUID idempotency & SignalR room subscription
export async function placeIdempotentBid(productId: number, amount: number) {
  const idempotencyKey = crypto.randomUUID();
  const res = await fetch('/Product/PlaceBid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Idempotency-Key': idempotencyKey
    },
    body: JSON.stringify({ productId, amount })
  });
  return res.json();
}`,
    },
  },
  {
    index: '04',
    title: 'Tools & Workflow',
    subtitle: 'DEVELOPMENT & COLLABORATION',
    description:
      'Employing industry-standard developer tooling to write, inspect, test, and ship maintainable software with confidence.',
    items: [
      'BackgroundService',
      'PeriodicTimer (15s)',
      'Git & GitHub',
      'Visual Studio',
      'Postman',
      'Query Profiling',
    ],
    keyFocus: 'Version control workflows, API endpoint testing, and code maintainability.',
    specSnippet: {
      title: 'AuctionEndingWorker.cs (BackgroundService)',
      lang: 'csharp',
      code: `public class AuctionEndingWorker : BackgroundService
{
    private readonly PeriodicTimer _timer = new(TimeSpan.FromSeconds(15));
    private readonly IServiceScopeFactory _scopeFactory;

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (await _timer.WaitForNextTickAsync(ct))
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<MyContext>();
            var expired = await db.Products
                .Where(p => p.IsAuction && p.AuctionEndTime <= DateTime.Now)
                .ToListAsync(ct);

            foreach (var item in expired) {
                item.IsAuction = false;
                // Auto-create order without human intervention
            }
            await db.SaveChangesAsync(ct);
        }
    }
}`,
    },
  },
]
