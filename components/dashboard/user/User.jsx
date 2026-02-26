import useUserSummaryCards from "../../../hooks/useUserSummaryCards";
import UserSummaryCard from "./UserSummaryCard";
import MyExpense from "./MyExpense";

export default function User() {
  const { userSummaryCards } = useUserSummaryCards();
  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {userSummaryCards.map((card) => (
          <UserSummaryCard key={card.label} {...card} />
        ))}
      </div>
      <MyExpense />
    </>
  );
}
