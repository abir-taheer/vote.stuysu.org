import { SearchOutlined } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 200 },
  {
    id: "gradYear",
    label: "Graduation Year",
    minWidth: 70,
    align: "right",
  },
];

const styles = {
  tableContainer: {
    maxHeight: 440,
  },
  paper: {
    width: "100%",
    overflow: "hidden",
  },
};

export default function ElectionVotersTable({ voters, election }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const queryWords = query.toLowerCase().split(" ").filter(Boolean);
  const users = voters.filter((user) =>
    queryWords.every(
      (word) =>
        user.name.toLowerCase().includes(word) ||
        user.email.toLowerCase().includes(word)
    )
  );

  return (
    <>
      <Typography variant={"h5"} align={"center"} gutterBottom>
        Voters This Election:
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
          href={`/api/download?data=voters&electionId=${
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
                {columns.map((column) => (
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
              {users
                .slice(page * resultsPerPage, resultsPerPage * (page + 1))
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={users.length}
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
