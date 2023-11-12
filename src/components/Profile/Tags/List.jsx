import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Pagination, Table } from 'react-bootstrap';
import apiFetch from '../../../utils/api';

const List = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const { data, isLoading, isError, error } = useQuery(['tags', currentPage], () =>
        apiFetch(`/tags?page=${currentPage}&page_size=${pageSize}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    );

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(data.count / pageSize);

    return (
        <div className="container mt-3">
            <h2>tags</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.results.map((category) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center">
                {[...Array(totalPages).keys()].map((number) => (
                    <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => handlePageChange(number + 1)}
                    >
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
};

export default List;
