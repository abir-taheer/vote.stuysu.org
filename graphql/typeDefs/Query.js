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
    id: ObjectID
  }

  type Query {
    """
    Returns the current user if authentication is provided (is signed in), otherwise returns null
    """
    authenticatedUser: User

    """
    Takes an object id and returns the election with the matching id
    """
    electionById(id: ObjectID!): Election

    """
    Takes a url and returns the matching election.
    Example: For the election at https://vote.stuysu.org/election/senior-caucus-20-21 the url is 'senior-caucus-20-21'
    """
    electionByUrl(url: NonEmptyString!): Election

    """
    Takes an object id and returns the candidate with the matching id
    """
    candidateById(id: ObjectID!): Candidate

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
      electionId: ObjectID!
      query: String! = ""
      sort: SortType! = random
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
    userById(id: ObjectID!): User

    """
    Takes the id of a user and returns whether or not that user can be deleted
    ONLY ADMINS CAN USE THIS
    """
    userIsDeletable(id: ObjectID!): Boolean!

    """
    Returns an array of users with the object ids given, preserving the original order.
    Any object ids not found will be null in the returned arry
    """
    usersById(ids: [ObjectID!]!): [User]!

    """
    Takes an id and returns the announcement that it belongs to
    """
    announcementById(id: ObjectID!): Announcement

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
    pictureById(id: ObjectID!): Picture

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

    """
    Get all of the votes for a certain election
    """
    allVotes(election: electionIdentifier!): [Vote!]!

    """
    Get all the users who voted in a certain election
    """
    allVoters(election: electionIdentifier!): [User!]!

    """
    Takes an id and returns the associated FAQ Object
    Returns null if there aren't any faqs with that id
    """
    faqById(id: ObjectID!): FAQ

    """
    Takes the url of an faq and returns the associated FAQ Object
    Returns null if there's no FAQ with that url
    """
    faqByUrl(url: NonEmptyString!): FAQ

    allFAQs(
      """
      A string used to filter faqs
      """
      query: String! = ""
      """
      The page requested, if the string has more than one page of results.
      """
      page: PositiveInt! = 1
      """
      Number of results on each page. Must be between 1 and 100. Default is 15
      """
      resultsPerPage: PositiveInt! = 15
    ): FAQQueryResult!

    """
    All profile changes with their reviewed property set to false
    """
    pendingCandidateProfileChanges: [CandidateProfileChange!]!

    """
    Candidates that this user has the ability to manage
    """
    candidatesManagedByAuthenticatedUser: [Candidate!]

    """
    Returns elections that haven't been completed or ended later than 30 days ago
    """
    currentElections: [Election!]!
  }
`;
