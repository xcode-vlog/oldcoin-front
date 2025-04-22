function PageTitle({
  title,
  children,
}: {
  title: string;
  children?: Readonly<React.ReactNode>;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl">{title}</h1>
        {children}
      </div>
    </div>
  );
}

export { PageTitle };
