import React from 'react'
import AuthLayout from '../../layouts/Layout'
import ArticleUpdate from '../../components/articles/ArticleUpdate'
import { useParams } from 'react-router-dom'

const UpdateArticle = () => {
    const { articleId } = useParams();
  return (
    <AuthLayout>
        <ArticleUpdate articleId={articleId} />
    </AuthLayout>
  )
}

export default UpdateArticle