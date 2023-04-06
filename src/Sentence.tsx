const Letter = (props: { color: string; letter: string }) => {
  return <span className={props.color}>{props.letter}</span>;
};

const Sentence = (props: { sentence: string; input: string }) => {
  const letters = [...props.sentence].map((letter, index) => {
    const color =
      props.input.length - 1 < index
        ? "text-secondary"
        : props.input[index] == letter
        ? "text-primary"
        : "text-danger";
    return <Letter key={index} color={color} letter={letter} />;
  });
  return <h2>{letters}</h2>;
};

export default Sentence;
