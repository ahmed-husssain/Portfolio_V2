import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Sparkles, Check, Copy } from 'pixelarticons/react'

interface SlideContent {
  id: string
  badge: string
  title: string
  subtitle: string
  accentColor: string
  motto: string
  rule: string
  analogyTitle?: string
  analogyText?: string
  ruleTip?: string
  badLabel?: string
  badCode?: string
  goodLabel?: string
  goodCode?: string
  anchor?: string
  isDecisionGuide?: boolean
  usePoints?: { title: string; desc: string }[]
  skipPoints?: { title: string; desc: string }[]
}

const SLIDES: SlideContent[] = [
  {
    id: 'srp',
    badge: 'S',
    title: 'Single Responsibility Principle',
    subtitle: 'One Class = One Job',
    accentColor: '#10b981',
    motto: 'Cohesion & Scope',
    rule: 'A class should have only one reason to change. Never mix your core business logic with saving files or database queries.',
    analogyTitle: 'Think of a Restaurant',
    analogyText:
      'A chef cooks meals. A waiter serves tables. If the chef has to stop cooking to drive food deliveries around town, the kitchen falls into chaos.',
    ruleTip:
      'Keep your data (User) separate from where you save it (UserFileSaver). Changing your database will never break your user logic.',
    badLabel: 'What NOT To Do: 1 Class Doing 2 Jobs',
    badCode: `public class User {
    public string Name { get; set; }
    public void ChangeName(string n) => Name = n;

    // ❌ Why is User saving files? That's not its job!
    public void SaveToFile() => 
        File.WriteAllText("user.txt", Name);
}`,
    goodLabel: 'The Clean Way: Separate Responsibilities',
    goodCode: `public class User {
    public string Name { get; set; }
    public void ChangeName(string n) => Name = n;
}

// ✅ Only responsible for storage. User stays clean and safe!
public class UserFileSaver {
    public void Save(User u) => 
        File.WriteAllText("user.txt", u.Name);
}`,
    anchor: '#1-s--single-responsibility-principle-srp',
  },
  {
    id: 'ocp-lsp',
    badge: 'O + L',
    title: 'Open/Closed & Liskov Substitution',
    subtitle: 'Extension & Honest Subtypes',
    accentColor: '#8b5cf6',
    motto: 'Plug In, Don’t Hack In',
    rule: 'Add new features by creating new classes — never by hacking and re-opening old code that already works. And child classes must never break parent expectations.',
    analogyTitle: 'Smartphone & The Toy Duck',
    analogyText:
      'To add an app to your phone, you don’t open it with a screwdriver and solder chips. You install an app that plugs into standard APIs. And if a toy duck needs batteries to swim and sinks in a real pond, calling it a real duck breaks trust!',
    ruleTip:
      'When adding Crypto payment, create a new class. And if a child class throws NotImplementedException, prefer composition over inheritance.',
    badLabel: 'What NOT To Do: Modifying Tested Code & Broken Subtypes',
    badCode: `// ❌ Editing working code every time you add a feature:
if (method == "Card") PayWithCard();
else if (method == "Crypto") PayWithCrypto(); // Risks breaking checkout!

// ❌ Broken Liskov contract:
public class ToyDuck : Duck {
    public override void Fly() => throw new NotImplementedException();
}`,
    goodLabel: 'The Clean Way: Interface Plugins & Composition',
    goodCode: `// ✅ Plug-in new payments without touching existing code:
public interface IPaymentMethod { void Pay(); }
public class CryptoPayment : IPaymentMethod { public void Pay() => SendCrypto(); }

// ✅ Honest contract: Only inherit what the object can actually do
public interface ISwimmer { void Swim(); }
public class ToyBoat : ISwimmer { public void Swim() => FloatMotor(); }`,
    anchor: '#2-o--open--closed-principle-ocp',
  },
  {
    id: 'isp-dip',
    badge: 'I + D',
    title: 'Interface Segregation & Dependency Inversion',
    subtitle: 'Lean Contracts & Decoupling',
    accentColor: '#0284c7',
    motto: 'Pass Tools In, Don’t Hardcode',
    rule: 'Prefer tiny, focused interfaces over giant kitchen-sink interfaces. And never use "new Database()" inside your classes — pass tools in from the outside so you can test easily.',
    analogyTitle: 'Espresso Counter & Wall Socket',
    analogyText:
      'When you order an espresso, you aren’t forced to sign for a 5-tier wedding banquet package. And your charger plugs into a wall socket; if you soldered your laptop directly into the wall wires, you’d be trapped forever.',
    ruleTip:
      'In .NET, IDisposable has only 1 method for a reason. And ask for IDatabase in your constructor so you can pass fake test data in unit tests.',
    badLabel: 'What NOT To Do: Bloated Interfaces & Hardcoded SQL',
    badCode: `// ❌ Bloated interface forces unneeded methods:
public interface IWorker { void Code(); void Cook(); void FlyPlane(); }

// ❌ Hardcoded SQL database: Impossible to unit test in isolation!
public class OrderService {
    private SqlServerDb _db = new SqlServerDb();
}`,
    goodLabel: 'The Clean Way: Lean Interfaces & Constructor Injection',
    goodCode: `// ✅ Small, purpose-built interfaces:
public interface ICoder { void Code(); }

// ✅ Pass IDatabase in constructor: Real SQL in production, Fake in tests!
public class OrderService {
    private readonly IDatabase _db;
    public OrderService(IDatabase db) => _db = db;
}`,
    anchor: '#4-i--interface-segregation-principle-isp',
  },
  {
    id: 'use-vs-skip',
    badge: 'GUIDE',
    title: 'When to USE SOLID (And When to SKIP It)',
    subtitle: 'The Pragmatic Senior Rule',
    accentColor: '#059669',
    motto: 'Pragmatic Engineering',
    rule: 'SOLID is not a religion. It is a set of defensive habits. Use it where code changes frequently; skip it where simple direct code gets the job done.',
    isDecisionGuide: true,
    usePoints: [
      {
        title: '1. Core Business Logic',
        desc: 'Payments, checkout, billing — parts that change frequently with new business rules.',
      },
      {
        title: '2. Code Needing Unit Tests',
        desc: 'You cannot write automated tests if classes hardcode database calls with "new".',
      },
      {
        title: '3. Multi-Developer Teams',
        desc: 'Small, focused classes let multiple developers ship features without git merge conflicts.',
      },
      {
        title: '4. Long-Term Production Apps',
        desc: 'Enterprise systems that will live and grow for years need modular, safe seams.',
      },
    ],
    skipPoints: [
      {
        title: '1. Quick MVPs & Prototypes',
        desc: 'Testing an idea over the weekend? Write the simplest direct code. Speed to launch matters.',
      },
      {
        title: '2. Simple CRUD Endpoints',
        desc: 'If a feature just queries a table and returns JSON, 4 interface layers is pure waste.',
      },
      {
        title: '3. One-Time Scripts',
        desc: 'Data import utilities or database migration scripts that run once and are thrown away.',
      },
      {
        title: '4. Before You Know The Pattern',
        desc: 'Never create an interface until you have a 2nd implementation. Duplication is cheaper than the wrong abstraction!',
      },
    ],
    anchor: '#when-to-use-solid',
  },
]

export default function SolidCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const slide = SLIDES[currentIndex]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    if (diff > 50) handleNext()
    if (diff < -50) handlePrev()
    setTouchStart(null)
  }

  return (
    <div
      className="my-10 border border-border bg-surface rounded-2xl pixel-corners overflow-hidden shadow-sm"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3.5 bg-page/80 border-b border-border">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: slide.accentColor }}
            aria-hidden="true"
          />
          <span className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">
            SOLID IN PLAIN ENGLISH
          </span>
          <span className="text-border-strong">·</span>
          <span className="font-mono text-xs text-muted">
            SLIDE 0{currentIndex + 1} OF 0{SLIDES.length}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <span>Use ← → keys or swipe</span>
        </div>
      </div>

      {/* Segmented Capsule Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 p-1.5 bg-page/40 border-b border-border gap-1">
        {SLIDES.map((s, idx) => {
          const isSelected = idx === currentIndex
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`py-2 px-2.5 text-center transition-all cursor-pointer rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-foreground text-page font-bold shadow-xs'
                  : 'text-secondary hover:text-foreground hover:bg-surface/60'
              }`}
            >
              <span>{s.badge}</span>
              <span className="truncate hidden md:inline">
                {idx === 0
                  ? 'Single Resp.'
                  : idx === 1
                  ? 'Open/Closed & Liskov'
                  : idx === 2
                  ? 'Interfaces & DI'
                  : 'Use vs Skip'}
              </span>
            </button>
          )
        })}
      </div>

      {/* Slide Content Card */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Title & Rule Row */}
        <div className="space-y-3 pb-5 border-b border-border">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border"
              style={{
                backgroundColor: `${slide.accentColor}15`,
                color: slide.accentColor,
                borderColor: `${slide.accentColor}40`,
              }}
            >
              {slide.motto}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {slide.title}
          </h3>

          <p className="text-base font-medium text-foreground leading-snug">
            “{slide.rule}”
          </p>
        </div>

        {/* Slide Body: Code Snippet Split OR Decision Guide */}
        {!slide.isDecisionGuide ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Metaphors & Practical Rule (5 cols) */}
            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-4 rounded-xl border border-border bg-page/60 space-y-1.5">
                <span className="font-semibold text-foreground flex items-center gap-1.5 font-sans">
                  <span>💡</span> {slide.analogyTitle}
                </span>
                <p className="text-secondary leading-relaxed font-sans">
                  {slide.analogyText}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-page/60 space-y-1.5">
                <span className="font-semibold text-foreground flex items-center gap-1.5 font-sans">
                  <span>⚡</span> The Simple Rule
                </span>
                <p className="text-secondary leading-relaxed font-sans">
                  {slide.ruleTip}
                </p>
              </div>
            </div>

            {/* Right: Authentic C# Code Snippets (7 cols) */}
            <div className="lg:col-span-7 space-y-3 font-mono text-xs">
              {/* Bad Snippet */}
              <div className="rounded-xl border border-rose-500/25 bg-black/60 overflow-hidden text-slate-200">
                <div className="flex items-center justify-between px-3.5 py-2 bg-rose-500/10 border-b border-rose-500/20 text-[11px]">
                  <span className="text-rose-400 font-bold font-sans flex items-center gap-1.5">
                    <span>❌</span> {slide.badLabel}
                  </span>
                  {slide.badCode && (
                    <button
                      type="button"
                      onClick={() => handleCopy(slide.badCode!, `bad-${slide.id}`)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === `bad-${slide.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
                <pre className="p-3 text-[11px] sm:text-xs leading-relaxed overflow-x-auto text-slate-300">
                  <code>{slide.badCode}</code>
                </pre>
              </div>

              {/* Good Snippet */}
              <div className="rounded-xl border border-emerald-500/25 bg-black/60 overflow-hidden text-slate-200">
                <div className="flex items-center justify-between px-3.5 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-[11px]">
                  <span className="text-emerald-400 font-bold font-sans flex items-center gap-1.5">
                    <span>✅</span> {slide.goodLabel}
                  </span>
                  {slide.goodCode && (
                    <button
                      type="button"
                      onClick={() => handleCopy(slide.goodCode!, `good-${slide.id}`)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === `good-${slide.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
                <pre className="p-3 text-[11px] sm:text-xs leading-relaxed overflow-x-auto text-slate-300">
                  <code>{slide.goodCode}</code>
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* Slide 4: When to USE vs When to SKIP */
          <div className="space-y-4">
            {/* Green Box: When to USE */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span>🟢</span> 4 TIMES TO ALWAYS USE SOLID:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {slide.usePoints?.map((pt) => (
                  <div
                    key={pt.title}
                    className="p-2.5 rounded-lg border border-border bg-surface/80 space-y-0.5"
                  >
                    <strong className="text-foreground block">{pt.title}</strong>
                    <p className="text-secondary text-[11px] leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Box: When to SKIP */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2.5">
              <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <span>🔴</span> 4 TIMES TO SKIP SOLID (AVOID OVER-ENGINEERING):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {slide.skipPoints?.map((pt) => (
                  <div
                    key={pt.title}
                    className="p-2.5 rounded-lg border border-border bg-surface/80 space-y-0.5"
                  >
                    <strong className="text-foreground block">{pt.title}</strong>
                    <p className="text-secondary text-[11px] leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Golden Rule Callout */}
            <div className="p-3.5 rounded-xl border border-border bg-page/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-foreground shrink-0" />
                <p className="text-secondary leading-snug">
                  <strong className="text-foreground">The Senior Rule:</strong>{' '}
                  Duplication is far cheaper than the wrong abstraction. Solve today's real problem first.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-border bg-page hover:bg-surface text-secondary hover:text-foreground transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>PREV</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-border bg-page hover:bg-surface text-secondary hover:text-foreground transition-all cursor-pointer active:scale-95"
            >
              <span>NEXT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {slide.anchor && (
              <a
                href={slide.anchor}
                className="text-secondary hover:text-foreground font-semibold transition-colors flex items-center gap-1"
              >
                <span>Read detailed section</span>
                <span>↓</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
