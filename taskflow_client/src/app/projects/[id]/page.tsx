'use client';

import React, { use, useState } from 'react';
import ProjectHeader from '../ProjectHeader';
import BoardView from '../BoardView';
import { useGetProjectsQuery } from '@/src/state';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Project = ({ params }: Props) => {
  const { id } = use(params);
  const { data: projects = [] } = useGetProjectsQuery();
  const project = projects.find((p) => String(p.id) === String(id));

  const [activeTab, setActiveTab] = useState<string>('Board');
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState<boolean>(false);

  return (
    <div>
      {/*MODAL NEW TASKS*/}
      <ProjectHeader
        name={project?.teamname ?? 'Project'}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === 'Board' && (
        <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
};

export default Project;


