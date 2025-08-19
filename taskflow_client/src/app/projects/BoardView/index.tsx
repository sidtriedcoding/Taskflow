import { useGetTasksQuery, Task as TaskType, Status } from '@/src/state/api';
import React from 'react';
// TODO: Fix react-dnd imports - temporarily commented out
// import { DndProvider, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import { EllipsisVertical, Plus } from 'lucide-react';

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const handleOpenModal = () => {
    setIsModalNewTaskOpen(true);
  };

  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  // Note: updateTaskStatus mutation would be added here when needed

  const moveTask = (taskId: number, toStatus: string) => {
    // updateTaskStatus({ taskId, status: toStatus });
    console.log('Moving task:', taskId, 'to status:', toStatus);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error occured whileloading tasks</div>;
  }

  return (
    // TODO: Re-enable DndProvider when react-dnd is properly configured
    // <DndProvider backend={HTML5Backend}>
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
      {Object.values(Status).map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={tasks || []}
          moveTask={moveTask}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
        />
      ))}
    </div>
    // </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  // TODO: Re-enable drag and drop when react-dnd is properly configured
  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: 'task',
  //   drop: (item: { id: number }) => moveTask(item.id, status),
  //   collect: (monitor: any) => ({
  //     isOver: !!monitor.isOver(),
  //   })
  // }));
  const isOver = false;

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColour: any = {
    "To Do": "#2563eb",
    "Work In Progress": "#32CD32",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      // TODO: Re-enable drop ref when react-dnd is properly configured
      // ref={(instance) => {
      //   drop(instance);
      // }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}>
      <div className='mb-3 flex w-full'>
        <div
          className={`w-2 rounded-s-lg`}
          style={{ backgroundColor: statusColour[status] }}
        />
        <div className='flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-secondary-color'>
          <h3 className='flex items-center text-lg font-semibold dark:text-white'>
            {status}{" "}
            <span
              className='ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary'
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className='flex items-center gap-1'>
            <button className='flex h-6 w-5 items-center justify-center dark:text-neutral-500'>
              <EllipsisVertical size={26} />
            </button>
            <button className='flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white'
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
    </div>

  );

};

// Helper function to safely get tags as an array
const getTagsArray = (tags: any): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
      // If it's a simple string, split by comma
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } catch {
      // If JSON parse fails, split by comma
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
  }
  return [];
};

// Simple TaskCard component for displaying tasks
type TaskCardProps = {
  task: TaskType;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const tagsArray = getTagsArray(task.tags);
  return (
    <div className="mb-4 rounded-md bg-white p-4 shadow dark:bg-dark-secondary">
      <div className="flex items-start justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <p className="text-lg font-medium dark:text-white">{task.title}</p>
          {task.priority && (
            <div className={`rounded-full px-2 py-1 text-xs font-semibold ${task.priority === 'Urgent' ? 'bg-red-200 text-red-700' :
              task.priority === 'High' ? 'bg-yellow-200 text-yellow-700' :
                task.priority === 'Medium' ? 'bg-green-200 text-green-700' :
                  'bg-gray-200 text-gray-700'
              }`}>
              {task.priority}
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-neutral-500 mt-2">
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <p className="text-xs text-gray-500 mt-2">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {tagsArray.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tagsArray.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardView;
