export default function TotalExpense({ totalExpense }) {
  return (
    <div className="text-right">
      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        Total
      </p>
      <p className="font-heading text-green mt-0.5 text-xl font-bold">
        {totalExpense.toLocaleString()} TSH
      </p>
    </div>
  );
}
