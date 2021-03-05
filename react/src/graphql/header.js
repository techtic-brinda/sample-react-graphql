import gql from 'graphql-tag';

const HeaderPages = gql`
fragment HeaderPages on Page {
    id
    slug
    title
    content
}
`
const PageDetail = gql`
fragment PageDetail on Page {
    content
    createdAt
    id
    metaDescription
    metaKeywords
    metaTitle
    slug
    status
    title
}
`
export const HeaderFragment = {
  HeaderPages,
  PageDetail,
}