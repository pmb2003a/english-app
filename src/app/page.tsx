import { asc, avg, count, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { MODULES } from "@/lib/modules";

// Toujours lire la base au moment de l'affichage (pas de page figée au build).
export const dynamic = "force-dynamic";

async function loadSkillOverview() {
  const rows = await db
    .select({
      id: schema.skills.id,
      name: schema.skills.name,
      concepts: count(schema.concepts.id),
      avgMastery: avg(schema.mastery.score),
    })
    .from(schema.skills)
    .leftJoin(schema.concepts, eq(schema.concepts.skillId, schema.skills.id))
    .leftJoin(schema.mastery, eq(schema.mastery.conceptId, schema.concepts.id))
    .groupBy(schema.skills.id)
    .orderBy(asc(schema.skills.sortOrder));
  const [{ total }] = await db.select({ total: count() }).from(schema.attempts);
  return { rows, totalAttempts: total };
}

export default async function DashboardPage() {
  const dashboard = MODULES[0];
  let data: Awaited<ReturnType<typeof loadSkillOverview>> | null = null;
  try {
    data = await loadSkillOverview();
  } catch {
    data = null;
  }

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-semibold">{dashboard.label}</h1>
      <p className="mt-2 text-slate-600">{dashboard.summary}</p>

      {data === null ? (
        <div className="mt-6 rounded border border-amber-300 bg-amber-50 p-4 text-sm">
          La base de données n&apos;est pas encore prête. Arrêtez l&apos;app, lancez{" "}
          <code className="font-mono">npm run setup</code>, puis relancez{" "}
          <code className="font-mono">npm run dev</code>.
        </div>
      ) : (
        <>
          <table className="mt-6 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300 text-left text-slate-500">
                <th className="py-2">Compétence</th>
                <th className="py-2">Concepts</th>
                <th className="py-2">Maîtrise moyenne</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((s) => (
                <tr key={s.id} className="border-b border-slate-200">
                  <td className="py-2">{s.name}</td>
                  <td className="py-2">{s.concepts}</td>
                  <td className="py-2">
                    {s.avgMastery == null ? "—" : `${Math.round(Number(s.avgMastery) * 100)} %`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-slate-500">
            {data.totalAttempts} réponse(s) enregistrée(s). Les concepts arriveront avec le
            diagnostic.
          </p>
        </>
      )}
    </section>
  );
}
