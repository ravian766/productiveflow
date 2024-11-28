import { Suspense } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ProjectsList } from '@/components/ProjectsList';

async function getProjects() {
  const user = await auth();
  if (!user) return [];

  return prisma.project.findMany({
    where: {
      users: {
        some: {
          id: user.id
        }
      }
    },
    include: {
      tasks: {
        select: {
          id: true,
          status: true,
        }
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading projects...</div>}>
          <ProjectsList projects={projects} />
        </Suspense>
      </div>
    </div>
  );
}
