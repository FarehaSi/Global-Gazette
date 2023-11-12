import React, { useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import ListSingleView from './ListSingleView';
import apiFetch from '../../utils/api';
import Skeleton from './Skeleton';
import { CLOUDINARY_URL } from '../../data/config';
import ArticlesFilters from './ArticlesFilters';


const fetchCategories = async () => {
    const res = await apiFetch(`/categories`, { method: 'GET' }, false);
    return res;
};

const fetchArticles = async ({ pageParam = 1, queryKey }) => {
    const [_key, filter, searchTerm] = queryKey;
    let endpoint;
    if (filter === 'followed') {
        endpoint = `/articles/user/following/?page=${pageParam}`;
    } else {
        const searchQueryParam = searchTerm ? `&search=${searchTerm}` : '';
        endpoint = `/articles/search/?page=${pageParam}${searchQueryParam}`;
    }
    const res = await apiFetch(endpoint, { method: 'GET' }, true);
    return res;
};


const AuthArticles = () => {
    const skeletonPlaceholderCount = 5;

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [filter, setFilter] = useState('all'); 

    const fetchArticles = async ({ pageParam = 1, queryKey }) => {
        const [_key, filter, searchTerm, categoryId] = queryKey;
        let endpoint = '/articles/?';
        if (filter === 'followed') {
            endpoint += `following=true&`;
        }
        if (searchTerm) {
            endpoint += `search=${searchTerm}&`;
        }
        if (categoryId) {
            endpoint += `category_ids=${categoryId}&`;
        }
        endpoint += `page=${pageParam}`;
        
        const res = await apiFetch(endpoint, { method: 'GET' }, false);
        return res;
    };

    const onCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const fetchFollowedWritersArticles = () => {
        setFilter('followed');
    };

    const fetchAllArticles = () => {
        setFilter('all');
    };

    const resetFiltersAndFetchAll = () => {
        setSearchTerm('');
    };

    useEffect(() => {
        fetchCategories().then(data => {
            setCategories(data.results);
        });
    }, []);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch,
        remove
    } = useInfiniteQuery(
        ['articles', filter, searchTerm, selectedCategory], 
        fetchArticles,
        {
            getNextPageParam: (lastPage, _pages) => {
                if (lastPage.next) {
                    const url = new URL(lastPage.next);
                    const nextPage = url.searchParams.get("page");
                    return Number(nextPage);
                }
                return undefined;
            },
            enabled: filter === 'all' ? (searchTerm.length === 0 || searchTerm.length > 2) : true,
            onSuccess: () => {
                // Additional logic if needed when new data is fetched
            }
        }
    );

    useEffect(() => {
        remove();
        refetch();
    }, [filter, refetch, remove]);

    // const fetchFollowedWritersArticles = async () => {
    //     try {
    //         const followedArticles = await apiFetch('/articles/user/following/');
    //     } catch (error) {
    //         console.error('Failed to fetch articles by followed writers:', error);
    //     }
    // };

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                <div className="col-md-8">
                    <ArticlesFilters 
                        onAllPostsClick={fetchAllArticles}
                        onFollowedWritersClick={fetchFollowedWritersArticles}
                        selectedCategory={selectedCategory}
                        onCategoryChange={onCategoryChange}
                    />
                    {status === 'loading' ? (
                        Array.from({ length: skeletonPlaceholderCount }, (_, index) => (
                            <Skeleton key={index} />
                        ))
                    ) : status === 'error' ? (
                        <span>Error: {error.message}</span>
                    ) : (
                        <>
                            {data?.pages.map((group, i) => (
                                <React.Fragment key={i}>
                                    {group.results.map(article => (
                                        <ListSingleView
                                            key={article.id}
                                            articleId={article.id}
                                            author={article.author.username}
                                            title={article.title}
                                            snippet={article.truncated_content}
                                            date={new Date(article.created_at).toLocaleDateString()}
                                            likes={article.like_count}
                                            comments={article.comment_count}
                                            tags={article.tags}
                                            category={article.category}
                                            thumbnail={`${CLOUDINARY_URL}${article.thumbnail}`}
                                        />
                                        
                                    ))}
                                </React.Fragment>
                            ))}
                            <div>
                                {isFetchingNextPage
                                    ? 'Loading more...'
                                    : hasNextPage
                                        ? 'Load More'
                                        : <hr />}
                            </div>
                        </>
                    )}
                </div>

                <div className="col-md-4">
                    <div className="sticky-top" style={{ top: '70px' }}>
                        <div className="mb-4">
                            <h1>Explore the world</h1>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        {/* <h2 className="mb-3">Discover more of what matters to you</h2>
                        <div className="row">
                            {categories.map((category) => (
                                <div key={category.id} className="col">
                                    <a href="#" className="btn btn-light btn-block mb-2 text-start">
                                        {category.name}
                                    </a>
                                </div>
                            ))}
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthArticles;
