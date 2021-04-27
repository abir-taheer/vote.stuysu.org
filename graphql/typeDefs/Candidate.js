import { gql } from "apollo-server-micro";

export default gql`
  type Candidate {
    """
    ID of the candidate
    """
    id: ObjectId!
    """
    Name of the candidate
    """
    name: NonEmptyString!

    """
    Short blurb (max 200 characters) describing the candidate's platform
    """
    blurb: String!

    """
    Detailed information about the candidate and their campaign promises
    """
    platform: String!

    """
    Url of the candidate
    """
    url: NonEmptyString!

    """
    The election that the candidate belongs to
    """
    election: Election!

    """
    The candidate's profile picture
    """
    picture: Picture!

    """
    Whether or not the candidate is in good standing (not suspended)
    """
    active: Boolean!

    """
    Users who are able to manage the candidate's presence on the site
    """
    managers: [User!]!
  }
`;
