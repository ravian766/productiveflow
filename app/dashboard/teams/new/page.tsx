import { CreateTeamForm } from '@/components/CreateTeamForm';

export default function NewTeamPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Team</h1>
      <CreateTeamForm />
    </div>
  );
}
