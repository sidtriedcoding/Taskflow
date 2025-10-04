'use client';
import React, { useState } from 'react';
import { X, User, Mail, Key, Image, Users } from 'lucide-react';
import { useCreateUserMutation, useGetTeamsQuery } from '@/state/api';

interface ModalNewUserProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalNewUser = ({ isOpen, onClose }: ModalNewUserProps) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [cognitoId, setCognitoId] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [teamId, setTeamId] = useState<number | undefined>(undefined);

    const [createUser, { isLoading }] = useCreateUserMutation();
    const { data: teams = [] } = useGetTeamsQuery();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !email || !cognitoId) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            await createUser({
                username,
                email,
                cognitoId,
                profilePictureUrl: profilePictureUrl || undefined,
                teamId,
            }).unwrap();

            // Reset form
            setUsername('');
            setEmail('');
            setCognitoId('');
            setProfilePictureUrl('');
            setTeamId(undefined);
            onClose();
        } catch (error: any) {
            console.error('Failed to create user:', error);
            alert(`Failed to create user: ${error.data?.message || error.message || 'Unknown error'}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Create New User
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Username *
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email *
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                    </div>

                    {/* Cognito ID */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cognito ID *
                        </label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={cognitoId}
                                onChange={(e) => setCognitoId(e.target.value)}
                                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter Cognito ID"
                                required
                            />
                        </div>
                    </div>

                    {/* Profile Picture URL */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Profile Picture URL
                        </label>
                        <div className="relative">
                            <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                value={profilePictureUrl}
                                onChange={(e) => setProfilePictureUrl(e.target.value)}
                                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter profile picture URL"
                            />
                        </div>
                    </div>

                    {/* Team Selection */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Team
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <select
                                value={teamId || ''}
                                onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">No team assigned</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.teamname}
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
                            {isLoading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalNewUser;
