import { useState } from "react";
import Button from "../../components/ui/button";
import ContentWrapper from "../../components/ui/content-wrapper"
import Table, { Column } from "../../components/ui/table";
import { Report } from "../../types";
import { useSearchParams } from "react-router-dom";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";

const data: Report[] = [
    {
        category: 'Laptop',
        total: 50,
        assigned: 30,
        available: 15,
        notAvailable: 3,
        waiting: 1,
        recycled: 1,
    },
    {
        category: 'Monitor',
        total: 70,
        assigned: 45,
        available: 20,
        notAvailable: 2,
        waiting: 2,
        recycled: 1,
    },
    {
        category: 'Keyboard',
        total: 100,
        assigned: 60,
        available: 30,
        notAvailable: 5,
        waiting: 3,
        recycled: 2,
    },
    {
        category: 'Mouse',
        total: 90,
        assigned: 55,
        available: 25,
        notAvailable: 4,
        waiting: 4,
        recycled: 2,
    },
];

type ReportWithId = Report & { id: number };

const columns: Column<ReportWithId>[] = [
    { key: "id", title: "" },
    { key: "category", title: "Category" },
    { key: "total", title: "Total" },
    { key: "assigned", title: "Assigned" },
    { key: "available", title: "Available" },
    { key: "notAvailable", title: "Not available" },
    { key: "waiting", title: "Waiting for recycling" },
    { key: "recycled", title: "Recycled" },
]

const ReportPage = () => {
    const [searchParams] = useSearchParams();

    const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || "category");
    const [orderBy, setOrderBy] = useState<string>(searchParams.get("orderBy") || "asc");

    const dataWithId = data.map((item, index) => ({
        ...item,
        id: index + 1,
    }));

    const exportToExcel = async () => {
        try {

            const exportData = data.map((item, index) => ({
                "No": index + 1,
                "Category": item.category,
                "Total": item.total,
                "Assigned": item.assigned,
                "Available": item.available,
                "Not available": item.notAvailable,
                "Waiting for recycling": item.waiting,
                "Recycled": item.recycled
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);

            const ref = worksheet['!ref'] ?? '';
            const range = XLSX.utils.decode_range(ref);
            worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) };

            // worksheet['!cols'] = [
            //     { wch: 10 },
            //     { wch: 20 },
            //     { wch: 10 },
            //     { wch: 30 },
            // ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

            const excelBuffer = await XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
                compression: true,
            });

            const file = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            saveAs(file, 'data_export.xlsx');


        } catch (error) {
            toast.error(
                (error as any)?.response?.data?.message ||
                (error as Error)?.message ||
                "An unexpected error occurred"
            );
        }
    };

    return (
        <ContentWrapper title={'Report'}>
            <div className="flex justify-end w-full mb-[20px]">
                <Button
                    text="Export"
                    color="primary"
                    onClick={() => exportToExcel()}
                />
            </div>
            <Table
                columns={columns}
                data={dataWithId}
                isDataLoading
            // onSelected={}
            />
        </ContentWrapper>
    )
};

export default ReportPage;