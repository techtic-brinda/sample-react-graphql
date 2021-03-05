import gql from 'graphql-tag';

const DashboardDetail = gql`
fragment DashboardDetail on DashboardData {
  data {
    currentStatus {
      complete_requirement
      donation_count
      image
      orphan_id
      orphan_name
      pending_requirement
      total_requirement
    }
    newChild {
      id
      image
      name
    }
    totalChilds
    status
  }
}
`

export const DashboardFragment = {
  DashboardDetail,
}