'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Copy, Archive, Flag } from 'lucide-react';
import { Task } from '@/state/api';

interface TaskActionsDropdownProps {
    task: Task;
    onEdit?: (task: Task) => void;
    onDelete?: (task: Task) => void;
    onDuplicate?: (task: Task) => void;
    onArchive?: (task: Task) => void;
    onFlag?: (task: Task) => void;
}

const TaskActionsDropdown = ({
    task,
    onEdit,
    onDelete,
    onDuplicate,
    onArchive,
    onFlag
}: TaskActionsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-6 w-4 flex-shrink-0 items-center justify-center text-gray-500 hover:text-gray-700 dark:text-neutral-500 dark:hover:text-gray-300"
            >
                <MoreVertical size={16} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-8 z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-600">
                    <div className="py-1">
                        {onEdit && (
                            <button
                                onClick={() => handleAction(() => onEdit(task))}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Edit className="mr-3 h-4 w-4" />
                                Edit Task
                            </button>
                        )}
                        {onDuplicate && (
                            <button
                                onClick={() => handleAction(() => onDuplicate(task))}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Copy className="mr-3 h-4 w-4" />
                                Duplicate Task
                            </button>
                        )}
                        {onFlag && (
                            <button
                                onClick={() => handleAction(() => onFlag(task))}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Flag className="mr-3 h-4 w-4" />
                                Flag Task
                            </button>
                        )}
                        {onArchive && (
                            <button
                                onClick={() => handleAction(() => onArchive(task))}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Archive className="mr-3 h-4 w-4" />
                                Archive Task
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => handleAction(() => onDelete(task))}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                <Trash2 className="mr-3 h-4 w-4" />
                                Delete Task
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskActionsDropdown;
