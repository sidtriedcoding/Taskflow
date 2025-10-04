'use client';

import React, { useState } from 'react';
import {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
    useGetUnreadCountQuery
} from '@/app/store';
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Filter,
    X,
    MessageSquare,
    ClipboardList,
    FolderOpen,
    Users,
    Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
    const [selectedUserId, setSelectedUserId] = useState<number>(1); // Default to user 1 for demo
    const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [readFilter, setReadFilter] = useState<string>('');

    const { data: notifications, isLoading, isError } = useGetNotificationsQuery({
        userId: selectedUserId
    });

    const { data: unreadCount } = useGetUnreadCountQuery({
        userId: selectedUserId
    });

    const [markAsRead] = useMarkAsReadMutation();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();

    // Filter notifications based on current filters
    const filteredNotifications = notifications ? notifications.filter(notification => {
        const matchesType = !typeFilter || notification.type === typeFilter;
        const matchesRead = readFilter === '' ||
            (readFilter === 'read' && notification.isRead) ||
            (readFilter === 'unread' && !notification.isRead);
        return matchesType && matchesRead;
    }) : [];

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await markAsRead({ notificationId }).unwrap();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead({ userId: selectedUserId }).unwrap();
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const handleDeleteNotification = async (notificationId: number) => {
        try {
            await deleteNotification({ notificationId }).unwrap();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_update':
        return <ClipboardList className="h-5 w-5 text-blue-500" />;
      case 'project_update':
        return <FolderOpen className="h-5 w-5 text-green-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'team_update':
        return <Users className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

    const getNotificationTypeLabel = (type: string) => {
        switch (type) {
            case 'task_update':
                return 'Task Update';
            case 'project_update':
                return 'Project Update';
            case 'comment':
                return 'Comment';
            case 'team_update':
                return 'Team Update';
            default:
                return 'Notification';
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="text-lg text-gray-500">Loading notifications...</div>
            </div>
        );
    }

    if (isError || !notifications) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="text-lg text-red-500">Error loading notifications</div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col bg-gray-50 p-6 dark:bg-gray-900">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                    {unreadCount && unreadCount.count > 0 && (
                        <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                            {unreadCount.count}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${showFilters
                            ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Filter size={16} />
                        <span>FILTERS</span>
                    </button>
                    {unreadCount && unreadCount.count > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                User ID
                            </label>
                            <input
                                type="number"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter user ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Type
                            </label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">All Types</option>
                                <option value="task_update">Task Updates</option>
                                <option value="project_update">Project Updates</option>
                                <option value="comment">Comments</option>
                                <option value="team_update">Team Updates</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                value={readFilter}
                                onChange={(e) => setReadFilter(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">All</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 rounded-lg bg-white shadow-sm dark:bg-gray-800">
                {filteredNotifications.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="text-center">
                            <Bell className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                You're all caught up! No notifications to show.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {notification.title}
                                                </h4>
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                    {getNotificationTypeLabel(notification.type)}
                                                </span>
                                                {!notification.isRead && (
                                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteNotification(notification.id)}
                                                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-600 dark:hover:text-red-400"
                                                        title="Delete notification"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                            {notification.message}
                                        </p>
                                        {(notification.task || notification.project || notification.team) && (
                                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                {notification.task && (
                                                    <span>Task: {notification.task.title}</span>
                                                )}
                                                {notification.project && (
                                                    <span>Project: {notification.project.teamname}</span>
                                                )}
                                                {notification.team && (
                                                    <span>Team: {notification.team.teamname}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>
                    Showing {filteredNotifications.length} of {notifications.length} notifications
                </span>
                {unreadCount && unreadCount.count > 0 && (
                    <span className="text-blue-600 dark:text-blue-400">
                        {unreadCount.count} unread
                    </span>
                )}
            </div>
        </div>
    );
};

export default Notifications;
