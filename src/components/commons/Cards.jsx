export default function Cards({ icon: Icon, count, detail }) {
  return (
    <div className="card shadow-md bg-[#d6ba73] p-5 rounded-lg font-mono">
      <div className="card-body">
        <h2 className="font-extrabold text-3xl flex justify-between">
          {count}
          {Icon && <Icon className="mt-1" size={25} />}
        </h2>
        <p className="text-lg font-extrabold">
          <span className="block font-semibold text-[#4a2204] tracking-normal">
            {detail}
          </span>
        </p>
      </div>
    </div>
  );
}
