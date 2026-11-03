import { useState } from 'react'
import { Check, Copy, Sparkles, ArrowRight, ArrowLeft } from 'pixelarticons/react'

interface PrincipleData {
  letter: 'S' | 'O' | 'L' | 'I' | 'D'
  name: string
  fullName: string
  rule: string
  tlDr: string
  analogyTitle: string
  analogyStory: string
  litmusQuestion: string
  whenToUse: string
  whenToSkip: string
  csharpTip: string
}

const PRINCIPLES: PrincipleData[] = [
  {
    letter: 'S',
    name: 'Single Responsibility',
    fullName: 'Single Responsibility Principle (SRP)',
    rule: 'A class should have one, and only one, reason to change.',
    tlDr: 'One class = One job. Never combine business domain logic with file I/O or SQL queries.',
    analogyTitle: 'The Chef & The Waiter',
    analogyStory:
      'A chef cooks meals; a waiter takes orders and serves customers. If the chef has to stop cooking to drive food deliveries around town, the entire kitchen falls into chaos.',
    litmusQuestion:
      'If our database schema changes tomorrow, does this business logic class have to be edited? If yes, split it.',
    whenToUse: 'Domain entities, API controllers, and services modified frequently by different features.',
    whenToSkip: 'Data Transfer Objects (DTOs), immutable records, or rapid prototype scripts.',
    csharpTip: 'Separate your entity (`User`) from your persistence class (`UserRepository`).',
  },
  {
    letter: 'O',
    name: 'Open / Closed',
    fullName: 'Open / Closed Principle (OCP)',
    rule: 'Classes should be open for extension, but closed for modification.',
    tlDr: 'Add new features by creating new classes, not by modifying tested existing code with if/else chains.',
    analogyTitle: 'Smartphone & App Store',
    analogyStory:
      'When you want a flashlight or calculator on your phone, you don’t crack open the phone with a screwdriver and solder new chips. You download an app that plugs into the phone’s standard APIs.',
    litmusQuestion:
      'To add a new payment method (like Crypto or ApplePay), do I have to open and edit an existing payment processor file?',
    whenToUse: 'Payment gateways, discount engines, export formats (PDF/CSV), notification channels.',
    whenToSkip: 'Fixed features that will never have multiple variants or external drivers.',
    csharpTip: 'Define an interface (`IPaymentMethod`) and pass implementations to an orchestrator.',
  },
  {
    letter: 'L',
    name: 'Liskov Substitution',
    fullName: 'Liskov Substitution Principle (LSP)',
    rule: 'Subtypes must be substitutable for their base types without breaking program behavior.',
    tlDr: 'Never inherit just to share code if the child has to throw NotImplementedException.',
    analogyTitle: 'Real Duck vs. Battery Toy Duck',
    analogyStory:
      'If it looks like a duck and quacks like a duck, but needs 2 AA batteries to swim and will drown in a real pond, substituting it for a real duck breaks customer expectations.',
    litmusQuestion:
      'Does any subclass method throw `NotImplementedException`, `NotSupportedException`, or leave a method body completely empty?',
    whenToUse: 'Polymorphic class hierarchies and shared abstract base models.',
    whenToSkip: 'When you can use composition instead of inheritance (which is almost always cleaner).',
    csharpTip: 'If `ElectricCar` doesn’t use `RefuelGasoline()`, don’t inherit from `GasolineCar`. Use composition.',
  },
  {
    letter: 'I',
    name: 'Interface Segregation',
    fullName: 'Interface Segregation Principle (ISP)',
    rule: 'Clients should never be forced to depend on methods they do not use.',
    tlDr: 'Prefer 3 tiny, focused interfaces over 1 massive "kitchen-sink" interface.',
    analogyTitle: 'Ordering an Espresso vs. Full Buffet',
    analogyStory:
      'When you walk into a cafe for an espresso, they don’t force you to sign a contract for a 5-course wedding buffet setup. You request and pay only for what you consume.',
    litmusQuestion:
      'Are classes forced to implement interface methods they don’t care about just to satisfy the compiler?',
    whenToUse: 'Public API contracts, repository abstractions, logger interfaces, worker contracts.',
    whenToSkip: 'Interfaces that are already tiny (1 to 2 methods total).',
    csharpTip: 'In .NET, notice `IDisposable` has exactly 1 method: `Dispose()`. Keep your own interfaces just as lean.',
  },
  {
    letter: 'D',
    name: 'Dependency Inversion',
    fullName: 'Dependency Inversion Principle (DIP)',
    rule: 'High-level modules must depend on abstractions (interfaces), not concrete classes.',
    tlDr: 'Never hardcode `new Database()` inside your business services. Pass interfaces through constructors.',
    analogyTitle: 'Standardized Wall Power Socket',
    analogyStory:
      'Your laptop charger plugs into a standardized wall socket. The socket doesn’t care whether it powers a Dell, a MacBook, or a table lamp. If you soldered your laptop directly into the wall wires, you could never move rooms.',
    litmusQuestion:
      'Can you write a unit test for this business class in isolation without spinning up a live SQL database or API?',
    whenToUse: 'All business services, domain handlers, payment processors, external email/SMS providers.',
    whenToSkip: 'Simple math utility helpers, plain data records, and 10-line CLI utilities.',
    csharpTip: 'Inject `IRepository` via constructor: `public UserService(IRepository repo) => _repo = repo;`.',
  },
]

export default function SolidCheatSheet() {
  const [activeLetter, setActiveLetter] = useState<'S' | 'O' | 'L' | 'I' | 'D'>('S')
  const [viewMode, setViewMode] = useState<'focus' | 'matrix'>('focus')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const activePrinciple = PRINCIPLES.find((p) => p.letter === activeLetter) || PRINCIPLES[0]
  const currentIndex = PRINCIPLES.findIndex((p) => p.letter === activeLetter)

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + PRINCIPLES.length) % PRINCIPLES.length
    setActiveLetter(PRINCIPLES[prevIndex].letter)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % PRINCIPLES.length
    setActiveLetter(PRINCIPLES[nextIndex].letter)
  }

  return (
    <div className="my-10 border border-border bg-surface rounded-sm pixel-corners overflow-hidden">
      {/* Component Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-page/90 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-foreground pixel-icon shrink-0" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">
            INTERACTIVE SOLID CHEAT SHEET
          </span>
          <span className="hidden sm:inline text-border-strong">·</span>
          <span className="hidden sm:inline font-mono text-[11px] text-muted">
            5 CORE PRINCIPLES
          </span>
        </div>

        {/* View Mode Toggle: Focus vs Matrix */}
        <div className="flex items-center p-0.5 border border-border rounded-2xs bg-surface font-mono text-[11px] self-stretch sm:self-auto justify-center">
          <button
            type="button"
            onClick={() => setViewMode('focus')}
            className={`px-3 py-1 rounded-2xs transition-all cursor-pointer ${
              viewMode === 'focus'
                ? 'bg-foreground text-page font-semibold shadow-xs'
                : 'text-muted hover:text-foreground'
            }`}
          >
            FOCUS VIEW
          </button>
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1 rounded-2xs transition-all cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-foreground text-page font-semibold shadow-xs'
                : 'text-muted hover:text-foreground'
            }`}
          >
            MATRIX VIEW
          </button>
        </div>
      </div>

      {/* S-O-L-I-D Principle Selector Buttons */}
      <div className="grid grid-cols-5 border-b border-border bg-page/40 divide-x divide-border">
        {PRINCIPLES.map((p) => {
          const isSelected = activeLetter === p.letter
          return (
            <button
              key={p.letter}
              type="button"
              onClick={() => {
                setActiveLetter(p.letter)
                setViewMode('focus')
              }}
              className={`py-3 sm:py-3.5 px-2 text-center transition-all cursor-pointer relative group ${
                isSelected
                  ? 'bg-surface text-foreground font-semibold'
                  : 'text-secondary hover:text-foreground hover:bg-surface/50'
              }`}
              title={p.fullName}
            >
              {/* Active top line indicator */}
              {isSelected && (
                <span className="absolute top-0 inset-x-0 h-0.5 bg-foreground" aria-hidden="true" />
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-2xs font-mono text-xs font-bold border ${
                    isSelected
                      ? 'border-foreground bg-foreground text-page'
                      : 'border-border bg-page text-secondary group-hover:border-foreground/50'
                  }`}
                >
                  {p.letter}
                </span>
                <span className="hidden md:inline font-mono text-xs truncate max-w-[120px]">
                  {p.name}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* FOCUS VIEW: Deep Dive into Active Principle */}
      {viewMode === 'focus' && (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Header of Active Principle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-2xs bg-foreground text-page font-mono text-xs font-bold">
                  {activePrinciple.letter}
                </span>
                <span className="font-mono text-xs text-muted uppercase tracking-wider">
                  PRINCIPLE {currentIndex + 1} OF 5
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                {activePrinciple.fullName}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(activePrinciple.rule, `rule-${activePrinciple.letter}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 self-start sm:self-auto border border-border bg-page hover:bg-surface text-secondary hover:text-foreground font-mono text-xs rounded-2xs active:scale-[0.97] transition-all cursor-pointer"
              title="Copy principle rule"
            >
              {copiedKey === `rule-${activePrinciple.letter}` ? (
                <>
                  <Check className="w-3.5 h-3.5 text-foreground pixel-icon" aria-hidden="true" />
                  <span>RULE COPIED ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-muted pixel-icon" aria-hidden="true" />
                  <span>COPY RULE</span>
                </>
              )}
            </button>
          </div>

          {/* The Core Rule Callout */}
          <div className="p-4 sm:p-5 rounded-2xs border border-border bg-page/60">
            <p className="font-mono text-xs text-muted uppercase tracking-wider mb-1.5">
              THE ONE-SENTENCE CORE RULE
            </p>
            <p className="text-base sm:text-lg font-medium text-foreground leading-snug">
              “{activePrinciple.rule}”
            </p>
            <p className="text-xs sm:text-sm text-secondary mt-2 font-mono">
              <span className="text-foreground font-semibold">TL;DR:</span> {activePrinciple.tlDr}
            </p>
          </div>

          {/* 2-Column: Real-Life Analogy & PR Litmus Test */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Analogy Box */}
            <div className="p-4 sm:p-5 rounded-2xs border border-border bg-page/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-foreground font-semibold uppercase tracking-wider">
                    💡 Real-Life Analogy
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {activePrinciple.analogyTitle}
                </h4>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  {activePrinciple.analogyStory}
                </p>
              </div>
            </div>

            {/* Litmus Test Box */}
            <div className="p-4 sm:p-5 rounded-2xs border border-border bg-page/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-foreground font-semibold uppercase tracking-wider">
                    🔍 PR Review Litmus Test
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  Ask Yourself During Code Review:
                </h4>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed italic">
                  “{activePrinciple.litmusQuestion}”
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60">
                <p className="text-xs font-mono text-muted">
                  <span className="text-secondary font-semibold">C# Tip:</span> {activePrinciple.csharpTip}
                </p>
              </div>
            </div>
          </div>

          {/* Decision Matrix: When to Use vs Skip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-mono text-xs">
            <div className="p-3.5 rounded-2xs border border-border bg-page/30">
              <span className="inline-flex items-center gap-1.5 text-foreground font-semibold mb-1">
                <span className="text-emerald-500">🟢</span> WHEN TO APPLY
              </span>
              <p className="text-secondary leading-relaxed">
                {activePrinciple.whenToUse}
              </p>
            </div>
            <div className="p-3.5 rounded-2xs border border-border bg-page/30">
              <span className="inline-flex items-center gap-1.5 text-foreground font-semibold mb-1">
                <span className="text-rose-400">🔴</span> WHEN TO SKIP
              </span>
              <p className="text-secondary leading-relaxed">
                {activePrinciple.whenToSkip}
              </p>
            </div>
          </div>

          {/* Stepper Navigation: Previous / Next */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-secondary hover:text-foreground border border-border hover:border-border-strong rounded-2xs bg-page transition-all cursor-pointer active:scale-[0.97]"
            >
              <ArrowLeft className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
              <span>PREVIOUS</span>
            </button>

            <span className="font-mono text-xs text-muted">
              {currentIndex + 1} / {PRINCIPLES.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-secondary hover:text-foreground border border-border hover:border-border-strong rounded-2xs bg-page transition-all cursor-pointer active:scale-[0.97]"
            >
              <span>NEXT</span>
              <ArrowRight className="w-3.5 h-3.5 pixel-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* MATRIX VIEW: High-Level Scannable Matrix */}
      {viewMode === 'matrix' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-page/70 border-b border-border text-foreground font-semibold">
              <tr>
                <th className="py-3 px-4 text-micro-caps text-muted uppercase tracking-wider w-16">
                  KEY
                </th>
                <th className="py-3 px-4 text-micro-caps text-muted uppercase tracking-wider min-w-[140px]">
                  PRINCIPLE
                </th>
                <th className="py-3 px-4 text-micro-caps text-muted uppercase tracking-wider min-w-[240px]">
                  ONE-SENTENCE RULE
                </th>
                <th className="py-3 px-4 text-micro-caps text-muted uppercase tracking-wider min-w-[200px]">
                  REAL-LIFE ANALOGY
                </th>
                <th className="py-3 px-4 text-micro-caps text-muted uppercase tracking-wider text-right w-24">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {PRINCIPLES.map((p) => (
                <tr
                  key={p.letter}
                  className="hover:bg-page/50 transition-colors group cursor-pointer"
                  onClick={() => {
                    setActiveLetter(p.letter)
                    setViewMode('focus')
                  }}
                >
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-2xs font-mono text-xs font-bold border border-foreground bg-foreground text-page">
                      {p.letter}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    <div>{p.name}</div>
                    <div className="text-[10px] text-muted font-normal">{p.letter}RP / {p.letter}</div>
                  </td>
                  <td className="py-3.5 px-4 text-secondary leading-relaxed">
                    {p.rule}
                  </td>
                  <td className="py-3.5 px-4 text-muted leading-relaxed">
                    <span className="text-secondary font-medium">{p.analogyTitle}:</span> {p.analogyStory}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveLetter(p.letter)
                        setViewMode('focus')
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-secondary group-hover:text-foreground border border-border group-hover:border-border-strong rounded-2xs bg-page transition-colors"
                    >
                      <span>DETAILS</span>
                      <ArrowRight className="w-3 h-3 pixel-icon" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 bg-page/40 border-t border-border text-center text-[11px] font-mono text-muted">
            Tip: Click any row above to inspect full code rules, analogies, and PR review tests.
          </div>
        </div>
      )}
    </div>
  )
}
