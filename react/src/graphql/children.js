import gql from 'graphql-tag';
import { OrphanEducationsFragment } from './orphan-educations';
import { OrphanHealthsFragment } from './orphan-healths';
const BasicOrphanChild = gql`
fragment BasicOrphanChild on Orphan {
    id
    firstName
    middelName
    dateOfBirth
    countryOfBirth
    userId
    image
    institutionId
    comments
}
`
const FullOrphanChild = gql`
fragment FullOrphanChild on Orphan {
    id
    firstName
    lastName
    middelName
    dateOfBirth
    countryOfBirth
    placeOfBirth
    nationality
    noYearsInInstitution
    comments
    image
    
    orphanNeeds {
      nodes {
        id
        amount
        closeDate
        title
        description
        receivedDonationAmount
      }
	  }
    orphanEducations {
        nodes {
          ...FullOrphanEducations
        }
      }
    orphanHealths {
        nodes {
          ...FullOrphanHealth
        }
    }
    championRequests {
      nodes {
        id
        status
      }
    }
    
    user {
          firstName
          lastName
          image
    }
    
    donations {
      nodes {
        id
        amount
        adminFees
        createdAt
        user {
          firstName
          lastName
          image
        }
        orphanNeed {
          amount
          title
          receivedDonationAmount
        }
        donationsCategories {
          nodes {
            id
            amount
            category {
              name
              id
            }
          }
        }
      }
    }
}
${OrphanEducationsFragment.FullOrphanEducations}
${OrphanHealthsFragment.FullOrphanHealth}
`

export const ChildrenFragment = {
	BasicOrphanChild,
	FullOrphanChild
}