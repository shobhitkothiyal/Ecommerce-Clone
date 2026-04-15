import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex items-center justify-start gap-2 mt-6">
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-lg bg-slate-700/50 border border-slate-600/50 flex items-center justify-center text-slate-300 hover:bg-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const pageNum = index + 1;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
              currentPage === pageNum
                ? "bg-purple-600 text-white"
                : "bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-lg bg-slate-700/50 border border-slate-600/50 flex items-center justify-center text-slate-300 hover:bg-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;