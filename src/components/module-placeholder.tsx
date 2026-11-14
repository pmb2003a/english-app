import { getModule } from "@/lib/modules";

/** Page d'attente d'un module pas encore développé. */
export function ModulePlaceholder({ href }: { href: string }) {
  const mod = getModule(href);
  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-semibold">{mod.label}</h1>
      <p className="mt-2 text-slate-600">{mod.summary}</p>
      <div className="mt-6 rounded border border-dashed border-slate-300 p-4">
        <p className="text-sm font-medium text-slate-500">Pas encore développé. Prévu :</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
          {mod.planned.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
