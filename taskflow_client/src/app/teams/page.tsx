"use client";
import { useGetTeamsQuery } from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../hooks";
import Header from "@/components/Header";
import {
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridSxStyles } from "@/lib/utils";
import ModalNewTeam from "@/components/ModalNewTeam";
import { Plus } from "lucide-react";

const CustomToolbar = () => (
    <GridToolbarContainer className="toolbar flex gap-2">
        <GridToolbarFilterButton />
        <GridToolbarExport />
    </GridToolbarContainer>
);

const columns: GridColDef[] = [
    { field: "id", headerName: "Team ID", width: 100 },
    { field: "teamname", headerName: "Team Name", width: 200 },
    { field: "productOwnerUsername", headerName: "Product Owner", width: 200 },
    { field: "userCount", headerName: "Member Count", width: 150 },
];

const Teams = () => {
    const { data: teams, isLoading, isError } = useGetTeamsQuery();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const [isModalNewTeamOpen, setIsModalNewTeamOpen] = useState(false);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !teams) return <div>Error fetching teams</div>;

    return (
        <div className="flex w-full flex-col p-8">
            <div className="mb-6 flex items-center justify-between">
                <Header name="Teams" />
                <button
                    onClick={() => setIsModalNewTeamOpen(true)}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    New Team
                </button>
            </div>

            <ModalNewTeam
                isOpen={isModalNewTeamOpen}
                onClose={() => setIsModalNewTeamOpen(false)}
            />

            <div style={{ height: 650, width: "100%" }}>
                <DataGrid
                    rows={teams || []}
                    columns={columns}
                    pagination
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    className="data-grid-container"
                    sx={dataGridSxStyles(isDarkMode)}
                />
            </div>
        </div>
    );
};

export default Teams;
