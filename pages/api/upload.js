import { randomBytes } from "crypto";
import multer from "multer";
import nextConnect from "next-connect";
import Candidate from "../../models/candidate";
import Election from "../../models/election";
import Picture from "../../models/picture";
import uploadBuffer from "../../utils/cloudinary/uploadBuffer";
import HTTPError from "../../utils/errors/HTTPError";
import checkAuth from "../../utils/middleware/checkAuth";
import errorHandler from "../../utils/middleware/errorHandler";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Returns a Multer instance that provides several methods for generating
// middleware that process files uploaded in multipart/form-data format.
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 20 },
}).single("file");

const apiRoute = nextConnect({ onError: errorHandler });
// Adds the middleware to Next-Connect
apiRoute.use(uploadMiddleware);
apiRoute.use(checkAuth);

apiRoute.post(async (req, res) => {
  if (!req.signedIn || !req.user) {
    throw new HTTPError(
      401,
      "You need to provide authentication to use this endpoint"
    );
  }

  const file = req.file;
  const alt = req.body?.alt;

  if (!file) {
    throw new HTTPError(400, "There was no file included with this request");
  }

  if (!alt) {
    throw new HTTPError(400, "An alt text is required to upload an image");
  }

  if (!file.mimetype?.startsWith("image/")) {
    throw new HTTPError(400, "The uploaded file is not a valid picture");
  }

  if (!process.env.CLOUDINARY_URL) {
    throw new HTTPError(
      503,
      "Cloudinary api key is not configured. Email abir@taheer.me to take care of this"
    );
  }

  const openElections = await Election.find({ completed: false });

  const idsOfOpenElections = openElections.map((e) => e.id);

  const candidateManaged = await Candidate.findOne({
    electionId: { $in: idsOfOpenElections },
    managerIds: req.user.id,
  });

  if (!candidateManaged && !req.user.adminPrivileges) {
    throw new HTTPError(
      403,
      "You don't have the necessary permissions to use this endpoint"
    );
  }

  // Now that the validation is complete we can actually upload the image
  let publicId;

  const randString = randomBytes(8).toString("hex");

  if (req.user.adminPrivileges) {
    publicId = "admin/" + randString;
  } else {
    publicId = candidateManaged.url + "/" + randString;
  }

  const resource = await uploadBuffer(file.buffer, publicId);

  const pic = await Picture.create({
    alt,
    resourceId: resource.public_id,
    uploadedBy: req.user.id,
  });

  const data = {
    id: pic.id,
    resourceId: resource.public_id,
    width: resource.width,
    height: resource.height,
    format: resource.format,
    url: resource.secure_url,
  };

  res.json({ success: true, data });
});

export default apiRoute;
