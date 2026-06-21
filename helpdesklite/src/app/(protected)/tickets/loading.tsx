export default function TicketsLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-6 space-y-3">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-9 w-72 rounded bg-slate-200" />
        <div className="h-4 w-full max-w-xl rounded bg-slate-200" />
      </div>

      <div className="h-28 rounded-lg border border-slate-200 bg-white" />
      <div className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-white p-4">
        <div className="h-16 rounded bg-slate-100" />
        <div className="h-16 rounded bg-slate-100" />
        <div className="h-16 rounded bg-slate-100" />
      </div>
    </main>
  );
}
