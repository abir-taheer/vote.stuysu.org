import { gql } from "apollo-server-micro";

export default gql`
  """
  Represents the information about a resource that would be obtained from the cloudinary api
  """
  type CloudinaryResource {
    """
    The public id of the resource
    """
    id: String

    """
    For images and videos, the width of the resource
    """
    width: PositiveInt

    """
    For images and videos, the height of the resource
    """
    height: PositiveInt

    """
    The format of the resource, jpg, gif, svg, etc.
    """
    format: String

    """
    The type of the resource, usually "image" or "video"
    """
    resourceType: String

    """
    The datetime that the resource was created
    """
    createdAt: DateTime

    """
    A dynamically generated url of the resource, hosted on cloudinary
    """
    url: NonEmptyString
  }
`;
