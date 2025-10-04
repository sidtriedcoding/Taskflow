'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Users, FolderOpen, CheckSquare, User } from 'lucide-react';
import { useSearchQuery } from '@/state/api';
import { useRouter } from 'next/navigation';
import { Project, Task, User as UserType, Team } from '@/state/api';

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Debounced search query
    const { data: searchResults, isLoading } = useSearchQuery(searchTerm, {
        skip: !searchTerm || searchTerm.length < 2,
    });

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, getTotalResults() - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                handleResultClick(getSelectedResult());
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, searchResults]);

    const getTotalResults = () => {
        if (!searchResults) return 0;
        return (searchResults.tasks?.length || 0) +
            (searchResults.projects?.length || 0) +
            (searchResults.users?.length || 0) +
            (searchResults.teams?.length || 0);
    };

    const getSelectedResult = () => {
        if (!searchResults) return null;

        let currentIndex = 0;

        // Check tasks
        if (searchResults.tasks) {
            if (selectedIndex < searchResults.tasks.length) {
                return { type: 'task', data: searchResults.tasks[selectedIndex] };
            }
            currentIndex += searchResults.tasks.length;
        }

        // Check projects
        if (searchResults.projects) {
            if (selectedIndex < currentIndex + searchResults.projects.length) {
                return { type: 'project', data: searchResults.projects[selectedIndex - currentIndex] };
            }
            currentIndex += searchResults.projects.length;
        }

        // Check users
        if (searchResults.users) {
            if (selectedIndex < currentIndex + searchResults.users.length) {
                return { type: 'user', data: searchResults.users[selectedIndex - currentIndex] };
            }
            currentIndex += searchResults.users.length;
        }

        // Check teams
        if (searchResults.teams) {
            if (selectedIndex < currentIndex + searchResults.teams.length) {
                return { type: 'team', data: searchResults.teams[selectedIndex - currentIndex] };
            }
        }

        return null;
    };

    const handleResultClick = (result: any) => {
        if (!result) return;

        switch (result.type) {
            case 'task':
                router.push(`/projects/${result.data.projectId}`);
                break;
            case 'project':
                router.push(`/projects/${result.data.id}`);
                break;
            case 'user':
                // Navigate to user profile or team page
                router.push(`/teams`);
                break;
            case 'team':
                router.push(`/teams`);
                break;
        }
        onClose();
    };

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'task':
                return <CheckSquare className="h-4 w-4" />;
            case 'project':
                return <FolderOpen className="h-4 w-4" />;
            case 'user':
                return <User className="h-4 w-4" />;
            case 'team':
                return <Users className="h-4 w-4" />;
            default:
                return <Search className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    {/* Search Input */}
                    <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <Search className="h-5 w-5 text-gray-400 mr-3" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search tasks, projects, users..."
                            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                        />
                        <button
                            onClick={onClose}
                            className="ml-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                            <X className="h-4 w-4 text-gray-400" />
                        </button>
                    </div>

                    {/* Search Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {!searchTerm || searchTerm.length < 2 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Type at least 2 characters to search</p>
                            </div>
                        ) : isLoading ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2">Searching...</p>
                            </div>
                        ) : getTotalResults() === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No results found for "{searchTerm}"</p>
                            </div>
                        ) : (
                            <div className="py-2">
                                {/* Tasks */}
                                {searchResults?.tasks?.map((task: Task, index: number) => (
                                    <div
                                        key={`task-${task.id}`}
                                        className={`flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900' : ''
                                            }`}
                                        onClick={() => handleResultClick({ type: 'task', data: task })}
                                    >
                                        <CheckSquare className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                Task • {task.status || 'No status'} • {task.priority || 'No priority'}
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                                    </div>
                                ))}

                                {/* Projects */}
                                {searchResults?.projects?.map((project: Project, index: number) => (
                                    <div
                                        key={`project-${project.id}`}
                                        className={`flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${selectedIndex === (searchResults?.tasks?.length || 0) + index ? 'bg-blue-50 dark:bg-blue-900' : ''
                                            }`}
                                        onClick={() => handleResultClick({ type: 'project', data: project })}
                                    >
                                        <FolderOpen className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {project.teamname}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                Project • {project.description || 'No description'}
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                                    </div>
                                ))}

                                {/* Users */}
                                {searchResults?.users?.map((user: UserType, index: number) => (
                                    <div
                                        key={`user-${user.userId}`}
                                        className={`flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${selectedIndex === (searchResults?.tasks?.length || 0) + (searchResults?.projects?.length || 0) + index ? 'bg-blue-50 dark:bg-blue-900' : ''
                                            }`}
                                        onClick={() => handleResultClick({ type: 'user', data: user })}
                                    >
                                        <User className="h-4 w-4 text-purple-500 mr-3 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {user.username}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                User • {user.email}
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                                    </div>
                                ))}

                                {/* Teams */}
                                {searchResults?.teams?.map((team: Team, index: number) => (
                                    <div
                                        key={`team-${team.id}`}
                                        className={`flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${selectedIndex === (searchResults?.tasks?.length || 0) + (searchResults?.projects?.length || 0) + (searchResults?.users?.length || 0) + index ? 'bg-blue-50 dark:bg-blue-900' : ''
                                            }`}
                                        onClick={() => handleResultClick({ type: 'team', data: team })}
                                    >
                                        <Users className="h-4 w-4 text-orange-500 mr-3 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {team.teamname}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                Team • {team.userCount} members
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                                <span>↑↓ Navigate</span>
                                <span>↵ Select</span>
                                <span>Esc Close</span>
                            </div>
                            <span>{getTotalResults()} results</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
