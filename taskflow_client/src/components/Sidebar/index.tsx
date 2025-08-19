'use client';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  Home,
  Search,
  Users,
  Clock,
  Settings,
  AlertCircle,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Briefcase,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGetProjectsQuery } from '../../state';

interface NavItem {
  name: string;
  icon: React.ElementType;
  href: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}

interface NavItemProps {
  item: NavItem;
  isActive?: boolean;
  isCollapsed: boolean;
}

const navigationItems: NavItem[] = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Timeline', icon: Clock, href: '/timeline' },
  { name: 'Search', icon: Search, href: '/search' },
  { name: 'Settings', icon: Settings, href: '/settings' },
  { name: 'Users', icon: Users, href: '/users' },
  { name: 'Teams', icon: Users, href: '/teams' },
];

const priorityItems: NavItem[] = [
  { name: 'Urgent', icon: AlertCircle, href: '/priority/urgent' },
  { name: 'High', icon: Shield, href: '/priority/high' },
  { name: 'Medium', icon: Shield, href: '/priority/medium' },
  { name: 'Low', icon: Shield, href: '/priority/low' },
  { name: 'Backlog', icon: Layers, href: '/backlog' },
];

// SidebarLink component
const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  isActive = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
      isCollapsed ? 'justify-center' : ''
    } ${
      isActive
        ? 'border-r-2 border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`}
  >
    <Icon
      className={`h-5 w-5 flex-shrink-0 ${
        isActive
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-500 dark:text-gray-400'
      }`}
    />
    {!isCollapsed && <span className="truncate">{label}</span>}
  </Link>
);

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) => {
  const [isPriorityExpanded, setIsPriorityExpanded] = useState(true);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Use Redux Toolkit Query for projects
  const {
    data: projects = [],
    error: projectsError,
    isLoading: isLoadingProjects,
    refetch: refetchProjects,
    isFetching: isRefreshing,
  } = useGetProjectsQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
    refetchOnFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when connection is restored
  });

  // Debug logging
  React.useEffect(() => {
    console.log('=== PROJECTS DEBUG ===');
    console.log('Projects data:', projects);
    console.log('Projects error:', projectsError);
    console.log('Is loading:', isLoadingProjects);
    console.log('Is fetching:', isRefreshing);
    console.log('Mounted:', mounted);
    if (projectsError) {
      console.log('Error details:', JSON.stringify(projectsError, null, 2));
    }
  }, [projects, projectsError, isLoadingProjects, isRefreshing, mounted]);

  // Manual refresh function
  const refreshProjects = () => {
    refetchProjects();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const NavItem = ({ item, isActive = false, isCollapsed }: NavItemProps) => (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        isCollapsed ? 'justify-center' : ''
      } ${
        isActive
          ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-500'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      }`}
    >
      <item.icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive
            ? 'text-blue-600 dark:text-blue-500'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      />
      {!isCollapsed && <span className="truncate">{item.name}</span>}
    </Link>
  );

  const SectionHeader = ({
    title,
    isExpanded,
    onToggle,
    showRefresh = false,
    onRefresh,
    isRefreshing = false,
  }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    showRefresh?: boolean;
    onRefresh?: () => void;
    isRefreshing?: boolean;
  }) => (
    <div className="mb-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
      {!isCollapsed && <span className="font-medium">{title}</span>}
      {!isCollapsed && (
        <div className="flex items-center gap-1">
          {showRefresh && onRefresh && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              disabled={isRefreshing}
              className="rounded p-1 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
              title="Refresh projects"
            >
              <RefreshCw
                className={`h-4 w-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          )}
          <button
            onClick={onToggle}
            className="rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      )}
    </div>
  );

  const ProjectsSection = () => {
    if (isLoadingProjects && !isCollapsed) {
      return (
        <div className="py-1 pl-2 text-sm italic text-gray-500 dark:text-gray-400">
          Loading projects...
        </div>
      );
    }

    if (projectsError && !isCollapsed) {
      return (
        <div className="py-1 pl-2 text-sm italic text-red-500 dark:text-red-400">
          Failed to load projects
        </div>
      );
    }

    if (!projects || projects.length === 0) {
      if (!isLoadingProjects && !isCollapsed) {
        return (
          <div className="py-1 pl-2 text-sm italic text-gray-500 dark:text-gray-400">
            No projects yet
          </div>
        );
      }
      return null;
    }

    return (
      <div className="space-y-1">
        {projects.map((project) => (
          <SidebarLink
            key={project.id}
            href={`/projects/${project.id}`}
            icon={Briefcase}
            label={project.teamname}
            isCollapsed={isCollapsed}
            isActive={pathname === `/projects/${project.id}`}
          />
        ))}
      </div>
    );
  };

  const SidebarContent = () => {
    if (!mounted) {
      return (
        <div className="h-full bg-white dark:bg-gray-900">
          <div className="animate-pulse">
            <div className="mx-3 my-3 h-12 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
            <div className="space-y-3 px-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 rounded-lg bg-gray-100 dark:bg-gray-800"
                ></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 h-full overflow-y-auto">
        {/* Team Section */}
        <div className="border-b border-gray-100 px-3 py-3 dark:border-gray-800">
          <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-blue-600 font-bold text-white">
              S
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  Sid's Team
                </h3>
                <p className="text-xs text-gray-500">Private</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Projects Section */}
        <div className="mt-2 border-t border-gray-100 px-3 pt-2 dark:border-gray-800">
          <SectionHeader
            title="Projects"
            isExpanded={isProjectsExpanded}
            onToggle={() => setIsProjectsExpanded(!isProjectsExpanded)}
            showRefresh={true}
            onRefresh={refreshProjects}
            isRefreshing={isRefreshing}
          />
          {isProjectsExpanded && <ProjectsSection />}
        </div>

        {/* Priority Section */}
        <div className="mt-2 border-t border-gray-100 px-3 pt-2 dark:border-gray-800">
          <SectionHeader
            title="Priority"
            isExpanded={isPriorityExpanded}
            onToggle={() => setIsPriorityExpanded(!isPriorityExpanded)}
          />
          {isPriorityExpanded && (
            <div className="space-y-1">
              {priorityItems.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  isActive={pathname === item.href}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] border-r border-gray-100 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:flex lg:flex-col ${isCollapsed ? 'w-[4.5rem]' : 'w-60'}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mounted && (
        <div
          className={`lg:hidden ${isMobileOpen ? 'fixed inset-0 z-50' : 'hidden'}`}
        >
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed left-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-64 flex-col bg-white shadow-xl dark:bg-gray-900">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Mobile Toggle Button */}
      {mounted && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-4 right-4 z-30 rounded-full bg-blue-600 p-3 text-white shadow-lg transition-colors hover:bg-blue-700 lg:hidden"
        >
          <Home className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
