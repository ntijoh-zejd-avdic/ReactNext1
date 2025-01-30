const Header = ({
  title,
  buttonLabel,
  buttonAction,
  buttonColor = "bg-blue-500",
}) => {
  return (
    <header className="absolute top-0 left-0 w-full bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          className={`text-sm ${buttonColor} hover:opacity-90 text-white py-2 px-4 rounded`}
          onClick={buttonAction}
        >
          {buttonLabel}
        </button>
      </div>
    </header>
  );
};

export default Header;
