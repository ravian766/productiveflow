export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Dashboard!</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Dashboard cards */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Total Tasks</h3>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Completed</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">In Progress</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Pending</h3>
          <p className="text-3xl font-bold">4</p>
        </div>
      </div>
    </div>
  );
}