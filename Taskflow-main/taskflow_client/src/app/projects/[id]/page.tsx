'use client';

import * as React from 'react';
const { use, useState } = React;
import ProjectHeader from '../ProjectHeader';
import BoardView from '../BoardView';
import { useGetProjectsQuery } from '@/src/state/api';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Project = ({ params }: Props) => {
  const { id } = use(params);
  const { data: projects = [] } = useGetProjectsQuery();
  const project = projects.find((p: any) => String(p.id) === String(id));

  const [activeTab, setActiveTab] = useState('Board');
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

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


