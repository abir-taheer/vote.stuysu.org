import { gql, useMutation, useQuery } from "@apollo/client";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import ProfileChangeCard from "../../../comps/candidate/ProfileChangeCard";
import CenteredCircularProgress from "../../../comps/shared/CenteredCircularProgress";
import layout from "../../../styles/layout.module.css";

const QUERY = gql`
  query {
    pendingCandidateProfileChanges {
      ... on CandidateProfileStringChange {
        id

        createdBy {
          name
          email
        }

        field
        value

        reviewed
        reviewedBy {
          name
          email
        }
        approved
        reasonForRejection

        createdAt
        reviewedAt
        updatedAt
        candidate {
          name
          picture {
            alt
            resource {
              width
              height
              url
            }
          }
        }
      }

      ... on CandidateProfilePictureChange {
        id

        createdBy {
          name
          email
        }

        field
        picture {
          id
          alt
          resource {
            height
            width
            url
          }
        }

        reviewed
        reviewedBy {
          name
          email
        }
        approved
        reasonForRejection

        createdAt
        reviewedAt
        updatedAt
        candidate {
          name
          picture {
            alt
            resource {
              width
              height
              url
            }
          }
        }
      }
    }
  }
`;

const REVIEW_MUTATION = gql`
  mutation ($id: ObjectID!, $approved: Boolean!, $reasonForRejection: String) {
    reviewCandidateProfileChange(
      id: $id
      approved: $approved
      reasonForRejection: $reasonForRejection
    ) {
      __typename
    }
  }
`;

export default function AdminApprovals() {
  const { data, loading, refetch } = useQuery(QUERY);

  const [review, { loading: reviewing }] = useMutation(REVIEW_MUTATION, {
    update: () => {
      refetch();
    },
  });

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Typography variant={"h1"} align={"center"}>
        Pending Approvals |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      {loading && <CenteredCircularProgress />}

      {!loading && !data?.pendingCandidateProfileChanges?.length && (
        <Typography variant={"body1"} align={"center"}>
          No items pending review.
        </Typography>
      )}

      {!loading && !!data?.pendingCandidateProfileChanges?.length && (
        <Stack direction={"column"} spacing={3}>
          {data?.pendingCandidateProfileChanges.map((change) => (
            <ProfileChangeCard
              {...change}
              key={change.id}
              showRejectButton
              showApproveButton
              disabled={reviewing}
              onApproval={() =>
                review({
                  variables: {
                    id: change.id,
                    approved: true,
                  },
                })
              }
              onRejection={(reasonForRejection) => {
                review({
                  variables: {
                    id: change.id,
                    approved: false,
                    reasonForRejection,
                  },
                });
              }}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
