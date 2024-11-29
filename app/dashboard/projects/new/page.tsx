import { CreateProjectForm } from '@/components/CreateProjectForm';
import { PageHeader } from '@/components/PageHeader';

export default function NewProjectPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Create New Project"
        description="Create a new project to organize your tasks and collaborate with your team."
      />
      <div className="mt-8">
        <CreateProjectForm />
      </div>
    </div>
  );
}