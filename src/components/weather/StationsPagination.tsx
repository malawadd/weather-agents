import React from 'react';

interface StationsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalStations: number;
  selectedRegion: string;
  onPageChange: (page: number) => void;
}

export function StationsPagination({
  currentPage,
  totalPages,
  totalStations,
  selectedRegion,
  onPageChange,
}: StationsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="nb-panel p-4">
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="nb-button px-4 py-2 font-bold disabled:opacity-50"
        >
          ← Previous
        </button>
        
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 font-bold text-sm ${
                  currentPage === pageNum 
                    ? 'nb-panel-accent' 
                    : 'nb-button'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && (
            <>
              <span className="px-2">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`px-3 py-2 font-bold text-sm ${
                  currentPage === totalPages 
                    ? 'nb-panel-accent' 
                    : 'nb-button'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="nb-button px-4 py-2 font-bold disabled:opacity-50"
        >
          Next →
        </button>
      </div>
      
      <div className="text-center mt-2 text-sm text-gray-600">
        Page {currentPage} of {totalPages} • {totalStations} total stations
        {selectedRegion && ` in ${selectedRegion}`}
      </div>
    </div>
  );
}