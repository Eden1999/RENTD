import { useState } from "react";

function NumberInput(props) {
  const [value, setValue] = useState(0);

  const increase = (event) => {
    event.preventDefault();
    setValue(value + 1);
    props.setValue(value + 1);
  };

  const decrease = (event) => {
    event.preventDefault();
    setValue(value - 1);
    props.setValue(value - 1);
  };

  const overrideInputButtons = `
    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

  return (
    <div className="form-control">
      <div className="input-group">
        <button className="btn btn-square btn-lg" onClick={(e) => decrease(e)}>
          -
        </button>
        <input
          id={props.id}
          type="number"
          value={value}
          required
          min={0}
          className="input input-bordered input-lg w-full bg-zinc-700 text-white text-center"
          onChange={(event) => {
            setValue(event.target.value);
            props.setValue(event.target.value);
          }}
        />
        <button className="btn btn-square btn-lg" onClick={(e) => increase(e)}>
          +
        </button>
      </div>
      <style>{overrideInputButtons}</style>
    </div>
  );
}

export default NumberInput;
