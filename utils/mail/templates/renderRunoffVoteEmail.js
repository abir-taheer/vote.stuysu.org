export const renderRunoffVoteEmail = ({ election, vote, choices }) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Roboto, Helvetica, 'sans-serif';
        }

        h1 {
            color: #6c5ce7;
            text-align: center;
            font-weight: 400;
        }

        .flex-root {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 600px;
        }

        .card {
            border-radius: 10px;
            padding: 20px;
            border: 2px solid rgba(108, 92, 231, 0.1);
            width: 600px;
            max-width: 90%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .checkmark {
            width: 100px;
            height: 100px;
            text-align: center;
        }

        p {
            font-weight: lighter;
        }

        .vote-id {
            font-weight: bold;
            border: 1px solid rgba(0,0,0,0.1);
            color: #10ac84;
            border-radius: 10px;
            padding: 8px;
        }
    </style>
</head>
<body>
<div class="flex-root">
<div class="card">
    <img
        src="https://vote.stuysu.org/email-checkmark.png"
        class="checkmark"
        alt="a checkmark icon"
    />
    <h1>You've voted!</h1>

    <p>Your vote for ${election.name} was saved.</p>

    <p>Below are your rankings:</p>

    <ol>
        ${choices.map((candidate) => `<li>${candidate.name}</li>`).join("")}
    </ol>

    <p>Your Vote ID is: <span class="vote-id">${vote._id.toUpperCase()}</span></p>

    <p>You may audit the election after it has concluded and look up your vote using your Vote ID to ensure that it was recorded correctly.</p>
    <p>
        <a href="https://vote.stuysu.org/election/${election.url}/audit">
            https://vote.stuysu.org/election/${election.url}/audit
        </a>
    </p>
</div>
</div>
</body>
</html>`;
};
