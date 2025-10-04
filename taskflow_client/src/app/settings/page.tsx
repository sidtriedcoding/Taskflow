
'use client';
import Header from "@/components/Header";
import React, { useState, useRef } from "react";
import {
  User,
  Users,
  Briefcase,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Upload,
  Save,
  Edit,
  Eye,
  EyeOff
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userSettings, setUserSettings] = useState({
    username: "johndoe",
    email: "john.doe@example.com",
    teamName: "Development Team",
    roleName: "Developer",
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 123-4567",
    timezone: "UTC-8 (Pacific Time)",
    language: "English",
    notifications: {
      email: true,
      push: true,
      taskUpdates: true,
      projectUpdates: true,
      teamUpdates: false
    }
  });

  const [teamSettings, setTeamSettings] = useState({
    teamName: "Development Team",
    description: "Main development team for the project",
    visibility: "Private",
    defaultProjectSettings: {
      autoAssignTasks: false,
      requireApproval: true,
      defaultPriority: "Medium"
    }
  });

  const [projectSettings, setProjectSettings] = useState({
    defaultTaskSettings: {
      defaultPriority: "Medium",
      defaultStatus: "To Do",
      autoAssignToCreator: true,
      requireDueDate: false
    },
    notificationSettings: {
      taskCreated: true,
      taskUpdated: true,
      taskCompleted: true,
      projectMilestone: true
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'projects', name: 'Projects', icon: Briefcase },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving settings...');
    setIsEditing(false);
  };

  const handleExport = () => {
    const settingsData = {
      userSettings,
      teamSettings,
      projectSettings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const jsonContent = JSON.stringify(settingsData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `taskflow_settings_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedSettings = JSON.parse(content);

        // Safe merge function to ensure all fields have default values
        const safeMergeUserSettings = (imported: any) => {
          return {
            username: imported.username || "johndoe",
            email: imported.email || "john.doe@example.com",
            teamName: imported.teamName || "Development Team",
            roleName: imported.roleName || "Developer",
            firstName: imported.firstName || "John",
            lastName: imported.lastName || "Doe",
            phone: imported.phone || "+1 (555) 123-4567",
            timezone: imported.timezone || "UTC-8 (Pacific Time)",
            language: imported.language || "English",
            notifications: {
              email: imported.notifications?.email ?? true,
              push: imported.notifications?.push ?? true,
              taskUpdates: imported.notifications?.taskUpdates ?? true,
              projectUpdates: imported.notifications?.projectUpdates ?? true,
              teamUpdates: imported.notifications?.teamUpdates ?? false
            }
          };
        };

        const safeMergeTeamSettings = (imported: any) => {
          return {
            teamName: imported.teamName || "Development Team",
            description: imported.description || "Main development team for the project",
            visibility: imported.visibility || "Private",
            defaultProjectSettings: {
              autoAssignTasks: imported.defaultProjectSettings?.autoAssignTasks ?? false,
              requireApproval: imported.defaultProjectSettings?.requireApproval ?? true,
              defaultPriority: imported.defaultProjectSettings?.defaultPriority || "Medium"
            }
          };
        };

        const safeMergeProjectSettings = (imported: any) => {
          return {
            defaultTaskSettings: {
              defaultPriority: imported.defaultTaskSettings?.defaultPriority || "Medium",
              defaultStatus: imported.defaultTaskSettings?.defaultStatus || "To Do",
              autoAssignToCreator: imported.defaultTaskSettings?.autoAssignToCreator ?? true,
              requireDueDate: imported.defaultTaskSettings?.requireDueDate ?? false
            },
            notificationSettings: {
              taskCreated: imported.notificationSettings?.taskCreated ?? true,
              taskUpdated: imported.notificationSettings?.taskUpdated ?? true,
              taskCompleted: imported.notificationSettings?.taskCompleted ?? true,
              projectMilestone: imported.notificationSettings?.projectMilestone ?? true
            }
          };
        };

        // Validate and safely merge the imported settings structure
        if (importedSettings.userSettings) {
          setUserSettings(safeMergeUserSettings(importedSettings.userSettings));
        }
        if (importedSettings.teamSettings) {
          setTeamSettings(safeMergeTeamSettings(importedSettings.teamSettings));
        }
        if (importedSettings.projectSettings) {
          setProjectSettings(safeMergeProjectSettings(importedSettings.projectSettings));
        }

        alert('Settings imported successfully!');
        console.log('Imported settings:', importedSettings);
      } catch (error) {
        console.error('Error parsing settings file:', error);
        alert('Error parsing settings file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const inputStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white";
  const readOnlyStyles = "mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400";

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          <Edit className="h-4 w-4" />
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelStyles}>First Name</label>
          <input
            type="text"
            value={userSettings.firstName || ""}
            onChange={(e) => setUserSettings({ ...userSettings, firstName: e.target.value })}
            className={isEditing ? inputStyles : readOnlyStyles}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelStyles}>Last Name</label>
          <input
            type="text"
            value={userSettings.lastName || ""}
            onChange={(e) => setUserSettings({ ...userSettings, lastName: e.target.value })}
            className={isEditing ? inputStyles : readOnlyStyles}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelStyles}>Username</label>
          <input
            type="text"
            value={userSettings.username || ""}
            onChange={(e) => setUserSettings({ ...userSettings, username: e.target.value })}
            className={isEditing ? inputStyles : readOnlyStyles}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelStyles}>Email</label>
          <input
            type="email"
            value={userSettings.email || ""}
            onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
            className={isEditing ? inputStyles : readOnlyStyles}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelStyles}>Phone</label>
          <input
            type="tel"
            value={userSettings.phone || ""}
            onChange={(e) => setUserSettings({ ...userSettings, phone: e.target.value })}
            className={isEditing ? inputStyles : readOnlyStyles}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelStyles}>Team</label>
          <input
            type="text"
            value={userSettings.teamName || ""}
            className={readOnlyStyles}
            disabled
          />
        </div>
        <div>
          <label className={labelStyles}>Role</label>
          <input
            type="text"
            value={userSettings.roleName || ""}
            className={readOnlyStyles}
            disabled
          />
        </div>
        <div>
          <label className={labelStyles}>Timezone</label>
          <select
            value={userSettings.timezone || ""}
            onChange={(e) => setUserSettings({ ...userSettings, timezone: e.target.value })}
            className={isEditing ? inputStyles : readOnlyStyles}
            disabled={!isEditing}
          >
            <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
            <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
            <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
            <option value="UTC+1 (CET)">UTC+1 (CET)</option>
          </select>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Team Settings</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelStyles}>Team Name</label>
          <input
            type="text"
            value={teamSettings.teamName || ""}
            onChange={(e) => setTeamSettings({ ...teamSettings, teamName: e.target.value })}
            className={inputStyles}
          />
        </div>
        <div>
          <label className={labelStyles}>Visibility</label>
          <select
            value={teamSettings.visibility || ""}
            onChange={(e) => setTeamSettings({ ...teamSettings, visibility: e.target.value })}
            className={inputStyles}
          >
            <option value="Private">Private</option>
            <option value="Public">Public</option>
            <option value="Restricted">Restricted</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelStyles}>Team Description</label>
        <textarea
          value={teamSettings.description || ""}
          onChange={(e) => setTeamSettings({ ...teamSettings, description: e.target.value })}
          rows={3}
          className={inputStyles}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">Default Project Settings</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={teamSettings.defaultProjectSettings.autoAssignTasks}
              onChange={(e) => setTeamSettings({
                ...teamSettings,
                defaultProjectSettings: {
                  ...teamSettings.defaultProjectSettings,
                  autoAssignTasks: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Auto-assign tasks to team members</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={teamSettings.defaultProjectSettings.requireApproval}
              onChange={(e) => setTeamSettings({
                ...teamSettings,
                defaultProjectSettings: {
                  ...teamSettings.defaultProjectSettings,
                  requireApproval: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Require approval for task completion</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Settings</h3>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">Default Task Settings</h4>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className={labelStyles}>Default Priority</label>
            <select
              value={projectSettings.defaultTaskSettings.defaultPriority || ""}
              onChange={(e) => setProjectSettings({
                ...projectSettings,
                defaultTaskSettings: {
                  ...projectSettings.defaultTaskSettings,
                  defaultPriority: e.target.value
                }
              })}
              className={inputStyles}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className={labelStyles}>Default Status</label>
            <select
              value={projectSettings.defaultTaskSettings.defaultStatus || ""}
              onChange={(e) => setProjectSettings({
                ...projectSettings,
                defaultTaskSettings: {
                  ...projectSettings.defaultTaskSettings,
                  defaultStatus: e.target.value
                }
              })}
              className={inputStyles}
            >
              <option value="To Do">To Do</option>
              <option value="Work In Progress">Work In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={projectSettings.defaultTaskSettings.autoAssignToCreator}
              onChange={(e) => setProjectSettings({
                ...projectSettings,
                defaultTaskSettings: {
                  ...projectSettings.defaultTaskSettings,
                  autoAssignToCreator: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Auto-assign tasks to creator</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={projectSettings.defaultTaskSettings.requireDueDate}
              onChange={(e) => setProjectSettings({
                ...projectSettings,
                defaultTaskSettings: {
                  ...projectSettings.defaultTaskSettings,
                  requireDueDate: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Require due date for all tasks</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h3>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">Delivery Methods</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userSettings.notifications.email}
              onChange={(e) => setUserSettings({
                ...userSettings,
                notifications: {
                  ...userSettings.notifications,
                  email: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userSettings.notifications.push}
              onChange={(e) => setUserSettings({
                ...userSettings,
                notifications: {
                  ...userSettings.notifications,
                  push: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Push notifications</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">What to notify me about</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userSettings.notifications.taskUpdates}
              onChange={(e) => setUserSettings({
                ...userSettings,
                notifications: {
                  ...userSettings.notifications,
                  taskUpdates: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Task updates and changes</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userSettings.notifications.projectUpdates}
              onChange={(e) => setUserSettings({
                ...userSettings,
                notifications: {
                  ...userSettings.notifications,
                  projectUpdates: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Project updates</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userSettings.notifications.teamUpdates}
              onChange={(e) => setUserSettings({
                ...userSettings,
                notifications: {
                  ...userSettings.notifications,
                  teamUpdates: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Team updates</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>

      <div className="space-y-4">
        <div>
          <label className={labelStyles}>Current Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={inputStyles}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>
        <div>
          <label className={labelStyles}>New Password</label>
          <input
            type="password"
            className={inputStyles}
            placeholder="Enter new password"
          />
        </div>
        <div>
          <label className={labelStyles}>Confirm New Password</label>
          <input
            type="password"
            className={inputStyles}
            placeholder="Confirm new password"
          />
        </div>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Update Password
        </button>
      </div>

      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add an extra layer of security to your account.
        </p>
        <button className="mt-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
          Enable 2FA
        </button>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance Settings</h3>

      <div className="space-y-4">
        <div>
          <label className={labelStyles}>Theme</label>
          <select className={inputStyles}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label className={labelStyles}>Language</label>
          <select
            value={userSettings.language || ""}
            onChange={(e) => setUserSettings({ ...userSettings, language: e.target.value })}
            className={inputStyles}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'team':
        return renderTeamTab();
      case 'projects':
        return renderProjectsTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'appearance':
        return renderAppearanceTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="p-6">
          <Header name="Settings" />
        </div>
        <nav className="px-4 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {tabs.find(tab => tab.id === activeTab)?.name} Settings
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your {activeTab} preferences and configuration.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <Upload className="h-4 w-4" />
                Import
              </button>
            </div>
          </div>

          {renderTabContent()}
        </div>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Settings;
