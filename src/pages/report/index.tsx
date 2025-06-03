import { useEffect, useState } from "react";
import Button from "../../components/ui/button";
import ContentWrapper from "../../components/ui/content-wrapper"
import Table, { Column } from "../../components/ui/table";
import { Report } from "../../types";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import reportApi from "../../api/reportApi";

type ReportWithId = Report & { id: number };

const columns: Column<ReportWithId>[] = [
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
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState<boolean>(true);
    const [reportData, setReportData] = useState<Report[]>([]);
    const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || "category");
    const [orderBy, setOrderBy] = useState<string>(searchParams.get("orderBy") || "asc");

    const sortedData = [...reportData].sort((a, b) => {
        const key = sortBy as keyof Report;
        const aValue = a[key];
        const bValue = b[key];

        if (key === "category") {
            return orderBy === "asc"
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        } else {
            return orderBy === "asc"
                ? Number(aValue) - Number(bValue)
                : Number(bValue) - Number(aValue);
        }
    });

    const dataWithId = sortedData.map((item, index) => ({
        ...item,
        id: index + 1,
    }));

    const exportToExcel = async () => {
        try {

            const exportData = sortedData.map((item, index) => ({
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

            worksheet['!cols'] = [
                { wch: 10 },
                { wch: 20 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10 },
                { wch: 15 },
                { wch: 25 },
                { wch: 10 }
            ];

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
                "Error when exporting file"
            );
        }
    };

    useEffect(() => {
        const newSortBy = searchParams.get("sortBy") || "category";
        const newOrderBy = searchParams.get("orderBy") || "asc";
        setSortBy(newSortBy);
        setOrderBy(newOrderBy);
    }, [searchParams]);

    useEffect(() => {

        const params = new URLSearchParams();
        params.set("sortBy", sortBy);
        params.set("orderBy", orderBy);

        const newSearch = params.toString();
        if (location.search !== `?${newSearch}`) {
            navigate({
                pathname: location.pathname,
                search: newSearch
            }, { replace: false });
        }
    }, [sortBy, orderBy]);

    useEffect(() => {
        const fetchReportList = async () => {
            try {
                const response = await reportApi.getReportList()
                setLoading(true);
                setReportData(response.data)
            } catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false);
            }
        }
        fetchReportList()
    }, [])

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
                isDataLoading={loading}
                onSort={(key, direction) => {
                    setSortBy(key)
                    setOrderBy(direction)
                }}
                sortBy={sortBy as keyof Report}
                orderBy={orderBy}
            />

        </ContentWrapper>
    )
};

export default ReportPage;