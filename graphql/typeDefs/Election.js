import { gql } from "apollo-server-micro";

export default gql`
  type Election {
    id: ObjectId!
    name: String!
    url: String!
    picture: Picture!
    allowedGradYears: [Int!]!
    type: ElectionType!
    start: DateTime!
    end: DateTime!
    completed: Boolean!
    candidates: [Candidate!]!

    """
    Returns null if the user is not signed in
    Returns true if the current signed in user is eligible to vote in this election
    Returns false otherwise
    """
    userIsEligible: Boolean

    """
    Returns whether or not votes can be collected at the moment for the current election
    (If the election is not completed and the current time is in between the start and end time)
    """
    isOpen: Boolean!
  }
`;
