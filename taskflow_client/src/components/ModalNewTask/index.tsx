import Modal from '@/components/Modal';
import { Priority, Status, useCreateTaskMutation, useGetUsersQuery } from '@/state/api';
import React, { useState } from 'react';
import { formatISO } from 'date-fns';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: users = [] } = useGetUsersQuery();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Low);
  const [tags, setTags] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [authorUserId, setAuthorUserId] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [projectId, setProjectId] = useState('');

  // Reset state when the modal is closed
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus(Status.ToDo);
    setPriority(Priority.Low);
    setTags('');
    setStartDate('');
    setDueDate('');
    setAuthorUserId('');
    setAssignedUserId('');
    setProjectId('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!title || !authorUserId || (!id && !projectId)) return;

    // Base task object
    const taskPayload: any = {
      title,
      description,
      status,
      priority,
      // *** THIS IS THE FIX ***
      // Send tags as a single string, not an array
      tags: tags,
      authorUserId: parseInt(authorUserId),
      projectId: id !== null ? Number(id) : Number(projectId),
    };

    // Only add dates and assigned user if they exist to avoid errors
    if (startDate) {
      taskPayload.startDate = formatISO(new Date(startDate));
    }
    if (dueDate) {
      taskPayload.dueDate = formatISO(new Date(dueDate));
    }
    if (assignedUserId) {
      taskPayload.assignedUserId = parseInt(assignedUserId);
    }

    try {
      await createTask(taskPayload).unwrap();
      handleClose(); // Close and clear the form on successful submission
    } catch (error) {
      console.error('Failed to create task:', error);
      // Optionally, show an error message to the user here
    }
  };

  const isFormValid = () => {
    return !!(title && authorUserId && (id || projectId));
  };

  const selectStyles =
    'mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none';

  const inputStyles =
    'w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} name="Create New Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status *
            </label>
            <select
              className={selectStyles}
              value={status}
              onChange={(e) =>
                setStatus(Status[e.target.value as keyof typeof Status])
              }
              required
            >
              <option value={Status.ToDo}>To Do</option>
              <option value={Status.WorkInProgress}>Work In Progress</option>
              <option value={Status.UnderReview}>Under Review</option>
              <option value={Status.Completed}>Completed</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority *
            </label>
            <select
              className={selectStyles}
              value={priority}
              onChange={(e) =>
                setPriority(Priority[e.target.value as keyof typeof Priority])
              }
              required
            >
              <option value={Priority.Urgent}>Urgent</option>
              <option value={Priority.High}>High</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Backlog}>Backlog</option>
            </select>
          </div>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <select
          className={selectStyles}
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
          required
        >
          <option value="">Select Author</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
        <select
          className={selectStyles}
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        >
          <option value="">Select Assignee (Optional)</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
        {id === null && (
          <input
            type="text"
            className={inputStyles}
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          />
        )}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
