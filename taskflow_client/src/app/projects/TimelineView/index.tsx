import { useGetTasksQuery } from '@/state/api';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { useAppSelector } from '@/app/hooks';
import 'gantt-task-react/dist/index.css';
import React, { useMemo, useState } from 'react';

// Define the props for our new memoized component
interface GanttChartProps {
  tasks: Task[];
  viewMode: ViewMode;
  isDarkMode: boolean;
}

// Step 1: Create a new, isolated component for the Gantt chart
// We wrap it in React.memo to prevent it from re-rendering unnecessarily.
const MemoizedGanttChart = React.memo(
  ({ tasks, viewMode, isDarkMode }: GanttChartProps) => {
    return (
      <Gantt
        tasks={tasks}
        viewMode={viewMode}
        locale="en-US"
        columnWidth={viewMode === ViewMode.Month ? 150 : 100}
        listCellWidth="100px"
        barBackgroundColor={isDarkMode ? '#101214' : '#aeb8c2'}
        barBackgroundSelectedColor={isDarkMode ? '#000' : '#9ba1a6'}
      />
    );
  }
);

// Add a display name for better debugging
MemoizedGanttChart.displayName = 'MemoizedGanttChart';

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);

  const ganttTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.map((task) => ({
      start: new Date(task.startDate as string),
      end: new Date(task.dueDate as string),
      name: task.title,
      id: `Task-${task.id}`,
      type: 'task' as 'task',
      progress: task.points ? (task.points / 10) * 100 : 0,
      isDisabled: false,
    }));
  }, [tasks]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setViewMode(event.target.value as ViewMode);
  };

  const isDataReady = !isLoading && ganttTasks.length > 0;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="xl-px-6 px-4">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          {isDataReady ? (
            // Step 2: Render the new memoized component
            <MemoizedGanttChart
              tasks={ganttTasks}
              viewMode={viewMode}
              isDarkMode={isDarkMode}
            />
          ) : (
            <div className="p-4">No tasks to display in the timeline.</div>
          )}
        </div>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
