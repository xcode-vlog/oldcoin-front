interface Props {
  children?: Readonly<React.ReactNode>;
}
function NoImage({ children }: Props) {
  return (
    <div className="w-full h-full bg-gray-200 flex flex-col justify-center items-center rounded-2xl box-border">
      <span className="text-white">{children}</span>
    </div>
  );
}

export { NoImage };
