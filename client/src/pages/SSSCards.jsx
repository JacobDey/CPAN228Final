import { useEffect, useState } from "react";
import SSSCardContainer from "../components/SSSCardContainer.jsx";
import SSSCardFilter from "../components/SSSCardFilter.jsx";
import { Spinner, Alert, Container, Pagination, Form } from "react-bootstrap";

function SSSCards() {
    const [cardData, setCardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});
    const [pagination, setPagination] = useState({
        page: 0,
        size: 6,
        totalPages: 1,
        totalElements: 0
    });
    const [sortConfig, setSortConfig] = useState({
        field: "colour",
        direction: "asc"
    });

    const fetchCards = async (filters = {}, page = 0, size = 6, sortField = "colour", sortDirection = "asc") => {
        try {
            setLoading(true);
            
            let url = `http://localhost:8080/card/cards?page=${page}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`;
            
            // Apply filters if any
            if (filters.name) {
                url = `http://localhost:8080/card/name/${filters.name}?page=${page}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`;
            } else if (filters.colour) {
                url = `http://localhost:8080/card/colour/${filters.colour}?page=${page}&size=${size}`;
            } else if (filters.power) {
                url = `http://localhost:8080/card/power/${filters.power}?page=${page}&size=${size}&sortField=power&sortDirection=${sortDirection}`;
            } else if (filters.minPower && filters.maxPower) {
                url = `http://localhost:8080/card/power/${filters.minPower}/${filters.maxPower}?page=${page}&size=${size}&sortField=power&sortDirection=${sortDirection}`;
            } else if (filters.minPower) {
                url = `http://localhost:8080/card/power/min/${filters.minPower}?page=${page}&size=${size}&sortField=power&sortDirection=${sortDirection}`;
            } else if (filters.maxPower) {
                url = `http://localhost:8080/card/power/max/${filters.maxPower}?page=${page}&size=${size}&sortField=power&sortDirection=${sortDirection}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setCardData(data.content);
            setPagination({
                page: data.pageable.pageNumber,
                size: data.size,
                totalPages: data.totalPages,
                totalElements: data.totalElements
            });
            setError(null);
        } catch (err) {
            console.error("Error fetching cards:", err);
            setError(err.message);
            setCardData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const applyFilters = (filters) => {
        setActiveFilters(filters);
        fetchCards(filters, 0, pagination.size, sortConfig.field, sortConfig.direction);
    };

    const handlePageChange = (page) => {
        fetchCards(activeFilters, page, pagination.size, sortConfig.field, sortConfig.direction);
    };

    const handleSortChange = (field) => {
        const direction = sortConfig.field === field && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ field, direction });
        fetchCards(activeFilters, 0, pagination.size, field, direction);
    };

    return (
        <Container>
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Card Collection</h1>
                
                <SSSCardFilter applyFilters={applyFilters} />
                
                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <Form.Select 
                            value={sortConfig.field}
                            onChange={(e) => handleSortChange(e.target.value)}
                            style={{ width: '200px' }}
                        >
                            <option value="colour">Sort by Colour</option>
                            <option value="power">Sort by Power</option>
                            <option value="name">Sort by Name</option>
                        </Form.Select>
                        <small className="text-muted ms-2">
                            {sortConfig.direction === 'asc' ? '↑ Ascending' : '↓ Descending'}
                        </small>
                    </div>
                </div>
                
                {Object.keys(activeFilters).length > 0 && (
                    <Alert variant="info" className="mb-3">
                        Showing filtered results. {pagination.totalElements} card(s) found.
                    </Alert>
                )}
                
                {loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )}
                
                {error && (
                    <Alert variant="danger">
                        Failed to load cards: {error}
                    </Alert>
                )}
                
                {!loading && !error && cardData.length > 0 && (
                    <>
                        <SSSCardContainer cards={cardData} />
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                                <Pagination.First 
                                    onClick={() => handlePageChange(0)} 
                                    disabled={pagination.page === 0} 
                                />
                                <Pagination.Prev 
                                    onClick={() => handlePageChange(pagination.page - 1)} 
                                    disabled={pagination.page === 0} 
                                />
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i;
                                    } else if (pagination.page <= 2) {
                                        pageNum = i;
                                    } else if (pagination.page >= pagination.totalPages - 3) {
                                        pageNum = pagination.totalPages - 5 + i;
                                    } else {
                                        pageNum = pagination.page - 2 + i;
                                    }
                                    return (
                                        <Pagination.Item
                                            key={pageNum}
                                            active={pageNum === pagination.page}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum + 1}
                                        </Pagination.Item>
                                    );
                                })}
                                <Pagination.Next 
                                    onClick={() => handlePageChange(pagination.page + 1)} 
                                    disabled={pagination.page === pagination.totalPages - 1} 
                                />
                                <Pagination.Last 
                                    onClick={() => handlePageChange(pagination.totalPages - 1)} 
                                    disabled={pagination.page === pagination.totalPages - 1} 
                                />
                            </Pagination>
                        </div>
                    </>
                )}
                
                {!loading && !error && cardData.length === 0 && (
                    <Alert variant="warning">
                        No cards found for the selected filters.
                    </Alert>
                )}
            </div>
        </Container>
    );
}

export default SSSCards;