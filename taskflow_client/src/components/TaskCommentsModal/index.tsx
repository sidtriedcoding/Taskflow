'use client';
import React, { useState } from 'react';
import { X, Send, MessageSquare, User } from 'lucide-react';
import { Task, Comment } from '@/state/api';
import { useGetCommentsQuery, useCreateCommentMutation } from '@/app/store';
import Image from 'next/image';

interface TaskCommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
}

const TaskCommentsModal = ({ isOpen, onClose, task }: TaskCommentsModalProps) => {
    const [newComment, setNewComment] = useState('');
    
    const { data: comments = [], isLoading } = useGetCommentsQuery({ taskId: task.id });
    const [createComment] = useCreateCommentMutation();

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                await createComment({
                    taskId: task.id,
                    text: newComment.trim(),
                    userId: 1, // TODO: Get current user ID from auth context
                }).unwrap();
                setNewComment('');
            } catch (error) {
                console.error('Failed to create comment:', error);
                alert('Failed to add comment. Please try again.');
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800">
                <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Comments
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {task.title}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="max-h-96 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Loading comments...
                            </p>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                No comments yet. Be the first to comment!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {comment.user?.username || 'Unknown User'}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(comment.createdAt || new Date().toISOString())}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 p-6 dark:border-gray-700">
                    <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Add a comment..."
                                className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                rows={3}
                            />
                            <div className="mt-2 flex justify-end">
                                <button
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="h-4 w-4" />
                                    Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCommentsModal;
