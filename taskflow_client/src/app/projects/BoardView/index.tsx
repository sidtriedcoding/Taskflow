import {
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useDuplicateTaskMutation,
  useUpdateTaskMutation,
  Status
} from '@/state/api';
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop, DropTargetMonitor, DragSourceMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task as TaskType } from '@/state/api';
import { EllipsisVertical, MessageSquareMore, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import TaskActionsDropdown from '@/components/TaskActionsDropdown';
import TaskCommentsModal from '@/components/TaskCommentsModal';
import TaskEditModal from '@/components/TaskEditModal';

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  searchTerm: string;
};

const taskStatus = ['To Do', 'Work In Progress', 'Under Review', 'Completed'];

const BoardView = ({ id, setIsModalNewTaskOpen, searchTerm }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus as Status });
  };

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
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={filteredTasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: Record<string, string> = {
    'To Do': '#2563EB',
    'Work In Progress': '#059669',
    'Under Review': '#D97706',
    'Completed': '#000000',
  };

  return (
    <div
      ref={drop as any}
      className={`py-2 xl:px-2 xl:py-4 rounded-lg ${isOver ? 'bg-blue-100 dark:bg-neutral-950' : ''}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className="w-2 rounded-s-lg"
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{' '}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: '1.5rem', height: '1.5rem' }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
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
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deleteTask] = useDeleteTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const taskTagsSplit = task.tags ? task.tags.split(',') : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), 'P')
    : '';
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), 'P')
    : '';

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const handleEditTask = (task: TaskType) => {
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = async (task: TaskType) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`)) {
      try {
        await deleteTask({ taskId: task.id }).unwrap();
        console.log('Task deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete task:', error);
        alert(`Failed to delete task: ${error.data?.message || error.message || 'Unknown error'}`);
      }
    }
  };

  const handleDuplicateTask = async (task: TaskType) => {
    try {
      await duplicateTask({ taskId: task.id }).unwrap();
      console.log('Task duplicated successfully');
    } catch (error: any) {
      console.error('Failed to duplicate task:', error);
      alert(`Failed to duplicate task: ${error.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleArchiveTask = async (task: TaskType) => {
    try {
      await updateTask({
        taskId: task.id,
        updates: { status: 'Completed' }
      }).unwrap();
      console.log('Task archived successfully');
    } catch (error: any) {
      console.error('Failed to archive task:', error);
      alert(`Failed to archive task: ${error.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleFlagTask = async (task: TaskType) => {
    try {
      const newPriority = task.priority === 'Urgent' ? 'High' : 'Urgent';
      await updateTask({
        taskId: task.id,
        updates: { priority: newPriority }
      }).unwrap();
      console.log('Task flagged successfully');
    } catch (error: any) {
      console.error('Failed to flag task:', error);
      alert(`Failed to flag task: ${error.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const PriorityTag = ({ priority }: { priority: TaskType['priority'] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${priority === 'Urgent'
        ? 'bg-red-200 text-red-700'
        : priority === 'High'
          ? 'bg-yellow-200 text-yellow-700'
          : priority === 'Medium'
            ? 'bg-green-200 text-green-700'
            : priority === 'Low'
              ? 'bg-blue-200 text-blue-700'
              : 'bg-gray-200 text-gray-700'
        }`}
    >
      {priority}
    </div>
  );

  return (
    <div
      ref={drag as any}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${isDragging ? 'opacity-50' : 'opacity-100'
        }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag: string, index: number) => (
                <div
                  key={`${task.id}-${tag}-${index}`}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {tag.trim()}
                </div>
              ))}
            </div>
          </div>
          <TaskActionsDropdown
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDuplicate={handleDuplicateTask}
            onArchive={handleArchiveTask}
            onFlag={handleFlagTask}
          />
        </div>

        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === 'number' && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        {/* Users */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignee && task.assignee.profilePictureUrl && (
              <Image
                key={task.assignee.userId}
                src={`/${task.assignee.profilePictureUrl}`}
                alt={task.assignee.username || 'Assignee'}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
            {task.author && task.author.profilePictureUrl && (
              <Image
                key={task.author.userId}
                src={`/${task.author.profilePictureUrl}`}
                alt={task.author.username || 'Author'}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
          </div>
          <button
            onClick={() => setIsCommentsModalOpen(true)}
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-neutral-500 dark:hover:text-gray-300"
          >
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm dark:text-neutral-400">
              {numberOfComments}
            </span>
          </button>
        </div>
      </div>

      <TaskCommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        task={task}
      />

      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
      />
    </div>
  );
};

export default BoardView;
