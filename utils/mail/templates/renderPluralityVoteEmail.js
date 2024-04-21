export const renderPluralityVoteEmail = ({ election, vote, choice }) => {
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
            width: 100%;
            min-height: 600px;
        }

        .card {
            border-radius: 10px;
            padding: 20px;
            border: 2px solid rgba(108, 92, 231, 0.1);
            width: 600px;
            max-width: 90%;
            margin: auto;
        }

        .text-center {
            text-align: center;
        }

        .checkmark {
            width: 100px;
            height: 100px;
            text-align: center;
        }

        p {
            font-weight: lighter;
            margin: 28px 10px;
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
        <div class="text-center">
            <img
                src="https://vote.stuysu.org/email-checkmark.png"
                class="checkmark"
                alt="a checkmark icon"
            />
        </div>

        <h1>You've voted!</h1>

        <p>Your vote for ${election.name} was saved.</p>

        <p>You voted for ${choice.name}<p>

        <p>Your Vote ID is: <span class="vote-id">${vote._id.toUpperCase()}</span></p>

        <p>You may audit the election after it has concluded and look up your vote using your Vote ID to ensure that it was recorded correctly.</p>
        <p class="text-center">
            <a href="https://vote.stuysu.org/election/${election.url}/audit">
                https://vote.stuysu.org/election/${election.url}/audit
            </a>
        </p>
    </div>
</div>
</body>
</html>`;
};
