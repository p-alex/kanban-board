interface Props {
  title: string;
  children: React.ReactNode;
}

function Section(props: Props) {
  return (
    <section className="flex flex-col gap-6 mx-auto w-full p-4">
      <div>
        <h2 className="text-2xl font-semibold">{props.title}</h2>
      </div>
      {props.children}
    </section>
  );
}

export default Section;
