'use client';
import React from 'react';
import { useGetProjectsQuery, useCreateProjectMutation } from '../../state';
import Link from 'next/link';

export default function ProjectsPage() {
  const {
    data: projects = [],
    error,
    isLoading,
    refetch,
  } = useGetProjectsQuery();

  const [createProject] = useCreateProjectMutation();

  const handleCreateProject = async () => {
    const newProject = {
      teamname: `Project ${Date.now()}`,
      description: 'A new project created from the UI',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };

    try {
      await createProject(newProject).unwrap();
      console.log('Project created successfully');
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  if (isLoading) return <div className="p-6">Loading projects...</div>;
  if (error)
    return <div className="p-6 text-red-500">Error loading projects</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projects
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Refresh
          </button>
          <button
            onClick={handleCreateProject}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Create Project
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {project.teamname}
            </h3>
            {project.description && (
              <p className="mb-2 text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
            )}
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500">
              {project.startDate && (
                <span>
                  Start: {new Date(project.startDate).toLocaleDateString()}
                </span>
              )}
              {project.endDate && (
                <span>
                  End: {new Date(project.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              Click to open project →
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            No projects found. Create your first project!
          </p>
          <button
            onClick={handleCreateProject}
            className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
          >
            Create First Project
          </button>
        </div>
      )}
    </div>
  );
}
