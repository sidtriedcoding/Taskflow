'use client';
import React from 'react';
import { useGetProjectsQuery, useCreateProjectMutation } from '../../state';

export default function ProjectsPage() {
    const {
        data: projects = [],
        error,
        isLoading,
        refetch
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
    if (error) return <div className="p-6 text-red-500">Error loading projects</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Projects
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={handleCreateProject}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create Project
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {project.teamname}
                        </h3>
                        {project.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {project.description}
                            </p>
                        )}
                        {project.startDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Start: {new Date(project.startDate).toLocaleDateString()}
                            </p>
                        )}
                        {project.endDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                End: {new Date(project.endDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No projects found. Create your first project!
                    </p>
                    <button
                        onClick={handleCreateProject}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Create First Project
                    </button>
                </div>
            )}
        </div>
    );
}