'use client';
import React, { useState } from 'react';
import { X, Users, User } from 'lucide-react';
import { useCreateTeamMutation, useGetUsersQuery } from '@/state/api';

interface ModalNewTeamProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalNewTeam = ({ isOpen, onClose }: ModalNewTeamProps) => {
    const [teamname, setTeamname] = useState('');
    const [productOwnerUserId, setProductOwnerUserId] = useState<number | undefined>(undefined);

    const [createTeam, { isLoading }] = useCreateTeamMutation();
    const { data: users = [] } = useGetUsersQuery();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!teamname) {
            alert('Please enter a team name');
            return;
        }

        try {
            await createTeam({
                teamname,
                productOwnerUserId,
            }).unwrap();

            // Reset form
            setTeamname('');
            setProductOwnerUserId(undefined);
            onClose();
        } catch (error: any) {
            console.error('Failed to create team:', error);
            alert(`Failed to create team: ${error.data?.message || error.message || 'Unknown error'}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Create New Team
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Team Name */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Team Name *
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={teamname}
                                onChange={(e) => setTeamname(e.target.value)}
                                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter team name"
                                required
                            />
                        </div>
                    </div>

                    {/* Product Owner Selection */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Product Owner
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <select
                                value={productOwnerUserId || ''}
                                onChange={(e) => setProductOwnerUserId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">No product owner assigned</option>
                                {users.map((user) => (
                                    <option key={user.userId} value={user.userId}>
                                        {user.username} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating...' : 'Create Team'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalNewTeam;
