import { SxProps, Theme } from '@mui/material/styles';

export const dataGridSxStyles = (isDarkMode: boolean): SxProps<Theme> => {
  const commonStyles = {
    border: 0,
    '& .MuiDataGrid-iconSeparator': {
      display: 'none',
    },
    
    '& .MuiDataGrid-columnsContainer, & .MuiDataGrid-cell': {
      borderBottom: `1px solid ${isDarkMode ? '#1F2937' : '#E5E7EB'}`,
    },
    
    '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
      borderRight: 0,
    },
  };

  if (isDarkMode) {
    return {
      ...commonStyles,
      backgroundColor: '#111827', // Main dark background
      color: '#E5E7EB', // Light gray text
      '& .MuiDataGrid-columnHeader': {
        backgroundColor: '#1F2937', // Header background
        color: '#9CA3AF', // Header text color
        fontWeight: 'bold',
      },
      '& .MuiDataGrid-cell': {
        color: '#D1D5DB',
      },
      '& .MuiDataGrid-footerContainer': {
        backgroundColor: '#111827',
        color: '#9CA3AF',
        borderTop: 'none',
      },
      '& .MuiTablePagination-root, & .MuiIconButton-root': {
        color: '#9CA3AF',
      },
      '& .MuiDataGrid-row:hover': {
        backgroundColor: '#1F2937',
      },
    };
  }

  
  return {
    ...commonStyles,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: '#F9FAFB',
      color: '#6B7280',
      fontWeight: 'bold',
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: '#FFFFFF',
      borderTop: `1px solid #E5E7EB`,
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#F9FAFB',
    },
  };
};
