import { gql, useQuery } from "@apollo/client";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import CenteredCircularProgress from "../shared/CenteredCircularProgress";
import ElectionVotersTable from "./ElectionVotersTable";

const QUERY = gql`
  query ($id: ObjectID!) {
    allVoters(election: { id: $id }) {
      name
      email
      gradYear
    }
    allVotes(election: { id: $id }) {
      ... on RunoffVote {
        id
        choices {
          id
          name
        }
        gradYear
      }
    }
  }
`;

function getVoteColumns(numChoices) {
  const voteColumns = [{ id: "id", label: "Vote ID", minWidth: 170 }];

  for (let i = 1; i < numChoices + 1; i++) {
    voteColumns.push({
      id: "id",
      label: "Choice " + i,
      minWidth: 60,
    });
  }

  return voteColumns;
}

const styles = {
  title: {
    marginTop: "3rem",
  },
  noChoice: {
    opacity: 0.7,
  },
  tableContainer: {
    maxHeight: 440,
  },
  paper: {
    width: "100%",
    overflow: "hidden",
  },
};

export default function RunoffAudit({ election }) {
  const { data, loading, error } = useQuery(QUERY, {
    variables: { id: election.id },
  });

  const [query, setQuery] = useState("");

  const [page, setPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(25);

  if (loading) {
    return <CenteredCircularProgress />;
  }

  if (error) {
    return (
      <Typography align={"center"} variant={"body1"} color={"error"} paragraph>
        Unexpected Error: {error.message}
      </Typography>
    );
  }

  if (!data) {
    return <CenteredCircularProgress />;
  }

  const queryWords = query.toLowerCase().split(" ").filter(Boolean);
  const votes = data.allVotes.filter((vote) =>
    queryWords.every((word) =>
      vote.id.toLowerCase().includes(word.toLowerCase())
    )
  );

  return (
    <>
      <ElectionVotersTable voters={data.allVoters} election={election} />

      <Typography
        variant={"h5"}
        align={"center"}
        gutterBottom
        sx={styles.title}
      >
        Votes Recorded:
      </Typography>
      <Typography
        variant={"subtitle2"}
        color={"text.secondary"}
        align={"center"}
        gutterBottom
      >
        If you took part in the election make sure you're present in the list
        below
      </Typography>
      <Typography variant={"subtitle2"} align={"center"} gutterBottom>
        <Link
          href={`/api/download?data=votes&electionId=${
            election.id
          }&format=csv&jwt=${localStorage.getItem("auth-jwt")}`}
          target={"_blank"}
        >
          Download as CSV
        </Link>
      </Typography>

      <TextField
        fullWidth
        label={"Search"}
        InputProps={{
          startAdornment: <SearchOutlined />,
        }}
        variant={"outlined"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Paper sx={styles.paper}>
        <TableContainer sx={styles.tableContainer}>
          <Table stickyHeader aria-label="voters table">
            <TableHead>
              <TableRow>
                {getVoteColumns(election.candidates.length).map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {votes
                .slice(page * resultsPerPage, resultsPerPage * (page + 1))
                .map((vote) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={vote.id}>
                      <TableCell>{vote.id}</TableCell>
                      {election.candidates.map((_, i) => (
                        <TableCell
                          key={i}
                          color={vote.choices[i] ? "primary" : "text.secondary"}
                        >
                          {vote.choices[i]?.name || (
                            <Typography
                              variant={"body2"}
                              color={"error"}
                              sx={styles.noChoice}
                            >
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={votes.length}
          rowsPerPage={resultsPerPage}
          page={page}
          onPageChange={(event, page) => setPage(page)}
          onRowsPerPageChange={(ev) => {
            setPage(0);
            setResultsPerPage(+ev.target.value);
          }}
        />
      </Paper>
    </>
  );
}
