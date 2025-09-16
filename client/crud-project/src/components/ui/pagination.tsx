// import Button from "../../../components/common/button";

import type { PaginationComponentProps } from "../../types/type";
import Button from "../common/button";

export default function PaginationComponent({
  pagination,
  onPageChange,
}: PaginationComponentProps) {
  const { currentPage, totalPages } = pagination;

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Add ellipsis if needed
      if (currentPage > delta + 3) {
        pages.push("ellipsis-start");
      }

      // Add pages around current page
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (currentPage < totalPages - delta - 2) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-wrapper">
      <div className="pagination">
        {/* Previous Button */}
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="secondary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="pagination-pages">
          {pageNumbers.map((page, index) => {
            if (typeof page === "string") {
              return (
                <span key={`${page}-${index}`} className="pagination-ellipsis">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                variant={page === currentPage ? "primary" : "secondary"}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="secondary"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </Button>
      </div>

      {/* Pagination Info */}
      <div className="pagination-info">
        <span className="pagination-summary">
          Page {currentPage} of {totalPages} • {pagination.totalProducts} total
          items
        </span>
      </div>
    </div>
  );
}
