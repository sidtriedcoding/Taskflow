'use client';

import React, { useState } from 'react';
import ProjectHeader from '@/app/projects/ProjectHeader';
import Board from '../BoardView';
import List from '../ListView';
import Timeline from '../TimelineView';
import Table from '../TableView';
import ModalNewTask from '@/components/ModalNewTask';

type Props = {
  params: Promise<{ id: string }>;
};

const Project = ({ params }: Props) => {
  // Use React.use() to unwrap the params object as suggested by the warning.
  const { id } = React.use(params);

  const [activeTab, setActiveTab] = useState('Board');
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
