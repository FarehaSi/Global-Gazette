import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { CLOUDINARY_URL } from '../../../data/config';
import apiFetch from '../../../utils/api';
import ListSingleView from '../../articles/ListSingleView';
import Skeleton from '../../articles/Skeleton';

const fetchUserArticles = async ({ pageParam = 1, userId }) => {
    const res = await apiFetch(`/articles/users/${userId}?page=${pageParam}`, { method: 'GET' }, false);
    return res;
};

const UserArticles = ({ userId }) => {
    const skeletonPlaceholderCount = 5;

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery(
        ['userArticles', userId],
        ({ pageParam = 1 }) => fetchUserArticles({ pageParam, userId }),
        {
            getNextPageParam: (lastPage) => {
                if (lastPage.next) {
                    const url = new URL(lastPage.next);
                    const nextPage = url.searchParams.get("page");
                    return Number(nextPage);
                }
                return undefined;
            },
        }
    );

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
                <div className="col">
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
                                            thumbnail={article.thumbnail ? `${CLOUDINARY_URL}${article.thumbnail}` : 'default_thumbnail_url'}
                                            category={article.category}
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                            {isFetchingNextPage && <div>Loading more...</div>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserArticles;
