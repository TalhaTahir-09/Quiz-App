interface ButtonProps {
  title: string;
  onSubmit: any;
}

function Button({ title, onSubmit }: ButtonProps) {
  return (
    <button
      className="submit-btn bg-blue-500 transition duration-250 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-indigo-500"
      onClick={onSubmit}
    >
      {title}
    </button>
  );
}

export default Button;
