import { gql } from "apollo-server-micro";

export default gql`
  """
  Inputs fields that can identify a single election. Only one needs to be provided
  """
  input electionIdentifier {
    """
    Url of the election. For the election at https://vote.stuysu.org/election/senior-caucus-20-21 the url is "senior-caucus-20-21"
    """
    url: NonEmptyString

    """
    Id of the election, must be a valid object id
    """
    id: ObjectId
  }

  enum sortTypes {
    random
    alphabeticalDesc
    alphabeticalAsc
  }

  type Query {
    """
    Returns the current user if authentication is provided (is signed in), otherwise returns null
    """
    authenticatedUser: User

    """
    Takes an object id and returns the election with the matching id
    """
    electionById(id: ObjectId!): Election

    """
    Takes a url and returns the matching election.
    Example: For the election at https://vote.stuysu.org/election/senior-caucus-20-21 the url is 'senior-caucus-20-21'
    """
    electionByUrl(url: NonEmptyString!): Election

    """
    Takes an object id and returns the candidate with the matching id
    """
    candidateById(id: ObjectId!): Candidate

    """
    Returns the candidate from the given election that has the specified url or null if there are no matches
    """
    candidateByUrl(
      url: NonEmptyString!
      election: electionIdentifier!
    ): Candidate

    """
    Returns all the candidates for a given election, can be filtered and sorted
    By default it's sorted by random for fairness
    """
    candidatesByElectionId(
      electionId: ObjectId!
      query: String! = ""
      sort: sortTypes! = random
    ): [Candidate!]!

    """
    Takes the id of an election and returns whether or not the current signed in user has voted for that election
    Returns null if the user is not signed in
    """
    userHasVoted(election: electionIdentifier!): Boolean

    """
    Returns elections that match the query regardless of completion status
    """
    allElections(
      """
      A string used to filter elections
      """
      query: String! = ""
      """
      The page requested, if the string has more than one page of results.
      """
      page: PositiveInt! = 1
      """
      Number of results on each page. Must be between 1 and 50. Default is 9
      """
      resultsPerPage: PositiveInt! = 9
    ): ElectionQueryResult!

    """
    Returns elections that match the query that have completed set to false
    """
    openElections(
      """
      A string used to filter elections
      """
      query: String! = ""
      """
      The page requested, if the string has more than one page of results.
      """
      page: PositiveInt! = 1
      """
      Number of results on each page. Must be between 1 and 50. Default is 9
      """
      resultsPerPage: PositiveInt! = 9
    ): ElectionQueryResult!

    """
    Returns users that match the given query
    """
    allUsers(
      """
      A string used to filter users
      """
      query: String! = ""
      """
      The page requested, if the query has more than one page of results.
      """
      page: PositiveInt! = 1
      """
      Number of results on each page. Must be between 1 and 50. Default is 9
      """
      resultsPerPage: PositiveInt! = 9
    ): UserQueryResult

    """
    Returns the user with the given object id or null if no users were found
    """
    userById(id: ObjectId!): User

    """
    Takes the id of a user and returns whether or not that user can be deleted
    ONLY ADMINS CAN USE THIS
    """
    userIsDeletable(id: ObjectId!): Boolean!

    """
    Returns an array of users with the object ids given, preserving the original order.
    Any object ids not found will be null in the returned arry
    """
    usersById(ids: [ObjectId!]!): [User]!

    """
    Takes an id and returns the announcement that it belongs to
    """
    announcementById(id: ObjectId!): Announcement

    allAnnouncements(
      """
      A string used to filter announcements by title and content
      """
      query: String! = ""

      """
      The page requested, if the query has more than one page of results.
      """
      page: PositiveInt! = 1

      """
      Number of results on each page. Must be between 1 and 50. Default is 9
      """
      resultsPerPage: PositiveInt! = 9
    ): AnnouncementQueryResult!

    """
    Returns elections that match the query that have completed set to true
    """
    pastElections(
      """
      A string used to filter elections
      """
      query: String! = ""
      """
      The page requested, if the string has more than one page of results.
      """
      page: PositiveInt! = 1
      """
      Number of results on each page. Must be between 1 and 50. Default is 9
      """
      resultsPerPage: PositiveInt! = 9
    ): ElectionQueryResult!

    """
    Admins Only!
    Returns all photos that were uploaded to the admin folder on cloudinary
    """
    adminPictures: [Picture!]!

    """
    Takes an object id and returns the picture object with the matching id
    """
    pictureById(id: ObjectId!): Picture

    """
    Takes an election identifier and returns the results of that election if available to the current user
    """
    electionResults(election: electionIdentifier!): ElectionResult!

    """
    Returns the current datetime on the server
    """
    date: DateTime!

    """
    Returns the current public key used to sign cross site requests
    """
    publicKey: PublicKey!
  }
`;
