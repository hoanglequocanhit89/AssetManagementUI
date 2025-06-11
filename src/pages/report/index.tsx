import { useEffect, useRef, useState } from "react";
import Button from "../../components/ui/button";
import ContentWrapper from "../../components/ui/content-wrapper";
import Table, { Column } from "../../components/ui/table";
import { BaseResponse, Report } from "../../types";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import reportApi from "../../api/reportApi";
import Pagination from "../../components/ui/pagination";
import PageSizeSelect from "../../components/ui/page-size-select";

type ReportWithId = Report & { id: number };

const columns: Column<ReportWithId>[] = [
  { key: "category", title: "Category" },
  { key: "total", title: "Total" },
  { key: "assigned", title: "Assigned" },
  { key: "available", title: "Available" },
  { key: "notAvailable", title: "Not available" },
  { key: "waiting", title: "Waiting for recycling" },
  { key: "recycled", title: "Recycled" },
];

const ReportPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [showExportPopover, setShowExportPopover] = useState(false);
  const exportBtnRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [reportData, setReportData] = useState<BaseResponse<Report>>();
  const [allReportData, setAllReportData] = useState<Report[]>([]);
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || "category");
  const [orderBy, setOrderBy] = useState<string>(searchParams.get("orderBy") || "asc");
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);
  const [pageSize, setPageSize] = useState<number>(Number(searchParams.get("size")) || 20);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const dataWithId = reportData?.data.content.map((item, index) => ({
    ...item,
    id: index + 1,
  }));

  const exportToExcel = async (option: "all" | "current") => {
    try {
      let optionData: Report[] = [];

      if (option === "all") {
        if (!allReportData || allReportData.length === 0) {
          const response = await reportApi.getReportList();
          optionData = response.data;
          setAllReportData(response.data);
        } else {
          optionData = allReportData;
        }
      } else {
        optionData = reportData?.data.content ?? [];
      }

      const exportData = optionData.map((item, index) => ({
        No: index + 1,
        Category: item.category,
        Total: item.total,
        Assigned: item.assigned,
        Available: item.available,
        "Not available": item.notAvailable,
        "Waiting for recycling": item.waiting,
        Recycled: item.recycled,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData ?? []);
      const ref = worksheet["!ref"] ?? "";
      const range = XLSX.utils.decode_range(ref);
      worksheet["!autofilter"] = { ref: XLSX.utils.encode_range(range) };
      worksheet["!cols"] = [
        { wch: 10 },
        { wch: 20 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 25 },
        { wch: 10 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      const excelBuffer = await XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        compression: true,
      });

      const file = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const now = new Date();
      const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
        .getHours()
        .toString()
        .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      saveAs(file, `data_export_${timestamp}.xlsx`);
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
    const newCurrentPage = Number(searchParams.get("page")) || 1;
    setSortBy(newSortBy);
    setOrderBy(newOrderBy);
    setCurrentPage(newCurrentPage);
    setPageSize(Number(searchParams.get("size")) || 20);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();

    params.set("page", currentPage.toString());
    params.set("sortBy", sortBy);
    params.set("orderBy", orderBy);
    params.set("size", pageSize.toString());

    const newSearch = params.toString();
    if (location.search !== `?${newSearch}`) {
      navigate(
        {
          pathname: location.pathname,
          search: newSearch,
        },
        { replace: false }
      );
    }
  }, [currentPage, sortBy, orderBy, pageSize]);

  useEffect(() => {
    const fetchReportList = async () => {
      try {
        setLoading(true);
        const response = await reportApi.getReportListWithPagination({
          page: currentPage - 1,
          size: pageSize,
          sortBy: sortBy,
          sortDir: orderBy,
        });
        setReportData(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportList();
  }, [orderBy, sortBy, currentPage, pageSize]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportBtnRef.current && !exportBtnRef.current.contains(event.target as Node)) {
        setShowExportPopover(false);
      }
    }
    if (showExportPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportPopover]);

  return (
    <ContentWrapper title={"Report"}>
      <div className="flex justify-end w-full mb-[20px] relative">
        <Button
          text="Export"
          color="primary"
          onClick={() => setShowExportPopover((prev) => !prev)}
        />

        {showExportPopover && (
          <div
            className="absolute right-0 mt-[40px] w-fit bg-white border border-gray-300 rounded-lg shadow-lg z-20"
            ref={exportBtnRef}
          >
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setShowExportPopover(false);
                exportToExcel("all");
              }}
            >
              <i className="fa-solid fa-file-arrow-down mr-4 text-[var(--primary-color)]"></i>
              Export All Data
            </div>

            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setShowExportPopover(false);
                exportToExcel("current");
              }}
            >
              {" "}
              <i className="fa-solid fa-file-lines mr-4 text-[var(--primary-color)]"></i>
              Export Current page
            </div>
          </div>
        )}
      </div>

      <Table
        columns={columns}
        data={dataWithId ?? []}
        isDataLoading={loading}
        onSort={(key, direction) => {
          setSortBy(key);
          setOrderBy(direction);
        }}
        sortBy={sortBy as keyof Report}
        orderBy={orderBy}
      />

      {/* pagination */}
      <div className="flex justify-between items-center w-full m-auto mt-[20px]">
        <span className="text-2xl text-gray-500 font-semibold w-1/4">
          {reportData?.data.totalElements ?? 0}{" "}
          {reportData?.data.totalElements === 1 ? "result" : "results"} found
        </span>
        <div className="flex justify-end w-full">
          <PageSizeSelect value={pageSize} setValue={setPageSize} />
          <Pagination
            currentPage={currentPage}
            totalPages={reportData?.data.totalPages ?? 0}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ReportPage;
