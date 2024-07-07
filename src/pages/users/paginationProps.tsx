import React from "react";

interface PaginationProps {
    total: number;
    page: number;
    pageCount: number;
    size: number;
    onPageChange: (page: number) => void;
}

function Pagination({ total, page, pageCount, size, onPageChange }: PaginationProps) {

    function handlePageClick(newPage: number) {
        onPageChange(newPage);
        return false; // Prevent default scrolling behavior
    }

    return (
        <nav>
            <ul className="pagination">
                {Array.from({ length: pageCount }).map((_, index) => (
                    <li key={index} className={`page-item ${index + 1 === page ? "active" : ""}`}>
                        <a href={`#page${index + 1}`} className="page-link" onClick={() => handlePageClick(index + 1)} >
                            {index + 1}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Pagination;
