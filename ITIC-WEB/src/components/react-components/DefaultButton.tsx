function DefaultButton({ h2, classProp }) {
  return (
    <button class={`DefaultButton ${classProp}`}>{h2}</button>
  );
}

export default DefaultButton;