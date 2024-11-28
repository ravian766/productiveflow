'use client';

import { ProjectCard } from '@/components/ProjectCard';

interface Project {
  id: string;
  name: string;
  description?: string | null;
  tasks: { id: string; status: string; }[];
  users: { id: string; name: string | null; email: string; }[];
}

interface ProjectsListProps {
  projects: Project[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
        <p className="text-gray-600">Create your first project to get started</p>
      </div>
    );
  }

  return (
    <>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </>
  );
}
