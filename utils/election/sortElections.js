const desiredOrder = ["student", "su", "senior", "junior", "soph", "freshman"];

export default function sortElections(elections) {
  elections.sort((a, b) => {
    const startDiff = new Date(b.start) - new Date(a.start);
    const endDiff = new Date(b.end) - new Date(a.end);

    if (startDiff) {
      return startDiff;
    }

    if (endDiff) {
      return endDiff;
    }

    return (
      desiredOrder.findIndex((word) => a.name.toLowerCase().includes(word)) -
      desiredOrder.findIndex((word) => b.name.toLowerCase().includes(word))
    );
  });

  return elections;
}
