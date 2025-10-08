'use client';

import React, { useState } from 'react';
import ProjectHeader from '@/app/projects/ProjectHeader';
import Board from '../BoardView';
import List from '../ListView';
import Timeline from '../TimelineView';
import Table from '../TableView';
import ModalNewTask from '@/components/ModalNewTask';
import { useGetProjectsQuery } from '@/state/api';

type Props = {
  params: Promise<{ id: string }>;
};

const Project = ({ params }: Props) => {
  // Use React.use() to unwrap the params object as suggested by the warning.
  const { id } = React.use(params);

  const [activeTab, setActiveTab] = useState('Board');
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all projects and filter by ID (workaround for backend route issue)
  const { data: projects, isLoading, error } = useGetProjectsQuery();
  const project = projects?.find((p) => p.id === Number(id));

  if (isLoading) {
    return <div className="p-6">Loading project...</div>;
  }

  if (error || !project) {
    return <div className="p-6 text-red-500">Error loading project</div>;
  }

  return (
    <div>
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
      <ProjectHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsModalNewTaskOpen={setIsModalNewTaskOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        projectName={project?.teamname}
      />
      {activeTab === 'Board' && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} />
      )}
      {activeTab === 'List' && (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} />
      )}
      {activeTab === 'Timeline' && (
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} />
      )}
      {activeTab === 'Table' && (
        <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default Project;
