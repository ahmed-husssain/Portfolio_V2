interface SheetRow {
  letter: 'S' | 'O' | 'L' | 'I' | 'D'
  name: string
  motto: string
  rule: string
  analogy: string
  tip: string
  accentColor: string
}

const CHEAT_SHEET: SheetRow[] = [
  {
    letter: 'S',
    name: 'Single Responsibility',
    motto: 'One Class = One Job',
    rule: 'A class should have only one job to do. Never mix your business logic with saving files or database queries.',
    analogy: 'A chef cooks meals; a waiter serves tables. Never make the chef leave the kitchen to drive delivery orders.',
    tip: 'Keep your data (User) separate from where you save it (UserFileSaver).',
    accentColor: '#10b981',
  },
  {
    letter: 'O',
    name: 'Open / Closed',
    motto: 'Plug In, Don’t Hack In',
    rule: 'Add new features by creating new classes — never by hacking and editing old code that already works.',
    analogy: 'When you want a flashlight on your phone, you download an app. You don’t solder new chips inside.',
    tip: 'Create a new CryptoPayment class instead of adding more "else if" lines to your checkout file.',
    accentColor: '#8b5cf6',
  },
  {
    letter: 'L',
    name: 'Liskov Substitution',
    motto: 'Never Break Child Trust',
    rule: 'A child class must be able to replace its parent without throwing unexpected errors or breaking code.',
    analogy: 'If it looks like a duck but needs batteries and sinks in water, calling it a real duck breaks trust.',
    tip: 'Never inherit just to throw NotImplementedException. Use composition instead.',
    accentColor: '#f59e0b',
  },
  {
    letter: 'I',
    name: 'Interface Segregation',
    motto: 'Small, Focused Contracts',
    rule: 'Prefer 3 tiny, focused interfaces over 1 giant "kitchen-sink" interface that forces empty methods.',
    analogy: 'When buying an espresso, you only pay for coffee — not a contract for a 5-course wedding buffet.',
    tip: 'In .NET, IDisposable has only 1 method (Dispose). Keep your own interfaces just as lean.',
    accentColor: '#0284c7',
  },
  {
    letter: 'D',
    name: 'Dependency Inversion',
    motto: 'Pass Tools In, Don’t Hardcode',
    rule: 'Never hardcode "new Database()" inside your classes. Pass tools in through the constructor so you can test easily.',
    analogy: 'Your charger plugs into any wall socket. If you soldered your laptop into wall wires, you’re stuck forever.',
    tip: 'Ask for IDatabase in your constructor so you can use real SQL in production and fake test data in unit tests.',
    accentColor: '#2563eb',
  },
]

export default function SolidCheatSheet() {
  return (
    <div className="my-8 border border-border bg-surface rounded-xl pixel-corners overflow-hidden shadow-xs">
      {/* Static Header Bar — Pure Information, No Buttons */}
      <div className="px-5 py-3.5 bg-page/90 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-foreground/70" aria-hidden="true" />
          <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
            SOLID SUMMARY CHEAT SHEET
          </span>
          <span className="text-border-strong hidden sm:inline">·</span>
          <span className="text-muted font-mono text-xs hidden sm:inline">
            5 Core Principles at a Glance
          </span>
        </div>
        <span className="text-xs font-mono text-muted">Plain English Reference</span>
      </div>

      {/* Desktop Scannable Table (md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-page/60 border-b border-border text-foreground font-mono text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-[220px]">Principle</th>
              <th className="py-3 px-4">In Plain English</th>
              <th className="py-3 px-4">Real-World Picture</th>
              <th className="py-3 px-4">Practical Rule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {CHEAT_SHEET.map((row) => (
              <tr key={row.letter} className="hover:bg-page/40 transition-colors">
                {/* Principle Column */}
                <td className="py-3.5 px-4 align-top">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-2xs"
                      style={{
                        backgroundColor: `${row.accentColor}18`,
                        color: row.accentColor,
                        border: `1px solid ${row.accentColor}35`,
                      }}
                    >
                      {row.letter}
                    </span>
                    <div>
                      <span className="font-bold text-foreground block leading-tight">
                        {row.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted block mt-0.5">
                        {row.motto}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Rule Column */}
                <td className="py-3.5 px-4 align-top text-secondary leading-relaxed">
                  {row.rule}
                </td>

                {/* Analogy Column */}
                <td className="py-3.5 px-4 align-top text-secondary leading-relaxed">
                  <span className="font-semibold text-foreground mr-1">💡</span>
                  {row.analogy}
                </td>

                {/* Practical Tip Column */}
                <td className="py-3.5 px-4 align-top text-secondary leading-relaxed font-mono text-[11px]">
                  <span className="font-semibold text-foreground mr-1 font-sans">⚡</span>
                  {row.tip}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards (below md) */}
      <div className="md:hidden divide-y divide-border">
        {CHEAT_SHEET.map((row) => (
          <div key={row.letter} className="p-4 space-y-2.5 bg-surface text-xs">
            <div className="flex items-center gap-2.5">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-2xs"
                style={{
                  backgroundColor: `${row.accentColor}18`,
                  color: row.accentColor,
                  border: `1px solid ${row.accentColor}35`,
                }}
              >
                {row.letter}
              </span>
              <div>
                <strong className="text-foreground text-sm block leading-tight">
                  {row.name}
                </strong>
                <span className="font-mono text-[10px] text-muted">
                  {row.motto}
                </span>
              </div>
            </div>

            <p className="text-secondary leading-relaxed pt-1">
              <strong className="text-foreground font-semibold">Rule: </strong>
              {row.rule}
            </p>

            <div className="p-2.5 rounded-lg border border-border bg-page/50 space-y-1">
              <p className="text-secondary leading-relaxed">
                <span className="mr-1">💡</span>
                <strong className="text-foreground">Picture: </strong>
                {row.analogy}
              </p>
              <p className="text-secondary leading-relaxed font-mono text-[11px] pt-1 border-t border-border/60">
                <span className="mr-1 font-sans">⚡</span>
                <strong className="text-foreground font-sans">Code: </strong>
                {row.tip}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary Footer */}
      <div className="p-3.5 bg-page/70 border-t border-border flex items-center justify-between text-xs font-mono text-muted">
        <span>S · O · L · I · D</span>
        <span className="text-foreground font-semibold">Keep simple things simple</span>
      </div>
    </div>
  )
}
