import stringify from "csv-stringify";
import nextConnect from "next-connect";
import Candidate from "../../models/candidate";
import Election from "../../models/election";
import User from "../../models/user";
import HTTPError from "../../utils/errors/HTTPError";
import checkAuth from "../../utils/middleware/checkAuth";
import errorHandler from "../../utils/middleware/errorHandler";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stringifyCSV = (input) =>
  new Promise((resolve, reject) => {
    stringify(input, { quoted_string: true }, function (err, output) {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });

const apiRoute = nextConnect({ onError: errorHandler });
// Adds the middleware to Next-Connect
apiRoute.use(checkAuth);

apiRoute.get(async (req, res) => {
  if (!req.signedIn || !req.user) {
    throw new HTTPError(
      401,
      "You need to provide authentication to use this endpoint"
    );
  }

  const allowedData = ["voters", "votes"];

  if (!allowedData.includes(req.query.data)) {
    throw new HTTPError(400, "Unknown data requested");
  }

  if (!req.query.electionId) {
    throw new HTTPError(400, "Election ID must be provided with the request");
  }

  const data = req.query.data;
  const format = req.query.format || "csv";

  const selectMap = {
    voters: "+voterIds",
    votes: "+runoffVotes +pluralityVotes",
  };

  const election = await Election.findOne({ _id: req.query.electionId }).select(
    selectMap[data]
  );

  if (!election) {
    throw new HTTPError(400, "There's no election with that id");
  }

  if (!election.completed) {
    throw new HTTPError(
      401,
      "The requested data is not yet public for this election."
    );
  }

  if (data === "voters") {
    const users = await User.idLoader.loadMany(election.voterIds);

    users.sort((a, b) => {
      const aName = a.firstName + a.lastName;
      const bName = b.firstName + b.lastName;

      let comparison = aName.localeCompare(bName);

      if (comparison === 0) {
        comparison = a.email.localeCompare(b.email);
      }

      return comparison;
    });

    if (format === "csv") {
      const formatted = [
        ["Name", "Email", "Graduation Year"],
        ...users.map((u) => [
          `${u.firstName} ${u.lastName}`,
          u.email,
          u.gradYear,
        ]),
      ];

      const csv = await stringifyCSV(formatted);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=\"${election.name.replace(
          /[^a-z0-9- ]/gi,
          ""
        )} Voters.csv\"`
      );
      res.send(csv);
    }

    if (format === "json") {
      const formatted = users.map((u) => ({
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        gradYear: u.gradYear,
      }));

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(formatted, null, "\t"));
    }
  }

  const candidateMap = {};
  const candidates = await Candidate.find({
    electionId: election.id.toString(),
  });

  candidates.forEach((c) => (candidateMap[c.id] = c));

  if (data === "votes") {
    let votes;

    if (election.type === "runoff") {
      votes = election.runoffVotes.map((vote) => {
        return {
          id: vote.id,
          choices: vote.choices.map((c) => candidateMap[c].name),
        };
      });
    }

    if (election.type === "plurality") {
      votes = election.pluralityVotes.map((vote) => {
        return {
          id: vote.id,
          choice: candidateMap[vote.choice].name,
        };
      });
    }

    if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(votes, null, "\t"));
    }

    if (format === "csv") {
      if (election.type === "runoff") {
        const headers = ["Vote ID"];
        candidates.forEach((a, i) => headers.push("Choice " + (i + 1)));

        const formatted = [
          headers,
          ...votes.map(({ id, choices }) => [id, ...choices]),
        ];

        const csv = await stringifyCSV(formatted);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=\"${election.name.replace(
            /[^a-z0-9- ]/gi,
            ""
          )} Votes.csv\"`
        );
        res.send(csv);
      }

      if (election.type === "plurality") {
        const headers = ["Vote ID", "Choice"];
        const formatted = [headers, ...votes.map((a) => [a.id, a.choice])];

        const csv = await stringifyCSV(formatted);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=\"${election.name.replace(
            /[^a-z0-9- ]/gi,
            ""
          )} Votes.csv\"`
        );

        res.send(csv);
      }
    }
  }
});

export default apiRoute;
