import { gql } from "apollo-server-micro";

export default gql`
  type Candidate {
    """
    ID of the candidate
    """
    id: ObjectID!
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

    """
    Returns true if the user is signed in and is a campaign manager for this candidate
    """
    isManager: Boolean

    """
    Any strikes that have been assigned to this candidate
    """
    strikes: [Strike!]!

    """
    The sum of the weight of all of the strikes assigned to this candidate
    """
    totalStrikes: NonNegativeFloat!

    """
    All changes proposed to the candidate's profile
    """
    profileChanges: [CandidateProfileChange!]!
  }
`;
