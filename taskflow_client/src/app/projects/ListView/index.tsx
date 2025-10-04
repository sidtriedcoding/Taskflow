import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { Task, useGetTasksQuery } from '@/state/api';
import React from 'react';

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  searchTerm: string;
};

const ListView = ({ id, setIsModalNewTaskOpen, searchTerm }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  // Filter tasks based on search term
  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];
    if (!searchTerm.trim()) return tasks;

    const searchLower = searchTerm.toLowerCase();
    return tasks.filter((task) => {
      return (
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.status?.toLowerCase().includes(searchLower) ||
        task.priority?.toLowerCase().includes(searchLower) ||
        task.tags?.toLowerCase().includes(searchLower) ||
        task.author?.username?.toLowerCase().includes(searchLower) ||
        task.assignee?.username?.toLowerCase().includes(searchLower)
      );
    });
  }, [tasks, searchTerm]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {filteredTasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default ListView;
